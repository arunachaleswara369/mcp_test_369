"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { 
  FileText, 
  FolderPlus, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical,
  Star,
  Clock,
  Users,
  Trash
} from "lucide-react"

// Mock data for documents
const mockDocuments = [
  {
    id: "doc-1",
    title: "Project Proposal",
    type: "pdf",
    size: "2.4 MB",
    modified: "2025-04-15",
    shared: true,
    starred: true,
  },
  {
    id: "doc-2",
    title: "Financial Report Q1",
    type: "xlsx",
    size: "1.8 MB",
    modified: "2025-04-10",
    shared: true,
    starred: false,
  },
  {
    id: "doc-3",
    title: "Meeting Notes",
    type: "docx",
    size: "0.5 MB",
    modified: "2025-04-17",
    shared: false,
    starred: false,
  },
  {
    id: "doc-4",
    title: "Product Roadmap",
    type: "pptx",
    size: "3.2 MB",
    modified: "2025-04-05",
    shared: true,
    starred: true,
  },
  {
    id: "doc-5",
    title: "User Research",
    type: "pdf",
    size: "4.7 MB",
    modified: "2025-04-12",
    shared: false,
    starred: false,
  },
]

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Filter documents based on selected filter and search query
  const filteredDocuments = mockDocuments.filter(doc => {
    let matchesFilter = true
    
    if (selectedFilter === "starred") {
      matchesFilter = doc.starred
    } else if (selectedFilter === "shared") {
      matchesFilter = doc.shared
    }
    
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
            <div className="bg-card rounded-lg border p-4">
              <h2 className="font-semibold mb-4">Filters</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`flex items-center w-full p-2 rounded-md text-sm ${
                    selectedFilter === "all" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  All Documents
                </button>
                <button
                  onClick={() => setSelectedFilter("starred")}
                  className={`flex items-center w-full p-2 rounded-md text-sm ${
                    selectedFilter === "starred" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Starred
                </button>
                <button
                  onClick={() => setSelectedFilter("shared")}
                  className={`flex items-center w-full p-2 rounded-md text-sm ${
                    selectedFilter === "shared" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Shared
                </button>
                <button
                  onClick={() => setSelectedFilter("recent")}
                  className={`flex items-center w-full p-2 rounded-md text-sm ${
                    selectedFilter === "recent" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Recent
                </button>
                <button
                  onClick={() => setSelectedFilter("trash")}
                  className={`flex items-center w-full p-2 rounded-md text-sm ${
                    selectedFilter === "trash" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Trash
                </button>
              </nav>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <h2 className="font-semibold mb-4">Storage</h2>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full w-[45%]"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">4.5 GB</span> of 10 GB used
                </p>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-3 space-y-6">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Documents list */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Modified</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50">
                      <div className="col-span-6 flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">{doc.size}</div>
                      <div className="col-span-3 text-sm text-muted-foreground">{doc.modified}</div>
                      <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No documents found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}