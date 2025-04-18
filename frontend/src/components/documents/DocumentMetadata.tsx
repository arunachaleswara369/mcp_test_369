import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { FileIcon, CalendarIcon, UserIcon, TagIcon, ClockIcon, FileTextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Document } from "@/contexts/DocumentContext";

interface DocumentMetadataProps {
  document: Document;
}

export default function DocumentMetadata({ document }: DocumentMetadataProps) {
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

  const getFileTypeIcon = (fileType: string) => {
    // You could expand this with more specific icons based on file type
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Document Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          {/* Owner information */}
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Owner</p>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  {document.owner.profile_picture ? (
                    <AvatarImage src={document.owner.profile_picture} alt={document.owner.full_name} />
                  ) : (
                    <AvatarFallback>{getInitials(document.owner.full_name)}</AvatarFallback>
                  )}
                </Avatar>
                <span className="font-medium">{document.owner.full_name}</span>
              </div>
            </div>
          </div>

          {/* File type */}
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              <FileIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">File Type</p>
              <div className="flex items-center space-x-2">
                {getFileTypeIcon(document.file_type)}
                <span className="font-medium">{document.file_type.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* File size */}
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="font-medium">{formatFileSize(document.file_size)}</p>
            </div>
          </div>

          {/* Created date */}
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {format(new Date(document.created_at), "MMMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Last modified */}
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Last Modified</p>
              <p className="font-medium">
                {format(new Date(document.updated_at), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="bg-muted p-2 rounded-full">
                <TagIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {document.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Version information */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Version Information</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Current Version</p>
              <p className="font-medium">v{document.current_version}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Versions</p>
              <p className="font-medium">{document.version_count}</p>
            </div>
          </div>
        </div>

        {/* Sharing information */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Sharing</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Shared With</p>
              <p className="font-medium">{document.share_count} users</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Access Level</p>
              <Badge variant="outline" className={
                document.is_public 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                  : ""
              }>
                {document.is_public ? "Public" : "Private"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}