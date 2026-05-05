import Link from 'next/link'
import { ArrowLeft, Home, SearchX } from 'lucide-react'

import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="app-grid-bg min-h-screen bg-background">
      <div className="app-container flex min-h-screen flex-col">
        <div className="flex h-16 items-center">
          <AppLogo />
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="frosted-surface max-w-lg rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-accent text-primary">
              <SearchX className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-primary">404</p>
            <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">This page wandered off your job search.</h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The page you're looking for doesn't exist or may have moved.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/dashboard">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Back to dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/applications">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  View applications
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
