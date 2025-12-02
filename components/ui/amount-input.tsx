"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CURRENCY_SYMBOLS } from "@/lib/constants"

interface AmountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: "cUSD" | "cNGN"
  label?: string
  error?: string
  helperText?: string
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  ({ className, currency = "cUSD", label, error, helperText, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "")
      if (!isNaN(Number(value))) {
        const formatted = Number(value).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
        setDisplayValue(formatted)
        props.onChange?.(e)
      }
    }

    return (
      <div className="space-y-2">
        {label && <label className="text-label font-medium block text-foreground">{label}</label>}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary pointer-events-none">
            {CURRENCY_SYMBOLS[currency]}
          </span>
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            className={cn(
              "w-full pl-12 pr-4 py-3 text-lg font-semibold",
              "rounded-lg border-2 transition-colors duration-200",
              "placeholder:text-muted-foreground placeholder:italic",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
              error
                ? "border-destructive bg-destructive/5 focus:border-destructive"
                : "border-input bg-background focus:border-primary",
              className,
            )}
            value={displayValue}
            onChange={handleChange}
            placeholder="0.00"
            {...props}
          />
        </div>
        {error && <p className="text-caption text-destructive">{error}</p>}
        {helperText && !error && <p className="text-caption text-muted-foreground">{helperText}</p>}
      </div>
    )
  },
)

AmountInput.displayName = "AmountInput"

export { AmountInput }
