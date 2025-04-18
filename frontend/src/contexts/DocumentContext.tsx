import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import axios from "axios";

// Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  profile_picture?: string;
}

export interface Comment {
  id: number;
  document: number;
  author: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Version {
  id: number;
  document: number;
  version_number: number;
  file: string;
  file_size: number;
  comment?: string;
  created_by: User;
  created_at: string;
}

export interface Share {
  id: number;
  document: number;
  shared_with: User;
  permission: "view" | "edit" | "comment";
  created_at: string;
}

export interface Document {
  id: number;
  title: string;
  slug: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  content?: string;
  is_public: boolean;
  is_starred: boolean;
  owner: User;
  created_at: string;
  updated_at: string;
  current_version: number;
  version_count: number;
  share_count: number;
  permissions?: string[];
  tags?: string[];
  comments?: Comment[];
  versions?: Version[];
  shares?: Share[];
}

interface DocumentContextType {
  documents: Document[];
  starredDocuments: Document[];
  sharedDocuments: Document[];
  loading: boolean;
  error: string | null;
  getDocuments: () => Promise<Document[]>;
  getStarredDocuments: () => Promise<Document[]>;
  getSharedDocuments: () => Promise<Document[]>;
  getDocument: (slug: string) => Promise<Document>;
  createDocument: (file: File, title: string, description?: string, isPublic?: boolean, tags?: string[]) => Promise<Document>;
  updateDocument: (id: number, data: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: number) => Promise<void>;
  toggleStar: (id: number, isStarred: boolean) => Promise<void>;
  addComment: (documentId: number, content: string) => Promise<Comment>;
  deleteComment: (commentId: number) => Promise<void>;
  addVersion: (documentSlug: string, file: File, comment?: string) => Promise<Version>;
  shareDocument: (documentSlug: string, userId: number, permission: "view" | "edit" | "comment") => Promise<Share>;
  removeShare: (shareId: number) => Promise<void>;
  searchDocuments: (query: string) => Promise<Document[]>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Mock data for development
const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Project Proposal",
    slug: "project-proposal",
    description: "Final project proposal for client review",
    file_url: "/documents/project-proposal.pdf",
    file_type: "pdf",
    file_size: 2500000,
    is_public: false,
    is_starred: true,
    owner: {
      id: 1,
      email: "user@example.com",
      full_name: "John Doe"
    },
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2023-01-20T14:15:00Z",
    current_version: 3,
    version_count: 3,
    share_count: 2,
    permissions: ["view", "comment", "edit"],
    tags: ["proposal", "client", "project"],
    comments: [
      {
        id: 1,
        document: 1,
        author: {
          id: 2,
          email: "jane@example.com",
          full_name: "Jane Smith"
        },
        content: "Looks great! I've added some feedback on page 3.",
        created_at: "2023-01-18T09:45:00Z",
        updated_at: "2023-01-18T09:45:00Z"
      },
      {
        id: 2,
        document: 1,
        author: {
          id: 1,
          email: "user@example.com",
          full_name: "John Doe"
        },
        content: "Thanks for the feedback. I've incorporated your suggestions.",
        created_at: "2023-01-19T11:20:00Z",
        updated_at: "2023-01-19T11:20:00Z"
      }
    ],
    versions: [
      {
        id: 1,
        document: 1,
        version_number: 1,
        file: "/documents/project-proposal-v1.pdf",
        file_size: 2100000,
        comment: "Initial draft",
        created_by: {
          id: 1,
          email: "user@example.com",
          full_name: "John Doe"
        },
        created_at: "2023-01-15T10:30:00Z"
      },
      {
        id: 2,
        document: 1,
        version_number: 2,
        file: "/documents/project-proposal-v2.pdf",
        file_size: 2300000,
        comment: "Added executive summary",
        created_by: {
          id: 1,
          email: "user@example.com",
          full_name: "John Doe"
        },
        created_at: "2023-01-17T16:45:00Z"
      },
      {
        id: 3,
        document: 1,
        version_number: 3,
        file: "/documents/project-proposal-v3.pdf",
        file_size: 2500000,
        comment: "Incorporated feedback from team",
        created_by: {
          id: 1,
          email: "user@example.com",
          full_name: "John Doe"
        },
        created_at: "2023-01-20T14:15:00Z"
      }
    ],
    shares: [
      {
        id: 1,
        document: 1,
        shared_with: {
          id: 2,
          email: "jane@example.com",
          full_name: "Jane Smith"
        },
        permission: "edit",
        created_at: "2023-01-16T08:20:00Z"
      },
      {
        id: 2,
        document: 1,
        shared_with: {
          id: 3,
          email: "bob@example.com",
          full_name: "Bob Johnson"
        },
        permission: "view",
        created_at: "2023-01-16T08:25:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Meeting Notes",
    slug: "meeting-notes",
    description: "Notes from the weekly team meeting",
    file_url: "/documents/meeting-notes.docx",
    file_type: "docx",
    file_size: 500000,
    is_public: false,
    is_starred: false,
    owner: {
      id: 1,
      email: "user@example.com",
      full_name: "John Doe"
    },
    created_at: "2023-01-22T15:00:00Z",
    updated_at: "2023-01-22T15:00:00Z",
    current_version: 1,
    version_count: 1,
    share_count: 0,
    tags: ["meeting", "notes", "team"]
  }
];

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [starredDocuments, setStarredDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Helper function to handle API errors
  const handleApiError = (error: any) => {
    console.error("API Error:", error);
    const errorMessage = error.response?.data?.detail || error.message || "An error occurred";
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });
    throw error;
  };

