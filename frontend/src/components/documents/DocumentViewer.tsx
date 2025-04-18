import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Document, useDocuments } from "@/contexts/DocumentContext";
import { useAuth } from "@/contexts/AuthContext";
import DocumentComments from "./DocumentComments";
import DocumentVersions from "./DocumentVersions";
import DocumentSharing from "./DocumentSharing";
import DocumentMetadata from "./DocumentMetadata";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadIcon, EditIcon, StarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentViewerProps {
  slug: string;
}

export default function DocumentViewer({ slug }: DocumentViewerProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("preview");
  const [isStarred, setIsStarred] = useState(false);
  const { getDocument, toggleStar } = useDocuments();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const doc = await getDocument(slug);
        setDocument(doc);
        setIsStarred(doc.is_starred);
      } catch (error) {
        console.error("Error fetching document:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load document. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [slug, getDocument, toast]);

  const handleToggleStar = async () => {
    if (!document) return;
    
    try {
      const newStarredState = !isStarred;
      await toggleStar(document.id, newStarredState);
      setIsStarred(newStarredState);
      
      toast({
        title: newStarredState ? "Document starred" : "Document unstarred",
        description: newStarredState 
          ? "Document has been added to your favorites" 
          : "Document has been removed from your favorites",
      });
    } catch (error) {
      console.error("Error toggling star:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update star status.",
      });
    }
  };

  const canEdit = document && (document.owner.id === user?.id || document.permissions?.includes("edit"));
  const canComment = document && (document.owner.id === user?.id || document.permissions?.includes("comment") || document.permissions?.includes("edit"));

  // Determine the file type and render the appropriate preview
  const renderPreview = () => {
    if (!document) return null;

    const fileType = document.file_type.toLowerCase();
    
    // Image preview
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileType)) {
      return (
        <div className="flex justify-center p-4 bg-muted rounded-md">
          <img 
            src={document.file_url} 
            alt={document.title} 
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    }
    
    // PDF preview
    if (fileType === "pdf") {
      return (
        <div className="w-full h-[70vh] bg-muted rounded-md">
          <iframe 
            src={`${document.file_url}#toolbar=0`} 
            className="w-full h-full rounded-md"
            title={document.title}
          />
        </div>
      );
    }
    
    // Video preview
    if (["mp4", "webm", "ogg"].includes(fileType)) {
      return (
        <div className="w-full bg-muted rounded-md">
          <video 
            src={document.file_url} 
            controls 
            className="w-full max-h-[70vh]"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    // Audio preview
    if (["mp3", "wav", "ogg"].includes(fileType)) {
      return (
        <div className="w-full p-8 bg-muted rounded-md flex justify-center">
          <audio 
            src={document.file_url} 
            controls 
            className="w-full max-w-md"
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }
    
    // Text preview (for code, markdown, txt, etc.)
    if (["txt", "md", "js", "ts", "html", "css", "json", "py", "java", "c", "cpp"].includes(fileType)) {
      return (
        <div className="w-full bg-muted rounded-md p-4 overflow-auto max-h-[70vh]">
          <pre className="text-sm font-mono">
            {document.content || "Preview not available. Please download the file to view its contents."}
          </pre>
        </div>
      );
    }
    
    // Default preview for unsupported file types
    return (
      <div className="w-full bg-muted rounded-md p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="p-3 bg-primary/10 rounded-full">
            <FileIcon className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{document.title}</h3>
            <p className="text-muted-foreground">
              Preview not available for this file type ({fileType.toUpperCase()})
            </p>
          </div>
          <Button asChild className="mt-4">
            <a href={document.file_url} download target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download File
            </a>
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-[60vh] w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
        <p className="text-muted-foreground mb-6">The document you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild>
          <a href="/dashboard">Return to Dashboard</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{document.title}</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleStar}
            className={isStarred ? "text-yellow-500" : ""}
          >
            <StarIcon className="h-4 w-4" />
          </Button>
          <Button asChild>
            <a href={document.file_url} download target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
          {canEdit && (
            <Button asChild variant="default">
              <a href={`/documents/${slug}/edit`}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </a>
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {renderPreview()}
            </CardContent>
          </Card>
          <DocumentMetadata document={document} />
        </TabsContent>
        
        <TabsContent value="comments">
          <DocumentComments 
            documentId={document.id} 
            comments={document.comments || []} 
            canComment={!!canComment}
          />
        </TabsContent>
        
        <TabsContent value="versions">
          <DocumentVersions 
            documentSlug={slug} 
            versions={document.versions || []} 
            canAddVersion={!!canEdit}
          />
        </TabsContent>
        
        <TabsContent value="sharing">
          <DocumentSharing 
            documentSlug={slug} 
            shares={document.shares || []} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}