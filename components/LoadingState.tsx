interface PageLoadingStateProps {
  variant?: 'page' | 'cards' | 'table'
}

const skeletonClassName = 'animate-pulse rounded-3xl border border-border bg-white/72 shadow-[0_18px_48px_rgba(6,95,84,0.06)] backdrop-blur-md'

export function PageLoadingState({ variant = 'page' }: PageLoadingStateProps) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`${skeletonClassName} h-32`} />
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className={`${skeletonClassName} h-24`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-12 w-64 animate-pulse rounded-3xl bg-white/72 shadow-sm" />
        <div className="h-5 w-full max-w-md animate-pulse rounded-xl bg-white/72 shadow-sm" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`${skeletonClassName} h-32`} />
        ))}
      </div>
      <div className={`${skeletonClassName} h-80`} />
    </div>
  )
}
