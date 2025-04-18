"use client"

import { 
  FileText, 
  Users, 
  Lock, 
  Search, 
  History, 
  Share2 
} from "lucide-react"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { CardHoverEffect } from "@/components/ui/card-hover-effect"

const features = [
  {
    title: "Document Storage",
    description: "Securely store all your documents in one place with unlimited storage and automatic backups.",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Collaboration",
    description: "Work together with your team in real-time. Comment, edit, and share documents seamlessly.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Advanced Security",
    description: "Enterprise-grade security with encryption, access controls, and compliance features.",
    icon: <Lock className="h-6 w-6" />,
  },
  {
    title: "Powerful Search",
    description: "Find any document instantly with our advanced full-text search capabilities.",
    icon: <Search className="h-6 w-6" />,
  },
  {
    title: "Version Control",
    description: "Track changes and maintain document history with automatic versioning.",
    icon: <History className="h-6 w-6" />,
  },
  {
    title: "Sharing & Permissions",
    description: "Share documents securely with customizable permission settings.",
    icon: <Share2 className="h-6 w-6" />,
  },
]

export function FeatureSection() {
  return (
    <section className="bg-muted/50 py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features for Modern Document Management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to manage your documents efficiently in one platform.
          </p>
        </div>
        
        <TracingBeam className="px-4">
          <div className="max-w-5xl mx-auto">
            <CardHoverEffect items={features.map(feature => ({
              title: feature.title,
              description: feature.description,
              icon: feature.icon,
            }))} />
          </div>
        </TracingBeam>
      </div>
    </section>
  )
}