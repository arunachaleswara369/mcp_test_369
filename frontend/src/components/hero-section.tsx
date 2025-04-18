"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackgroundBeams } from "@/components/ui/background-beams"

export function HeroSection() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-background flex flex-col items-center justify-center">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">Document Management</span>
          <span className="block text-primary">Reimagined</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A modern document management system that helps you organize, collaborate, and secure your important documents.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="lg" variant="outline" className="px-8">
              Learn More
            </Button>
          </Link>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative rounded-lg border bg-card p-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
              <span>Trusted by over 10,000 organizations worldwide</span>
            </div>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </section>
  )
}