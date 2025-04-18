"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Product</h3>
            <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
            <Link href="/changelog" className="text-sm text-muted-foreground hover:text-foreground">
              Changelog
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Company</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
              Careers
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Legal</h3>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Connect</h3>
            <Link href="https://twitter.com" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
            <Link href="https://linkedin.com" className="text-sm text-muted-foreground hover:text-foreground">
              LinkedIn
            </Link>
            <Link href="https://discord.com" className="text-sm text-muted-foreground hover:text-foreground">
              Discord
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DocHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}