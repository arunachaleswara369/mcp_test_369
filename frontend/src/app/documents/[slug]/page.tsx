"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useDocuments } from "@/contexts/DocumentContext";
import { formatDistanceToNow, format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { FileIcon, DownloadIcon, ShareIcon, PencilIcon, TrashIcon, EyeIcon } from "lucide-react";
import DocumentComments from "@/components/documents/DocumentComments";
import DocumentVersions from "@/components/documents/DocumentVersions";
import DocumentSharing from "@/components/documents/DocumentSharing";
import DocumentMetadata from "@/components/documents/DocumentMetadata";

export default function DocumentViewerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    currentDocument, 
    fetchDocumentBySlug, 
    isLoading: documentLoading,
    deleteDocument
  } = useDocuments();
  const [activeTab, setActiveTab] = useState("preview");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch document when component mounts
  useEffect(() => {
    if (isAuthenticated && slug) {
      fetchDocumentBySlug(slug).catch((error) => {
        console.error("Error fetching document:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load document. It may have been deleted or you don't have permission to view it.",
        });
        router.push("/dashboard");
      });
    }
  }, [isAuthenticated, slug, fetchDocumentBySlug, toast, router]);

  const handleDeleteDocument = async () => {
    if (!currentDocument) return;
    
    if (confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      try {
        await deleteDocument(currentDocument.slug);
        toast({
          title: "Document deleted",
          description: "The document has been deleted successfully.",
        });
        router.push("/dashboard");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete document.",
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      pdf: <FileIcon className="h-10 w-10 text-red-500" />,
      doc: <FileIcon className="h-10 w-10 text-blue-500" />,
      docx: <FileIcon className="h-10 w-10 text-blue-500" />,
      xls: <FileIcon className="h-10 w-10 text-green-500" />,
      xlsx: <FileIcon className="h-10 w-10 text-green-500" />,
      ppt: <FileIcon className="h-10 w-10 text-orange-500" />,
      pptx: <FileIcon className="h-10 w-10 text-orange-500" />,
      jpg: <FileIcon className="h-10 w-10 text-purple-500" />,
      jpeg: <FileIcon className="h-10 w-10 text-purple-500" />,
      png: <FileIcon className="h-10 w-10 text-purple-500" />,
      txt: <FileIcon className="h-10 w-10 text-gray-500" />,
    };
    
    return iconMap[fileType.toLowerCase()] || <FileIcon className="h-10 w-10" />;
  };

  if (authLoading || documentLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <FileIcon className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">Document not found</h3>
          <p className="mt-2 text-muted-foreground">
            The document you are looking for does not exist or you don't have permission to view it.
          </p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = currentDocument.owner.id === user?.id;
  const canEdit = isOwner || currentDocument.shares.some(
    share => share.shared_with.id === user?.id && share.permission === 'edit'
  );
  const canComment = isOwner || currentDocument.shares.some(
    share => share.shared_with.id === user?.id && ['edit', 'comment'].includes(share.permission)
  );

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground" 
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium truncate">{currentDocument.title}</span>
          </div>
          <h1 className="text-3xl font-bold mt-2">{currentDocument.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <a href={currentDocument.file} download target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
          {canEdit && (
            <Button variant="outline" asChild>
              <a href={`/documents/${currentDocument.slug}/edit`}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </a>
            </Button>
          )}
          {isOwner && (
            <>
              <Button variant="outline" asChild>
                <a href={`/documents/${currentDocument.slug}/share`}>
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </a>
              </Button>
              <Button variant="destructive" onClick={handleDeleteDocument}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="preview" className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Comments ({currentDocument.comments.length})
              </TabsTrigger>
              <TabsTrigger value="versions" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Versions ({currentDocument.versions.length})
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="sharing" className="flex items-center">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Sharing ({currentDocument.shares.length})
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
                    {getFileIcon(currentDocument.file_type)}
                    <h3 className="mt-4 text-xl font-medium">{currentDocument.title}</h3>
                    <p className="mt-2 text-muted-foreground">{currentDocument.file_type.toUpperCase()} File</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(currentDocument.file_size)}</p>
                    <Button className="mt-6" asChild>
                      <a href={currentDocument.file} target="_blank" rel="noopener noreferrer">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Document
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {currentDocument.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{currentDocument.description}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="comments">
              <DocumentComments 
                documentId={currentDocument.id} 
                comments={currentDocument.comments} 
                canComment={canComment}
              />
            </TabsContent>
            
            <TabsContent value="versions">
              <DocumentVersions 
                documentSlug={currentDocument.slug} 
                versions={currentDocument.versions} 
                canAddVersion={canEdit}
              />
            </TabsContent>
            
            {isOwner && (
              <TabsContent value="sharing">
                <DocumentSharing 
                  documentSlug={currentDocument.slug} 
                  shares={currentDocument.shares}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div>
          <DocumentMetadata document={currentDocument} />
        </div>
      </div>
    </div>
  );
}