import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { useDocuments, Version } from "@/contexts/DocumentContext";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface DocumentVersionsProps {
  documentSlug: string;
  versions: Version[];
  canAddVersion: boolean;
}

export default function DocumentVersions({ documentSlug, versions, canAddVersion }: DocumentVersionsProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { addVersion } = useDocuments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFile) {
      return;
    }
    
    try {
      setIsUploading(true);
      await addVersion(documentSlug, uploadFile, comment);
      
      // Reset form
      setUploadFile(null);
      setComment("");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding version:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Version History</CardTitle>
        {canAddVersion && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UploadIcon className="h-4 w-4 mr-2" />
                Add Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Version</DialogTitle>
                <DialogDescription>
                  Upload a new version of this document. The current version will be preserved in the version history.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddVersion}>
                <div className="grid gap-4 py-4">
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
                  <div className="grid gap-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      placeholder="Describe what changed in this version"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading || !uploadFile}>
                    {isUploading ? "Uploading..." : "Upload Version"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {versions.length > 0 ? (
          <div className="space-y-4">
            {versions.map((version) => (
              <div key={version.id} className="flex flex-col space-y-2 p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 text-primary font-medium rounded-full px-2 py-1 text-xs">
                      Version {version.version_number}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={version.file} download target="_blank" rel="noopener noreferrer">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar className="h-6 w-6">
                    {version.created_by.profile_picture ? (
                      <AvatarImage src={version.created_by.profile_picture} alt={version.created_by.full_name} />
                    ) : (
                      <AvatarFallback>{getInitials(version.created_by.full_name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm">{version.created_by.full_name}</span>
                </div>
                
                {version.comment && (
                  <div className="mt-2 text-sm">
                    <p>{version.comment}</p>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-2">
                  File size: {formatFileSize(version.file_size)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No version history available.</p>
            {canAddVersion && (
              <p className="text-sm">Upload a new version to start tracking changes.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}