import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

interface FormFieldProps {
  label?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactElement
  className?: string
}

export function FormField({
  label,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = React.useId()
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-1 text-xs font-medium">
          {label}
          {required && (
            <span className="text-destructive text-xs" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}
      
      {description && (
        <p
          id={descriptionId}
          className="text-xs text-muted-foreground/80"
        >
          {description}
        </p>
      )}
      
      {React.cloneElement(children, {
        id,
        'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? 'true' : undefined,
      } as React.HTMLAttributes<HTMLElement>)}
      
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-destructive flex items-center gap-1"
        >
          <svg
            className="size-3 shrink-0"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="6" fill="currentColor" />
            <path
              d="M6 4v2.5M6 9h.01"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}