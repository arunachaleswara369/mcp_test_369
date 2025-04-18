"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useDocuments } from "@/contexts/DocumentContext";
import { Document } from "@/lib/documents";
import { FileIcon, FolderIcon, ShareIcon, PlusIcon, DownloadIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    userDocuments, 
    sharedDocuments, 
    fetchUserDocuments, 
    fetchSharedDocuments, 
    isLoading: documentsLoading,
    createDocument,
    deleteDocument
  } = useDocuments();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("my-documents");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    isPublic: false,
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch documents when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserDocuments();
      fetchSharedDocuments();
    }
  }, [isAuthenticated, fetchUserDocuments, fetchSharedDocuments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      await createDocument(
        newDocument.title,
        newDocument.description,
        uploadFile,
        newDocument.isPublic
      );
      
      // Reset form
      setNewDocument({
        title: "",
        description: "",
        isPublic: false,
      });
      setUploadFile(null);
      setOpenDialog(false);
      
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create document",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (slug: string) => {
    try {
      await deleteDocument(slug);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document",
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      pdf: <FileIcon className="h-6 w-6 text-red-500" />,
      doc: <FileIcon className="h-6 w-6 text-blue-500" />,
      docx: <FileIcon className="h-6 w-6 text-blue-500" />,
      xls: <FileIcon className="h-6 w-6 text-green-500" />,
      xlsx: <FileIcon className="h-6 w-6 text-green-500" />,
      ppt: <FileIcon className="h-6 w-6 text-orange-500" />,
      pptx: <FileIcon className="h-6 w-6 text-orange-500" />,
      jpg: <FileIcon className="h-6 w-6 text-purple-500" />,
      jpeg: <FileIcon className="h-6 w-6 text-purple-500" />,
      png: <FileIcon className="h-6 w-6 text-purple-500" />,
      txt: <FileIcon className="h-6 w-6 text-gray-500" />,
    };
    
    return iconMap[fileType.toLowerCase()] || <FileIcon className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const DocumentCard = ({ document }: { document: Document }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium truncate">{document.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/documents/${document.slug}`}>
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href={document.file} download target="_blank" rel="noopener noreferrer" className="flex w-full">
                  Download
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/documents/${document.slug}/share`}>
                  Share
                </Link>
              </DropdownMenuItem>
              {document.owner.id === user?.id && (
                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteDocument(document.slug)}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="truncate">{document.description || "No description"}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {getFileIcon(document.file_type)}
          <div className="flex flex-col">
            <span className="text-xs font-medium">{document.file_type.toUpperCase()}</span>
            <span className="text-xs text-muted-foreground">{formatFileSize(document.file_size)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-1">
          {document.is_public && (
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full text-xs">
              Public
            </span>
          )}
          {document.owner.id !== user?.id && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-full text-xs">
              Shared
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a document to your personal collection.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDocument}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                    placeholder="Document title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                    placeholder="Add a description (optional)"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                  {uploadFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={newDocument.isPublic}
                    onCheckedChange={(checked) => 
                      setNewDocument({ ...newDocument, isPublic: checked as boolean })
                    }
                  />
                  <Label htmlFor="isPublic">Make document public</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="my-documents" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-documents" className="flex items-center">
            <FolderIcon className="h-4 w-4 mr-2" />
            My Documents
          </TabsTrigger>
          <TabsTrigger value="shared-with-me" className="flex items-center">
            <ShareIcon className="h-4 w-4 mr-2" />
            Shared with Me
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-documents">
          {documentsLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : userDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
              <FolderIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No documents yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload your first document to get started.
              </p>
              <Button className="mt-4" onClick={() => setOpenDialog(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shared-with-me">
          {documentsLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sharedDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
              <ShareIcon className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No shared documents</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Documents shared with you will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}