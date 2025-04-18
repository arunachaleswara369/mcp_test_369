import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/hero-section'
import { FeatureSection } from '@/components/feature-section'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        
        <section className="container py-24 sm:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to get started?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Start managing your documents efficiently with our powerful yet simple platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button>Get Started</Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline">Documentation</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}