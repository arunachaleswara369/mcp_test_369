import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useDocuments, Comment } from "@/contexts/DocumentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { TrashIcon } from "lucide-react";

interface DocumentCommentsProps {
  documentId: number;
  comments: Comment[];
  canComment: boolean;
}

export default function DocumentComments({ documentId, comments, canComment }: DocumentCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment, deleteComment } = useDocuments();
  const { user } = useAuth();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await addComment(documentId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error("Error deleting comment:", error);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canComment && (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        )}

        {comments.length > 0 ? (
          <div className="space-y-4 mt-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar className="h-10 w-10">
                  {comment.author.profile_picture ? (
                    <AvatarImage src={comment.author.profile_picture} alt={comment.author.full_name} />
                  ) : (
                    <AvatarFallback>{getInitials(comment.author.full_name)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{comment.author.full_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {(user?.id === comment.author.id) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet.</p>
            {canComment && (
              <p className="text-sm">Be the first to comment on this document.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}