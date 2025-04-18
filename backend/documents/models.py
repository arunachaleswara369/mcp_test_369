from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid
import os


def document_file_path(instance, filename):
    """Generate file path for new document file."""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('documents', str(instance.owner.id), filename)


class Document(models.Model):
    """Document model for storing document files."""
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=document_file_path)
    file_type = models.CharField(max_length=50, blank=True)
    file_size = models.PositiveIntegerField(default=0)  # Size in bytes
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure uniqueness of slug
            if Document.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{uuid.uuid4().hex[:8]}"
        
        # Set file size and type if file is provided
        if self.file and not self.file_size:
            self.file_size = self.file.size
            
        if self.file and not self.file_type:
            filename = self.file.name
            self.file_type = filename.split('.')[-1].lower()
            
        super().save(*args, **kwargs)


class Comment(models.Model):
    """Comment model for document comments."""
    
    document = models.ForeignKey(
        Document, 
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.get_full_name()} on {self.document.title}"


class SharedDocument(models.Model):
    """Model for tracking document shares."""
    
    PERMISSION_CHOICES = (
        ('view', 'View Only'),
        ('edit', 'Edit'),
        ('comment', 'Comment'),
    )
    
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='shares'
    )
    shared_with = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shared_documents'
    )
    permission = models.CharField(
        max_length=10,
        choices=PERMISSION_CHOICES,
        default='view'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['document', 'shared_with']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.document.title} shared with {self.shared_with.get_full_name()}"


class DocumentVersion(models.Model):
    """Model for tracking document versions."""
    
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='versions'
    )
    file = models.FileField(upload_to=document_file_path)
    file_size = models.PositiveIntegerField(default=0)
    version_number = models.PositiveIntegerField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='document_versions'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-version_number']
        unique_together = ['document', 'version_number']
    
    def __str__(self):
        return f"{self.document.title} - v{self.version_number}"
    
    def save(self, *args, **kwargs):
        # Set file size if file is provided
        if self.file and not self.file_size:
            self.file_size = self.file.size
            
        super().save(*args, **kwargs)