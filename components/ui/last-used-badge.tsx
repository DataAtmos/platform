import { Badge } from "@/components/ui/badge"

interface LastUsedBadgeProps {
  show: boolean
  className?: string
}

export function LastUsedBadge({ show, className = "" }: LastUsedBadgeProps) {
  if (!show) return null

  return (
    <Badge
      variant="secondary"
      className={`text-[10px] px-1.5 py-0.5 font-medium text-white border border-green-500/30 bg-gradient-to-br from-green-800 via-green-600 to-green-400 ${className}`}
    >
      LAST USED
    </Badge>
  )
}
