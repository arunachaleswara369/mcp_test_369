import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useDocuments, Share } from "@/contexts/DocumentContext";
import { TrashIcon, UserPlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface DocumentSharingProps {
  documentSlug: string;
  shares: Share[];
}

export default function DocumentSharing({ documentSlug, shares }: DocumentSharingProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit" | "comment">("view");
  const [isSharing, setIsSharing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { shareDocument, removeShare } = useDocuments();
  const { toast } = useToast();

  const handleShareDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }
    
    try {
      setIsSharing(true);
      // This is a placeholder since we don't have a user search feature yet
      // In a real implementation, we would search for the user by email first
      const userId = 1; // This would be the actual user ID from the search
      await shareDocument(documentSlug, userId, permission);
      
      // Reset form
      setEmail("");
      setPermission("view");
      setOpenDialog(false);
      
      toast({
        title: "Document shared",
        description: `Document has been shared with ${email}`,
      });
    } catch (error) {
      console.error("Error sharing document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to share document. User may not exist or already has access.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveShare = async (shareId: number) => {
    if (confirm("Are you sure you want to remove this user's access?")) {
      try {
        await removeShare(shareId);
        toast({
          title: "Access removed",
          description: "User's access to the document has been removed.",
        });
      } catch (error) {
        console.error("Error removing share:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove user's access.",
        });
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case "view":
        return <Badge variant="outline">View only</Badge>;
      case "edit":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Can edit</Badge>;
      case "comment":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Can comment</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Sharing Settings</CardTitle>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Share with User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Document</DialogTitle>
              <DialogDescription>
                Share this document with another user by entering their email address.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleShareDocument}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="permission">Permission</Label>
                  <Select
                    value={permission}
                    onValueChange={(value) => setPermission(value as "view" | "edit" | "comment")}
                  >
                    <SelectTrigger id="permission">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="comment">Can comment</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {permission === "view" && "User can only view the document."}
                    {permission === "comment" && "User can view and comment on the document."}
                    {permission === "edit" && "User can view, comment, and edit the document."}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSharing || !email.trim()}>
                  {isSharing ? "Sharing..." : "Share"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {shares.length > 0 ? (
          <div className="space-y-4">
            {shares.map((share) => (
              <div key={share.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    {share.shared_with.profile_picture ? (
                      <AvatarImage src={share.shared_with.profile_picture} alt={share.shared_with.full_name} />
                    ) : (
                      <AvatarFallback>{getInitials(share.shared_with.full_name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{share.shared_with.full_name}</div>
                    <div className="text-xs text-muted-foreground">{share.shared_with.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPermissionLabel(share.permission)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveShare(share.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">This document is not shared with anyone.</p>
            <p className="text-sm">Share it with others to collaborate.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}