import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_12px_26px_rgba(0,107,95,0.20)] hover:scale-[1.02] hover:bg-[hsl(var(--primary-dark))] hover:shadow-[0_16px_34px_rgba(0,107,95,0.24)] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        danger:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-white/60 bg-white/70 text-primary shadow-sm backdrop-blur-md hover:scale-[1.02] hover:border-primary/25 hover:bg-white/90 active:scale-[0.98]",
        secondary:
          "bg-accent text-primary hover:scale-[1.02] hover:bg-secondary/15 active:scale-[0.98]",
        ghost: "text-muted-foreground shadow-none hover:bg-accent hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        hero:
          "h-12 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_14px_32px_rgba(0,107,95,0.22)] hover:bg-[hsl(var(--primary-dark))]",
        heroSecondary:
          "h-12 rounded-xl border border-white/60 bg-white/70 px-7 text-base font-semibold text-primary shadow-sm backdrop-blur-md hover:bg-white/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
