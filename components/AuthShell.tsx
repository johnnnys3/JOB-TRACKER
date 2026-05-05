import Link from 'next/link'
import { ReactNode } from 'react'
import { Github, Mail, Rocket, User, Verified } from 'lucide-react'

import { AppLogo } from '@/components/AppLogo'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AuthShellProps {
  title: string
  description: ReactNode
  children: ReactNode
  variant?: 'login' | 'register'
}

export function AuthShell({ title, description, children, variant = 'login' }: AuthShellProps) {
  if (variant === 'register') {
    return (
      <main className="auth-page-shell">
        <div className="app-container flex min-h-screen flex-col justify-center py-10">
          <div className="auth-register-grid">
            <section className="auth-register-copy">
              <AppLogo />
              <h1>Accelerate your <span>professional</span> evolution.</h1>
              <p>
                Join a high-performance workspace for organizing opportunities, tracking interviews, and turning momentum into offers.
              </p>
              <div className="auth-chip-row">
                <span><Verified className="h-4 w-4" aria-hidden="true" /> Trusted by focused job seekers</span>
                <span><Rocket className="h-4 w-4" aria-hidden="true" /> AI-powered insights</span>
              </div>
            </section>

            <Card className="auth-form-card">
              <CardHeader>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
                <p className="text-sm font-medium leading-6 text-muted-foreground">{description}</p>
              </CardHeader>
              <CardContent>
                <SocialAuthButtons />
                <AuthDivider />
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page-shell">
      <div className="app-container flex min-h-screen flex-col items-center">
        <div className="flex w-full justify-center py-10">
          <AppLogo />
        </div>

        <div className="flex w-full flex-1 items-start justify-center pb-12">
          <Card className="auth-login-card">
            <CardHeader>
              <div className="text-center">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
                <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{description}</p>
              </div>
            </CardHeader>
            <CardContent>
              {children}
              <AuthDivider />
              <SocialAuthButtons />
              <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
                New to CareerFlow?{' '}
                <Link href="/register" className="font-bold text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="auth-quote-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-100 bg-white text-primary">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">"The best way to predict your future is to create it."</p>
            <p className="mt-1 text-xs font-bold text-primary">CareerFlow Concierge</p>
          </div>
        </div>
      </div>
    </main>
  )
}

function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/70" />
      </div>
      <div className="relative flex justify-center text-xs font-bold uppercase tracking-[0.18em]">
        <span className="bg-white/70 px-4 text-muted-foreground backdrop-blur-md">Or continue with</span>
      </div>
    </div>
  )
}

function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button type="button" variant="outline" className="w-full">
        <Mail className="h-4 w-4" aria-hidden="true" />
        Google
      </Button>
      <Button type="button" variant="outline" className="w-full">
        <Github className="h-4 w-4" aria-hidden="true" />
        GitHub
      </Button>
    </div>
  )
}
