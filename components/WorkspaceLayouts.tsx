import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

interface BentoItemProps {
  children: ReactNode
  className?: string
  span?: 'default' | 'wide' | 'tall' | 'hero'
}

const spanClassNames = {
  default: '',
  wide: 'bento-wide',
  tall: 'bento-tall',
  hero: 'bento-hero',
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn('bento-grid', className)}>
      {children}
    </div>
  )
}

export function BentoItem({ children, className, span = 'default' }: BentoItemProps) {
  return (
    <div className={cn(spanClassNames[span], className)}>
      {children}
    </div>
  )
}

interface ThreePaneLayoutProps {
  left: ReactNode
  center: ReactNode
  right: ReactNode
  className?: string
}

export function ThreePaneLayout({ left, center, right, className }: ThreePaneLayoutProps) {
  return (
    <div className={cn('three-pane', className)}>
      <aside className="three-pane-column three-pane-sticky">{left}</aside>
      <section className="three-pane-column">{center}</section>
      <aside className="three-pane-column three-pane-sticky">{right}</aside>
    </div>
  )
}
