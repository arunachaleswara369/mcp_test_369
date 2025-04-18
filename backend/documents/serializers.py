from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Document, Comment, SharedDocument, DocumentVersion

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal serializer for User model."""
    
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'profile_picture')
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for the Comment model."""
    
    author = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('id', 'author', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments."""
    
    class Meta:
        model = Comment
        fields = ('id', 'document', 'content')
        read_only_fields = ('id',)


class SharedDocumentSerializer(serializers.ModelSerializer):
    """Serializer for the SharedDocument model."""
    
    shared_with = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = SharedDocument
        fields = ('id', 'shared_with', 'permission', 'created_at')
        read_only_fields = ('id', 'created_at')


class SharedDocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating shared documents."""
    
    class Meta:
        model = SharedDocument
        fields = ('id', 'document', 'shared_with', 'permission')
        read_only_fields = ('id',)


class DocumentVersionSerializer(serializers.ModelSerializer):
    """Serializer for the DocumentVersion model."""
    
    created_by = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = DocumentVersion
        fields = ('id', 'version_number', 'file', 'file_size', 'created_by', 'created_at', 'comment')
        read_only_fields = ('id', 'file_size', 'created_at')


class DocumentVersionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating document versions."""
    
    class Meta:
        model = DocumentVersion
        fields = ('id', 'document', 'file', 'version_number', 'comment')
        read_only_fields = ('id',)


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for the Document model."""
    
    owner = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = Document
        fields = (
            'id', 'title', 'description', 'file', 'file_type', 'file_size',
            'owner', 'created_at', 'updated_at', 'is_public', 'slug'
        )
        read_only_fields = ('id', 'file_size', 'file_type', 'created_at', 'updated_at', 'slug')


class DocumentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for the Document model."""
    
    owner = UserMinimalSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    shares = SharedDocumentSerializer(many=True, read_only=True)
    versions = DocumentVersionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = (
            'id', 'title', 'description', 'file', 'file_type', 'file_size',
            'owner', 'created_at', 'updated_at', 'is_public', 'slug',
            'comments', 'shares', 'versions'
        )
        read_only_fields = ('id', 'file_size', 'file_type', 'created_at', 'updated_at', 'slug')


class DocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating documents."""
    
    class Meta:
        model = Document
        fields = ('id', 'title', 'description', 'file', 'is_public')
        read_only_fields = ('id',)