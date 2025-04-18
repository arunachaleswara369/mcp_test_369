import api from './api';

export interface Document {
  id: number;
  title: string;
  description: string;
  file: string;
  file_type: string;
  file_size: number;
  owner: {
    id: number;
    email: string;
    full_name: string;
    profile_picture?: string;
  };
  created_at: string;
  updated_at: string;
  is_public: boolean;
  slug: string;
}

export interface DocumentDetail extends Document {
  comments: Comment[];
  shares: Share[];
  versions: Version[];
}

export interface Comment {
  id: number;
  author: {
    id: number;
    email: string;
    full_name: string;
    profile_picture?: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Share {
  id: number;
  shared_with: {
    id: number;
    email: string;
    full_name: string;
    profile_picture?: string;
  };
  permission: 'view' | 'edit' | 'comment';
  created_at: string;
}

export interface Version {
  id: number;
  version_number: number;
  file: string;
  file_size: number;
  created_by: {
    id: number;
    email: string;
    full_name: string;
    profile_picture?: string;
  };
  created_at: string;
  comment: string;
}

export interface DocumentCreateData {
  title: string;
  description: string;
  file: File;
  is_public: boolean;
}

export interface CommentCreateData {
  document: number;
  content: string;
}

export interface ShareCreateData {
  document: number;
  shared_with: number;
  permission: 'view' | 'edit' | 'comment';
}

export interface VersionCreateData {
  document: number;
  file: File;
  comment: string;
}

// Document service
const documentService = {
  // Get all documents
  getAllDocuments: async (): Promise<Document[]> => {
    return api.get<Document[]>('/documents/');
  },
  
  // Get user's documents
  getUserDocuments: async (): Promise<Document[]> => {
    return api.get<Document[]>('/documents/my_documents/');
  },
  
  // Get documents shared with user
  getSharedDocuments: async (): Promise<Document[]> => {
    return api.get<Document[]>('/documents/shared_with_me/');
  },
  
  // Get document by slug
  getDocumentBySlug: async (slug: string): Promise<DocumentDetail> => {
    return api.get<DocumentDetail>(`/documents/${slug}/`);
  },
  
  // Get document by ID
  getDocumentById: async (id: number): Promise<DocumentDetail> => {
    return api.get<DocumentDetail>(`/documents/get_by_id/?id=${id}`);
  },
  
  // Create new document
  createDocument: async (data: DocumentCreateData): Promise<Document> => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('file', data.file);
    formData.append('is_public', data.is_public.toString());
    
    return api.post<Document>('/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Update document
  updateDocument: async (slug: string, data: Partial<Document>): Promise<Document> => {
    // Handle file upload if included
    if (data.file instanceof File) {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'file') {
            formData.append(key, value as File);
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else if (value !== null) {
            formData.append(key, value as string);
          }
        }
      });
      
      return api.put<Document>(`/documents/${slug}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    return api.put<Document>(`/documents/${slug}/`, data);
  },
  
  // Delete document
  deleteDocument: async (slug: string): Promise<void> => {
    await api.delete(`/documents/${slug}/`);
  },
  
  // Get document comments
  getDocumentComments: async (slug: string): Promise<Comment[]> => {
    return api.get<Comment[]>(`/documents/${slug}/comments/`);
  },
  
  // Add comment to document
  addComment: async (data: CommentCreateData): Promise<Comment> => {
    return api.post<Comment>('/comments/', data);
  },
  
  // Update comment
  updateComment: async (id: number, content: string): Promise<Comment> => {
    return api.put<Comment>(`/comments/${id}/`, { content });
  },
  
  // Delete comment
  deleteComment: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}/`);
  },
  
  // Get document versions
  getDocumentVersions: async (slug: string): Promise<Version[]> => {
    return api.get<Version[]>(`/documents/${slug}/versions/`);
  },
  
  // Add version to document
  addVersion: async (slug: string, data: { file: File, comment: string }): Promise<Version> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('comment', data.comment);
    
    return api.post<Version>(`/documents/${slug}/add_version/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get document shares
  getDocumentShares: async (slug: string): Promise<Share[]> => {
    return api.get<Share[]>(`/documents/${slug}/shares/`);
  },
  
  // Share document with user
  shareDocument: async (slug: string, data: { shared_with: number, permission: 'view' | 'edit' | 'comment' }): Promise<Share> => {
    return api.post<Share>(`/documents/${slug}/share/`, data);
  },
  
  // Update share permissions
  updateShare: async (id: number, permission: 'view' | 'edit' | 'comment'): Promise<Share> => {
    return api.put<Share>(`/shares/${id}/`, { permission });
  },
  
  // Remove share
  removeShare: async (id: number): Promise<void> => {
    await api.delete(`/shares/${id}/`);
  },
};

export default documentService;