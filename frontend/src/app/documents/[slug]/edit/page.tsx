"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

export default function EditDocumentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, status } = useAuth();
  const router = useRouter();
  const { getDocument, updateDocument } = useDocuments();
  const { toast } = useToast();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/documents/${slug}/edit`);
      return;
    }

    // Fetch document data
    if (status === "authenticated") {
      const fetchDocument = async () => {
        try {
          setLoading(true);
          const doc = await getDocument(slug);
          setDocument(doc);
          
          // Initialize form state
          setTitle(doc.title);
          setDescription(doc.description || "");
          setIsPublic(doc.is_public);
          setTags(doc.tags || []);
        } catch (error) {
          console.error("Error fetching document:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load document. Please try again.",
          });
          router.push(`/documents/${slug}`);
        } finally {
          setLoading(false);
        }
      };

      fetchDocument();
    }
  }, [slug, getDocument, status, router, toast]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document) return;
    
    try {
      setSaving(true);
      
      await updateDocument(document.id, {
        title,
        description,
        is_public: isPublic,
        tags
      });
      
      toast({
        title: "Document updated",
        description: "Document has been updated successfully.",
      });
      
      // Navigate back to document view
      router.push(`/documents/${slug}`);
    } catch (error) {
      console.error("Error updating document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update document. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Check if user has edit permission
  const canEdit = document && (document.owner.id === user?.id || document.permissions?.includes("edit"));

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document || !canEdit) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              {!document 
                ? "The document you're looking for doesn't exist." 
                : "You don't have permission to edit this document."}
            </p>
            <Button asChild>
              <a href={`/documents/${slug}`}>View Document</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Document</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/documents/${slug}`)}>
            Cancel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full hover:bg-muted p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Press Enter to add a tag
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public">Make document public</Label>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/documents/${slug}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}