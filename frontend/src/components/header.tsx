"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">DocHub</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/features"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/features" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/docs" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Documentation
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}