import Link from 'next/link'
import { BriefcaseBusiness } from 'lucide-react'

import { cn } from '@/lib/utils'

interface AppLogoProps {
  href?: string
  className?: string
}

export function AppLogo({ href = '/', className }: AppLogoProps) {
  const content = (
    <span className={cn('inline-flex items-center gap-2.5 text-sm font-black text-primary', className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(0,107,95,0.22)]">
        <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="leading-none">CareerFlow</span>
    </span>
  )

  if (!href) {
    return content
  }

  return (
    <Link href={href} className="inline-flex focus-ring rounded-lg">
      {content}
    </Link>
  )
}
