"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, type, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="text-label font-medium block text-foreground">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-3 text-base font-medium rounded-lg border-2 transition-colors duration-200",
            "placeholder:text-muted-foreground placeholder:italic",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            error ? "border-destructive bg-destructive/5" : "border-input bg-background focus:border-primary",
            icon && "pl-11",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="text-caption text-destructive">{error}</p>}
      {helperText && !error && <p className="text-caption text-muted-foreground">{helperText}</p>}
    </div>
  ),
)

Input.displayName = "Input"

export { Input }
