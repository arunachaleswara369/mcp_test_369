from django.contrib import admin
from .models import Document, Comment, SharedDocument, DocumentVersion


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0


class SharedDocumentInline(admin.TabularInline):
    model = SharedDocument
    extra = 0


class DocumentVersionInline(admin.TabularInline):
    model = DocumentVersion
    extra = 0
    readonly_fields = ('file_size', 'created_at')


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'file_type', 'file_size', 'created_at', 'updated_at', 'is_public')
    list_filter = ('file_type', 'is_public', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'owner__email')
    readonly_fields = ('file_size', 'file_type', 'created_at', 'updated_at', 'slug')
    inlines = [CommentInline, SharedDocumentInline, DocumentVersionInline]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('document', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'document__title', 'author__email')


@admin.register(SharedDocument)
class SharedDocumentAdmin(admin.ModelAdmin):
    list_display = ('document', 'shared_with', 'permission', 'created_at')
    list_filter = ('permission', 'created_at')
    search_fields = ('document__title', 'shared_with__email')


@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ('document', 'version_number', 'created_by', 'file_size', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('document__title', 'comment', 'created_by__email')
    readonly_fields = ('file_size', 'created_at')