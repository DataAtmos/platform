import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full border px-6 py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 gap-y-1 items-center [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-sm rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-platform-canvas-default text-platform-fg-default border-platform-border-default",
        destructive:
          "border-platform-danger-emphasis/20 bg-platform-danger-subtle text-platform-danger-fg [&>svg]:text-platform-danger-emphasis *:data-[slot=alert-description]:text-platform-danger-fg/90",
        success:
          "border-platform-success-emphasis/20 bg-platform-success-subtle text-platform-success-fg [&>svg]:text-platform-success-emphasis *:data-[slot=alert-description]:text-platform-success-fg/90",
        warning:
          "border-platform-attention-emphasis/20 bg-platform-attention-subtle text-platform-attention-fg [&>svg]:text-platform-attention-emphasis *:data-[slot=alert-description]:text-platform-attention-fg/90",
        info: "border-platform-accent-emphasis/20 bg-platform-accent-subtle text-platform-accent-fg [&>svg]:text-platform-accent-emphasis *:data-[slot=alert-description]:text-platform-accent-fg/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-5 font-semibold tracking-tight text-left", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 text-left text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
