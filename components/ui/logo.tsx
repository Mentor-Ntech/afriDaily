"use client"

import React from "react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  animated?: boolean
}

export function Logo({ className = "", size = "md", showText = true, animated = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const textSizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        className={`${sizeClasses[size]} ${animated ? "logo-animate" : ""}`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="AfriDaily Logo"
      >
        {/* Main circular background - represents unity and completeness */}
        <circle cx="32" cy="32" r="28" fill="#0B5FFF" className={animated ? "logo-pulse" : ""} />

        {/* Stylized "A" letter - AfriDaily */}
        <path
          d="M32 12 L24 44 L28 44 L30 36 L34 36 L36 44 L40 44 L32 12 Z M30 30 L32 22 L34 30 L30 30 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* Coins/Circles representing daily finance - animated rotation */}
        <g className={animated ? "logo-rotate-slow" : ""}>
          {/* Top coin */}
          <circle cx="32" cy="14" r="4" fill="#FFB703" opacity="0.9" />
          {/* Bottom coin */}
          <circle cx="32" cy="50" r="4" fill="#FFB703" opacity="0.9" />
          {/* Left coin */}
          <circle cx="14" cy="32" r="3.5" fill="#FFB703" opacity="0.85" />
          {/* Right coin */}
          <circle cx="50" cy="32" r="3.5" fill="#FFB703" opacity="0.85" />
        </g>

        {/* Sparkle effects - representing growth and prosperity */}
        {animated && (
          <>
            <circle cx="12" cy="12" r="1.5" fill="#FFB703" opacity="0.6" className="logo-sparkle" />
            <circle
              cx="52"
              cy="12"
              r="1.5"
              fill="#FFB703"
              opacity="0.6"
              className="logo-sparkle"
              style={{ animationDelay: "0.5s" }}
            />
            <circle
              cx="12"
              cy="52"
              r="1.5"
              fill="#FFB703"
              opacity="0.6"
              className="logo-sparkle"
              style={{ animationDelay: "1s" }}
            />
            <circle
              cx="52"
              cy="52"
              r="1.5"
              fill="#FFB703"
              opacity="0.6"
              className="logo-sparkle"
              style={{ animationDelay: "1.5s" }}
            />
          </>
        )}

        {/* Connecting lines - representing blockchain/network */}
        <g stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" fill="none">
          <line x1="32" y1="14" x2="28" y2="18" />
          <line x1="32" y1="14" x2="36" y2="18" />
          <line x1="28" y1="46" x2="24" y2="50" />
          <line x1="36" y1="46" x2="40" y2="50" />
        </g>
      </svg>
      {showText && (
        <span className={`font-bold text-foreground ${textSizeClasses[size]}`}>AfriDaily</span>
      )}
    </div>
  )
}
