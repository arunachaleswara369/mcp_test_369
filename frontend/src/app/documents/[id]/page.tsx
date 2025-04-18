"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { 
  Download, 
  Share2, 
  Star, 
  MoreHorizontal, 
  ChevronLeft,
  MessageSquare,
  Send,
  User,
  Clock
} from "lucide-react"

// Mock document data
const mockDocument = {
  id: "doc-1",
  title: "Project Proposal",
  type: "pdf",
  content: `# Project Proposal: Document Management System

## Executive Summary

This document outlines the proposal for developing a modern document management system that will help organizations efficiently organize, store, and collaborate on documents.

## Project Objectives

1. Create a secure and scalable document storage solution
2. Implement robust search capabilities
3. Enable real-time collaboration features
4. Provide version control and document history
5. Integrate with existing enterprise systems

## Technical Approach

The system will be built using a modern technology stack:

- Frontend: React.js with TypeScript
- Backend: Django with PostgreSQL
- Storage: AWS S3 for document storage
- Search: Elasticsearch for full-text search
- Authentication: JWT-based auth system

## Timeline and Milestones

- Phase 1 (Weeks 1-4): Architecture and core infrastructure
- Phase 2 (Weeks 5-8): Document storage and basic UI
- Phase 3 (Weeks 9-12): Search and collaboration features
- Phase 4 (Weeks 13-16): Testing, optimization, and deployment

## Budget

The estimated budget for this project is $150,000, covering development, testing, and initial deployment costs.

## Conclusion

This document management system will significantly improve organizational efficiency and collaboration while ensuring document security and compliance.`,
  created: "2025-04-15T10:30:00Z",
  modified: "2025-04-17T14:45:00Z",
  owner: "John Doe",
  starred: true,
  shared: [
    { id: "user-1", name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: "user-2", name: "Bob Johnson", email: "bob@example.com", role: "Viewer" }
  ],
  comments: [
    { 
      id: "comment-1", 
      user: "Jane Smith", 
      content: "Great proposal! I think we should add more details about the security features.", 
      timestamp: "2025-04-16T11:20:00Z" 
    },
    { 
      id: "comment-2", 
      user: "John Doe", 
      content: "I agree, I'll update the document with more security information.", 
      timestamp: "2025-04-16T13:45:00Z" 
    }
  ]
}

export default function DocumentViewer() {
  const params = useParams()
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [document, setDocument] = useState(mockDocument)
  const [isStarred, setIsStarred] = useState(document.starred)
  
  // In a real app, we would fetch the document based on the ID
  // const documentId = params.id

  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    const newCommentObj = {
      id: `comment-${document.comments.length + 1}`,
      user: "You",
      content: newComment,
      timestamp: new Date().toISOString()
    }
    
    setDocument(prev => ({
      ...prev,
      comments: [...prev.comments, newCommentObj]
    }))
    
    setNewComment("")
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the document",
    })
  }
  
  const handleToggleStar = () => {
    setIsStarred(!isStarred)
    
    toast({
      title: isStarred ? "Removed from starred" : "Added to starred",
      description: isStarred 
        ? "Document removed from your starred items" 
        : "Document added to your starred items",
    })
  }
  
  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    toast({
      title: "Share document",
      description: "Sharing options would appear here",
    })
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to documents
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Document content */}
          <div className="w-full lg:w-2/3">
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-bold">{document.title}</h1>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleToggleStar}
                  >
                    <Star 
                      className={`h-5 w-5 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} 
                    />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 min-h-[500px] prose dark:prose-invert max-w-none">
                {document.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.substring(2)}</h1>
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.substring(3)}</h2>
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-disc pl-5 my-3">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i}>{item.substring(2)}</li>
                        ))}
                      </ul>
                    )
                  } else {
                    return <p key={index} className="my-3">{paragraph}</p>
                  }
                })}
              </div>
            </div>
          </div>
          
          {/* Sidebar with comments and sharing */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Document info */}
            <div className="bg-card rounded-lg border p-4">
              <h2 className="font-semibold mb-4">Document Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDate(document.created)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modified</span>
                  <span className="font-medium">{formatDate(document.modified)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-medium">{document.owner}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium uppercase">{document.type}</span>
                </div>
              </div>
            </div>
            
            {/* Shared with */}
            <div className="bg-card rounded-lg border p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Shared with</h2>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <div className="space-y-3">
                {document.shared.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Comments */}
            <div className="bg-card rounded-lg border p-4">
              <h2 className="font-semibold mb-4 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments ({document.comments.length})
              </h2>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {document.comments.map(comment => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{comment.user}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(comment.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button size="icon" onClick={handleAddComment}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}