  // Configure axios with auth token
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Get all documents
  const getDocuments = async (): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.get("/documents/");
      // const data = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = mockDocuments.filter(doc => doc.owner.id === 1);
      
      setDocuments(data);
      return data;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get starred documents
  const getStarredDocuments = async (): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.get("/documents/starred/");
      // const data = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = mockDocuments.filter(doc => doc.is_starred);
      
      setStarredDocuments(data);
      return data;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get shared documents
  const getSharedDocuments = async (): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.get("/documents/shared/");
      // const data = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = mockDocuments.filter(doc => doc.owner.id !== 1 && doc.shares?.some(share => share.shared_with.id === 1));
      
      setSharedDocuments(data);
      return data;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get a single document by slug
  const getDocument = async (slug: string): Promise<Document> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.get(`/documents/${slug}/`);
      // const data = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const document = mockDocuments.find(doc => doc.slug === slug);
      
      if (!document) {
        throw new Error("Document not found");
      }
      
      return document;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new document
  const createDocument = async (
    file: File,
    title: string,
    description?: string,
    isPublic?: boolean,
    tags?: string[]
  ): Promise<Document> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call with FormData
      // const formData = new FormData();
      // formData.append("file", file);
      // formData.append("title", title);
      // if (description) formData.append("description", description);
      // if (isPublic !== undefined) formData.append("is_public", String(isPublic));
      // if (tags && tags.length) formData.append("tags", JSON.stringify(tags));
      
      // const response = await api.post("/documents/", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // const data = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDocument: Document = {
        id: Math.max(...mockDocuments.map(doc => doc.id)) + 1,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        file_url: URL.createObjectURL(file),
        file_type: file.name.split(".").pop() || "",
        file_size: file.size,
        is_public: isPublic || false,
        is_starred: false,
        owner: {
          id: 1,
          email: "user@example.com",
          full_name: "John Doe"
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        current_version: 1,
        version_count: 1,
        share_count: 0,
        tags,
        versions: [
          {
            id: Date.now(),
            document: Math.max(...mockDocuments.map(doc => doc.id)) + 1,
            version_number: 1,
            file: URL.createObjectURL(file),
            file_size: file.size,
            comment: "Initial version",
            created_by: {
              id: 1,
              email: "user@example.com",
              full_name: "John Doe"
            },
            created_at: new Date().toISOString()
          }
        ]
      };
      
      // Update local state
      setDocuments(prev => [...prev, newDocument]);
      
      return newDocument;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update a document
  const updateDocument = async (id: number, data: Partial<Document>): Promise<Document> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.patch(`/documents/${id}/`, data);
      // const updatedDocument = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const documentIndex = mockDocuments.findIndex(doc => doc.id === id);
      if (documentIndex === -1) {
        throw new Error("Document not found");
      }
      
