import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

interface AlertMessageProps {
  variant?: 'error' | 'success' | 'info' | 'warning'
  title?: string
  children: React.ReactNode
  className?: string
}

const variantClassNames = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-teal-200 bg-teal-50 text-teal-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
}

export function AlertMessage({ variant = 'info', title, children, className }: AlertMessageProps) {
  const Icon = variant === 'success' ? CheckCircle2 : variant === 'warning' ? TriangleAlert : variant === 'info' ? Info : AlertCircle

  return (
    <div className={cn('flex gap-3 rounded-3xl border p-4 text-sm font-medium leading-6 shadow-[0_12px_30px_rgba(6,95,84,0.06)]', variantClassNames[variant], className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/72">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        {title ? <p className="font-bold">{title}</p> : null}
        <div className={title ? 'mt-1' : undefined}>{children}</div>
      </div>
    </div>
  )
}
