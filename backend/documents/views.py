from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Document, Comment, SharedDocument, DocumentVersion
from .serializers import (
    DocumentSerializer, DocumentDetailSerializer, DocumentCreateSerializer,
    CommentSerializer, CommentCreateSerializer,
    SharedDocumentSerializer, SharedDocumentCreateSerializer,
    DocumentVersionSerializer, DocumentVersionCreateSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner
        return obj.owner == request.user


class HasDocumentPermission(permissions.BasePermission):
    """
    Custom permission to check if user has permission to access a document.
    """
    
    def has_object_permission(self, request, view, obj):
        # Allow if user is the owner
        if obj.owner == request.user:
            return True
            
        # Allow if document is public and the request is a safe method
        if obj.is_public and request.method in permissions.SAFE_METHODS:
            return True
            
        # Allow if document is shared with the user
        return SharedDocument.objects.filter(
            document=obj,
            shared_with=request.user
        ).exists()


class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Document instances.
    """
    
    queryset = Document.objects.all()
    permission_classes = [permissions.IsAuthenticated, HasDocumentPermission]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'updated_at', 'file_size']
    lookup_field = 'slug'
    
    def get_queryset(self):
        """
        This view should return a list of all documents
        for the currently authenticated user plus public documents
        and documents shared with the user.
        """
        user = self.request.user
        return Document.objects.filter(
            Q(owner=user) | 
            Q(is_public=True) | 
            Q(shares__shared_with=user)
        ).distinct()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentCreateSerializer
        elif self.action in ['retrieve', 'get_by_id']:
            return DocumentDetailSerializer
        return DocumentSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, slug=None):
        """Get comments for a specific document."""
        document = self.get_object()
        comments = Comment.objects.filter(document=document)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def versions(self, request, slug=None):
        """Get versions for a specific document."""
        document = self.get_object()
        versions = DocumentVersion.objects.filter(document=document)
        serializer = DocumentVersionSerializer(versions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def shares(self, request, slug=None):
        """Get shares for a specific document."""
        document = self.get_object()
        # Only document owner can see all shares
        if document.owner != request.user:
            return Response(
                {"detail": "You do not have permission to view all shares."},
                status=status.HTTP_403_FORBIDDEN
            )
        shares = SharedDocument.objects.filter(document=document)
        serializer = SharedDocumentSerializer(shares, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_documents(self, request):
        """Get documents owned by the current user."""
        documents = Document.objects.filter(owner=request.user)
        page = self.paginate_queryset(documents)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def shared_with_me(self, request):
        """Get documents shared with the current user."""
        documents = Document.objects.filter(shares__shared_with=request.user)
        page = self.paginate_queryset(documents)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_version(self, request, slug=None):
        """Add a new version to a document."""
        document = self.get_object()
        
        # Check if user has edit permission
        if document.owner != request.user:
            share = SharedDocument.objects.filter(
                document=document,
                shared_with=request.user,
                permission='edit'
            ).first()
            if not share:
                return Response(
                    {"detail": "You do not have permission to add versions."},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Get the latest version number and increment
        latest_version = DocumentVersion.objects.filter(document=document).order_by('-version_number').first()
        version_number = 1
        if latest_version:
            version_number = latest_version.version_number + 1
        
        serializer = DocumentVersionCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                document=document,
                created_by=request.user,
                version_number=version_number
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def share(self, request, slug=None):
        """Share a document with another user."""
        document = self.get_object()
        
        # Only document owner can share
        if document.owner != request.user:
            return Response(
                {"detail": "Only the document owner can share it."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = SharedDocumentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(document=document)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def get_by_id(self, request):
        """Get a document by its ID instead of slug."""
        document_id = request.query_params.get('id', None)
        if document_id is None:
            return Response(
                {"detail": "Document ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        document = get_object_or_404(Document, id=document_id)
        self.check_object_permissions(request, document)
        serializer = self.get_serializer(document)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Comment instances.
    """
    
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer
    
    def get_queryset(self):
        """
        This view should return comments for documents the user has access to.
        """
        user = self.request.user
        return Comment.objects.filter(
            Q(document__owner=user) | 
            Q(document__is_public=True) | 
            Q(document__shares__shared_with=user)
        ).distinct()
    
    def perform_create(self, serializer):
        document = serializer.validated_data['document']
        
        # Check if user has permission to comment
        if document.owner != self.request.user and not document.is_public:
            share = SharedDocument.objects.filter(
                document=document,
                shared_with=self.request.user
            ).first()
            
            if not share or share.permission not in ['edit', 'comment']:
                return Response(
                    {"detail": "You do not have permission to comment on this document."},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer.save(author=self.request.user)


class SharedDocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing SharedDocument instances.
    """
    
    queryset = SharedDocument.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SharedDocumentCreateSerializer
        return SharedDocumentSerializer
    
    def get_queryset(self):
        """
        This view should return shares for documents the user owns
        or shares where the user is the recipient.
        """
        user = self.request.user
        return SharedDocument.objects.filter(
            Q(document__owner=user) | 
            Q(shared_with=user)
        ).distinct()
    
    def perform_create(self, serializer):
        document = serializer.validated_data['document']
        
        # Only document owner can create shares
        if document.owner != self.request.user:
            return Response(
                {"detail": "Only the document owner can share it."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save()


class DocumentVersionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing DocumentVersion instances.
    """
    
    queryset = DocumentVersion.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentVersionSerializer
    
    def get_queryset(self):
        """
        This view should return versions for documents the user has access to.
        """
        user = self.request.user
        return DocumentVersion.objects.filter(
            Q(document__owner=user) | 
            Q(document__is_public=True) | 
            Q(document__shares__shared_with=user)
        ).distinct()