      const updatedDocument = {
        ...mockDocuments[documentIndex],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // Update local state
      const updatedDocuments = [...mockDocuments];
      updatedDocuments[documentIndex] = updatedDocument;
      setDocuments(updatedDocuments.filter(doc => doc.owner.id === 1));
      
      return updatedDocument;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // await api.delete(`/documents/${id}/`);
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setStarredDocuments(prev => prev.filter(doc => doc.id !== id));
      setSharedDocuments(prev => prev.filter(doc => doc.id !== id));
      
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle star status
  const toggleStar = async (id: number, isStarred: boolean): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // await api.post(`/documents/${id}/star/`, { is_starred: isStarred });
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updateDocumentStar = (docs: Document[]) => 
        docs.map(doc => doc.id === id ? { ...doc, is_starred: isStarred } : doc);
      
      setDocuments(updateDocumentStar);
      
      if (isStarred) {
        const docToStar = documents.find(doc => doc.id === id);
        if (docToStar) {
          setStarredDocuments(prev => [...prev, { ...docToStar, is_starred: true }]);
        }
      } else {
        setStarredDocuments(prev => prev.filter(doc => doc.id !== id));
      }
      
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Add a comment to a document
  const addComment = async (documentId: number, content: string): Promise<Comment> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.post(`/documents/${documentId}/comments/`, { content });
      // const newComment = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newComment: Comment = {
        id: Date.now(),
        document: documentId,
        author: {
          id: 1,
          email: "user@example.com",
          full_name: "John Doe"
        },
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Update local state
      const updateDocumentComments = (docs: Document[]) => 
        docs.map(doc => {
          if (doc.id === documentId) {
            const updatedComments = [...(doc.comments || []), newComment];
            return { ...doc, comments: updatedComments };
          }
          return doc;
        });
      
      setDocuments(updateDocumentComments);
      setStarredDocuments(updateDocumentComments);
      setSharedDocuments(updateDocumentComments);
      
      return newComment;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // await api.delete(`/comments/${commentId}/`);
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updateDocumentComments = (docs: Document[]) => 
        docs.map(doc => {
          if (doc.comments) {
            return {
              ...doc,
              comments: doc.comments.filter(comment => comment.id !== commentId)
            };
          }
          return doc;
        });
      
      setDocuments(updateDocumentComments);
      setStarredDocuments(updateDocumentComments);
      setSharedDocuments(updateDocumentComments);
      
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new version to a document
  const addVersion = async (documentSlug: string, file: File, comment?: string): Promise<Version> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call with FormData
      // const formData = new FormData();
      // formData.append("file", file);
      // if (comment) formData.append("comment", comment);
      
      // const response = await api.post(`/documents/${documentSlug}/versions/`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // const newVersion = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const document = mockDocuments.find(doc => doc.slug === documentSlug);
      if (!document) {
        throw new Error("Document not found");
      }
      
      const newVersionNumber = (document.version_count || 0) + 1;
      
      const newVersion: Version = {
        id: Date.now(),
        document: document.id,
        version_number: newVersionNumber,
        file: URL.createObjectURL(file),
        file_size: file.size,
        comment,
        created_by: {
          id: 1,
          email: "user@example.com",
          full_name: "John Doe"
        },
        created_at: new Date().toISOString()
      };
      
      // Update local state
      const updateDocumentVersions = (docs: Document[]) => 
        docs.map(doc => {
          if (doc.id === document.id) {
            const updatedVersions = [...(doc.versions || []), newVersion];
            return {
              ...doc,
              versions: updatedVersions,
              current_version: newVersionNumber,
              version_count: newVersionNumber,
              file_url: URL.createObjectURL(file),
              file_size: file.size,
              updated_at: new Date().toISOString()
            };
          }
          return doc;
        });
      
      setDocuments(updateDocumentVersions);
      setStarredDocuments(updateDocumentVersions);
      setSharedDocuments(updateDocumentVersions);
      
      return newVersion;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Share a document with another user
  const shareDocument = async (
    documentSlug: string,
    userId: number,
    permission: "view" | "edit" | "comment"
  ): Promise<Share> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.post(`/documents/${documentSlug}/share/`, {
      //   user_id: userId,
      //   permission
      // });
      // const newShare = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const document = mockDocuments.find(doc => doc.slug === documentSlug);
      if (!document) {
        throw new Error("Document not found");
      }
      
      // Mock user data - in a real app, you would get this from the API
      const mockUsers = [
        { id: 1, email: "user@example.com", full_name: "John Doe" },
        { id: 2, email: "jane@example.com", full_name: "Jane Smith" },
        { id: 3, email: "bob@example.com", full_name: "Bob Johnson" }
      ];
      
      const sharedWithUser = mockUsers.find(user => user.id === userId);
      if (!sharedWithUser) {
        throw new Error("User not found");
      }
      
      const newShare: Share = {
        id: Date.now(),
        document: document.id,
        shared_with: sharedWithUser,
        permission,
        created_at: new Date().toISOString()
      };
      
      // Update local state
      const updateDocumentShares = (docs: Document[]) => 
        docs.map(doc => {
          if (doc.id === document.id) {
            const updatedShares = [...(doc.shares || []), newShare];
            return {
              ...doc,
              shares: updatedShares,
              share_count: updatedShares.length
            };
          }
          return doc;
        });
      
      setDocuments(updateDocumentShares);
      setStarredDocuments(updateDocumentShares);
      setSharedDocuments(updateDocumentShares);
      
      return newShare;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Remove a share
  const removeShare = async (shareId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // await api.delete(`/shares/${shareId}/`);
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updateDocumentShares = (docs: Document[]) => 
        docs.map(doc => {
          if (doc.shares) {
            const updatedShares = doc.shares.filter(share => share.id !== shareId);
            return {
              ...doc,
              shares: updatedShares,
              share_count: updatedShares.length
            };
          }
          return doc;
        });
      
      setDocuments(updateDocumentShares);
      setStarredDocuments(updateDocumentShares);
      setSharedDocuments(updateDocumentShares);
      
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Search documents
  const searchDocuments = async (query: string): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // const response = await api.get(`/documents/search/?q=${encodeURIComponent(query)}`);
      // const data = response.data;
      
      // Using mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const searchResults = mockDocuments.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(query.toLowerCase())) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
      
      return searchResults;
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        starredDocuments,
        sharedDocuments,
        loading,
        error,
        getDocuments,
        getStarredDocuments,
        getSharedDocuments,
        getDocument,
        createDocument,
        updateDocument,
        deleteDocument,
        toggleStar,
        addComment,
        deleteComment,
        addVersion,
        shareDocument,
        removeShare,
        searchDocuments
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};