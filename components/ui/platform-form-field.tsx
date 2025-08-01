import * as React from "react";
import { cn } from "@/lib/utils";

interface PlatformFormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export function PlatformFormField({
  label,
  htmlFor,
  required = false,
  error,
  helpText,
  children,
  className,
}: PlatformFormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-medium text-platform-fg-default"
        >
          {label}
          {required && (
            <span className="text-platform-danger-fg ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <div className="relative">
        {children}
      </div>
      
      {error && (
        <div className="text-xs text-platform-danger-fg mt-1">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="text-xs text-platform-fg-muted mt-1">
          {helpText}
        </div>
      )}
    </div>
  );
}

interface PlatformFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function PlatformForm({ children, onSubmit, className }: PlatformFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-3", className)}
    >
      {children}
    </form>
  );
}

interface PlatformAlertProps {
  variant?: "info" | "success" | "warning" | "danger";
  children: React.ReactNode;
  className?: string;
}

export function PlatformAlert({ 
  variant = "info", 
  children, 
  className 
}: PlatformAlertProps) {
  const variantClasses = {
    info: "platform-alert-info",
    success: "platform-alert-success", 
    warning: "platform-alert-warning",
    danger: "platform-alert-danger"
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  );
}