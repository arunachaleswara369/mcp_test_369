import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import documentService, { Document, DocumentDetail, Comment, Share, Version } from '@/lib/documents';

interface DocumentContextType {
  documents: Document[];
  userDocuments: Document[];
  sharedDocuments: Document[];
  currentDocument: DocumentDetail | null;
  isLoading: boolean;
  fetchDocuments: () => Promise<void>;
  fetchUserDocuments: () => Promise<void>;
  fetchSharedDocuments: () => Promise<void>;
  fetchDocumentBySlug: (slug: string) => Promise<DocumentDetail>;
  createDocument: (title: string, description: string, file: File, isPublic: boolean) => Promise<Document>;
  updateDocument: (slug: string, data: Partial<Document>) => Promise<Document>;
  deleteDocument: (slug: string) => Promise<void>;
  addComment: (documentId: number, content: string) => Promise<Comment>;
  deleteComment: (commentId: number) => Promise<void>;
  addVersion: (slug: string, file: File, comment: string) => Promise<Version>;
  shareDocument: (slug: string, userId: number, permission: 'view' | 'edit' | 'comment') => Promise<Share>;
  removeShare: (shareId: number) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch documents',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getUserDocuments();
      setUserDocuments(data);
    } catch (error) {
      console.error('Failed to fetch user documents:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch your documents',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSharedDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await documentService.getSharedDocuments();
      setSharedDocuments(data);
    } catch (error) {
      console.error('Failed to fetch shared documents:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch documents shared with you',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocumentBySlug = async (slug: string) => {
    setIsLoading(true);
    try {
      const data = await documentService.getDocumentBySlug(slug);
      setCurrentDocument(data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch document with slug ${slug}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch document details',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async (title: string, description: string, file: File, isPublic: boolean) => {
    setIsLoading(true);
    try {
      const newDocument = await documentService.createDocument({
        title,
        description,
        file,
        is_public: isPublic,
      });
      
      // Update user documents list
      setUserDocuments((prev) => [newDocument, ...prev]);
      
      toast({
        title: 'Document created',
        description: 'Your document has been created successfully',
      });
      
      return newDocument;
    } catch (error) {
      console.error('Failed to create document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create document',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocument = async (slug: string, data: Partial<Document>) => {
    setIsLoading(true);
    try {
      const updatedDocument = await documentService.updateDocument(slug, data);
      
      // Update documents in state
      setDocuments((prev) => 
        prev.map((doc) => (doc.slug === slug ? updatedDocument : doc))
      );
      
      setUserDocuments((prev) => 
        prev.map((doc) => (doc.slug === slug ? updatedDocument : doc))
      );
      
      setSharedDocuments((prev) => 
        prev.map((doc) => (doc.slug === slug ? updatedDocument : doc))
      );
      
      // Update current document if it's the one being edited
      if (currentDocument && currentDocument.slug === slug) {
        setCurrentDocument({
          ...currentDocument,
          ...updatedDocument,
        });
      }
      
      toast({
        title: 'Document updated',
        description: 'Your document has been updated successfully',
      });
      
      return updatedDocument;
    } catch (error) {
      console.error('Failed to update document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update document',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (slug: string) => {
    setIsLoading(true);
    try {
      await documentService.deleteDocument(slug);
      
      // Remove document from state
      setDocuments((prev) => prev.filter((doc) => doc.slug !== slug));
      setUserDocuments((prev) => prev.filter((doc) => doc.slug !== slug));
      setSharedDocuments((prev) => prev.filter((doc) => doc.slug !== slug));
      
      if (currentDocument && currentDocument.slug === slug) {
        setCurrentDocument(null);
      }
      
      toast({
        title: 'Document deleted',
        description: 'Your document has been deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete document',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (documentId: number, content: string) => {
    setIsLoading(true);
    try {
      const newComment = await documentService.addComment({
        document: documentId,
        content,
      });
      
      // Update current document with new comment
      if (currentDocument && currentDocument.id === documentId) {
        setCurrentDocument({
          ...currentDocument,
          comments: [...currentDocument.comments, newComment],
        });
      }
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully',
      });
      
      return newComment;
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add comment',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    setIsLoading(true);
    try {
      await documentService.deleteComment(commentId);
      
      // Update current document by removing the comment
      if (currentDocument) {
        setCurrentDocument({
          ...currentDocument,
          comments: currentDocument.comments.filter((comment) => comment.id !== commentId),
        });
      }
      
      toast({
        title: 'Comment deleted',
        description: 'The comment has been deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete comment',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addVersion = async (slug: string, file: File, comment: string) => {
    setIsLoading(true);
    try {
      const newVersion = await documentService.addVersion(slug, { file, comment });
      
      // Update current document with new version
      if (currentDocument && currentDocument.slug === slug) {
        setCurrentDocument({
          ...currentDocument,
          versions: [newVersion, ...currentDocument.versions],
        });
      }
      
      toast({
        title: 'New version added',
        description: 'A new version of the document has been added successfully',
      });
      
      return newVersion;
    } catch (error) {
      console.error('Failed to add version:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add new version',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const shareDocument = async (slug: string, userId: number, permission: 'view' | 'edit' | 'comment') => {
    setIsLoading(true);
    try {
      const newShare = await documentService.shareDocument(slug, {
        shared_with: userId,
        permission,
      });
      
      // Update current document with new share
      if (currentDocument && currentDocument.slug === slug) {
        setCurrentDocument({
          ...currentDocument,
          shares: [...currentDocument.shares, newShare],
        });
      }
      
      toast({
        title: 'Document shared',
        description: 'The document has been shared successfully',
      });
      
      return newShare;
    } catch (error) {
      console.error('Failed to share document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to share document',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeShare = async (shareId: number) => {
    setIsLoading(true);
    try {
      await documentService.removeShare(shareId);
      
      // Update current document by removing the share
      if (currentDocument) {
        setCurrentDocument({
          ...currentDocument,
          shares: currentDocument.shares.filter((share) => share.id !== shareId),
        });
      }
      
      toast({
        title: 'Share removed',
        description: 'The document share has been removed successfully',
      });
    } catch (error) {
      console.error('Failed to remove share:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove share',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        userDocuments,
        sharedDocuments,
        currentDocument,
        isLoading,
        fetchDocuments,
        fetchUserDocuments,
        fetchSharedDocuments,
        fetchDocumentBySlug,
        createDocument,
        updateDocument,
        deleteDocument,
        addComment,
        deleteComment,
        addVersion,
        shareDocument,
        removeShare,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export default DocumentContext;