import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
}

export function Loader({ size = "md" }: LoaderProps) {

  const dotSizes = {
    sm: "h-1 w-1",
    md: "h-1.5 w-1.5",
    lg: "h-2 w-2",
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex items-center gap-1">
        <div
          className={cn("rounded-full bg-foreground/20 animate-pulse", dotSizes[size])}
          style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
        />
        <div
          className={cn("rounded-full bg-foreground/40 animate-pulse", dotSizes[size])}
          style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
        />
        <div
          className={cn("rounded-full bg-foreground/60 animate-pulse", dotSizes[size])}
          style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
        />
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex items-center gap-1">
        <div
          className="h-2 w-2 rounded-full bg-foreground/20 animate-pulse"
          style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
        />
        <div
          className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse"
          style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
        />
        <div
          className="h-2 w-2 rounded-full bg-foreground/60 animate-pulse"
          style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
        />
      </div>
    </div>
  )
}

export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="flex items-center gap-1">
        <div
          className="h-1 w-1 rounded-full bg-foreground/20 animate-pulse"
          style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
        />
        <div
          className="h-1 w-1 rounded-full bg-foreground/40 animate-pulse"
          style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
        />
        <div
          className="h-1 w-1 rounded-full bg-foreground/60 animate-pulse"
          style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
        />
      </div>
    </div>
  )
}
