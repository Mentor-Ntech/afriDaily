"use client"

import React from "react"

interface IllustrationProps {
  className?: string
  animated?: boolean
}

// Empty Wallet Illustration
export function EmptyWalletIllustration({ className = "", animated = true }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Empty Wallet"
    >
      <defs>
        {animated && (
          <>
            <animate
              id="wallet-float"
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values="0,0;0,-5;0,0"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              id="coin-rotate"
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 120 100;360 120 100"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              id="sparkle-fade"
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </>
        )}
      </defs>

      {/* Wallet base */}
      <rect
        x="60"
        y="80"
        width="120"
        height="80"
        rx="8"
        fill="#0B5FFF"
        opacity="0.1"
        transform={animated ? "translate(0,0)" : ""}
      >
        {animated && <animateTransform href="#wallet-float" />}
      </rect>

      {/* Wallet card */}
      <rect
        x="70"
        y="90"
        width="100"
        height="60"
        rx="6"
        fill="#0B5FFF"
        transform={animated ? "translate(0,0)" : ""}
      >
        {animated && <animateTransform href="#wallet-float" />}
      </rect>

      {/* Wallet flap */}
      <path
        d="M60 80 Q60 60 80 60 L160 60 Q180 60 180 80"
        fill="#0B5FFF"
        opacity="0.2"
        transform={animated ? "translate(0,0)" : ""}
      >
        {animated && <animateTransform href="#wallet-float" />}
      </path>

      {/* Coins floating around */}
      <circle cx="120" cy="100" r="12" fill="#FFB703" opacity="0.8">
        {animated && <animateTransform href="#coin-rotate" />}
      </circle>
      <circle cx="50" cy="50" r="8" fill="#FFB703" opacity="0.6">
        {animated && (
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0,0;10,10;0,0"
            dur="4s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="190" cy="50" r="8" fill="#FFB703" opacity="0.6">
        {animated && (
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0,0;-10,10;0,0"
            dur="4s"
            begin="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Sparkles */}
      {animated && (
        <>
          <circle cx="40" cy="30" r="2" fill="#FFB703">
            <animate href="#sparkle-fade" />
          </circle>
          <circle cx="200" cy="30" r="2" fill="#FFB703">
            <animate href="#sparkle-fade" begin="0.5s" />
          </circle>
          <circle cx="30" cy="150" r="2" fill="#FFB703">
            <animate href="#sparkle-fade" begin="1s" />
          </circle>
          <circle cx="210" cy="150" r="2" fill="#FFB703">
            <animate href="#sparkle-fade" begin="1.5s" />
          </circle>
        </>
      )}
    </svg>
  )
}

// Empty Streams Illustration
export function EmptyStreamsIllustration({ className = "", animated = true }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Empty Streams"
    >
      <defs>
        {animated && (
          <>
            <animate
              id="stream-flow"
              attributeName="d"
              values="M40 100 L200 100;M40 100 L200 100;M40 100 L200 100"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              id="wave-move"
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values="0,0;20,0;0,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </>
        )}
      </defs>

      {/* Stream flow line */}
      <path
        d="M40 100 L200 100"
        stroke="#0B5FFF"
        strokeWidth="3"
        strokeDasharray="8 4"
        opacity="0.6"
      >
        {animated && (
          <animate
            attributeName="stroke-dashoffset"
            values="0;12"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Waves */}
      <path
        d="M40 100 Q60 90 80 100 T120 100 T160 100 T200 100"
        stroke="#0B5FFF"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
        transform={animated ? "translate(0,0)" : ""}
      >
        {animated && <animateTransform href="#wave-move" />}
      </path>

      {/* Coins flowing */}
      <circle cx="60" cy="100" r="10" fill="#FFB703" opacity="0.8">
        {animated && (
          <animate
            attributeName="cx"
            values="60;200;60"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="100" cy="100" r="8" fill="#FFB703" opacity="0.7">
        {animated && (
          <animate
            attributeName="cx"
            values="100;200;100"
            dur="3.5s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Source and destination */}
      <circle cx="40" cy="100" r="15" fill="#0B5FFF" opacity="0.2" />
      <rect x="195" y="90" width="20" height="20" rx="4" fill="#16A34A" opacity="0.3" />
    </svg>
  )
}

// Empty Circles Illustration
export function EmptyCirclesIllustration({ className = "", animated = true }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Empty Circles"
    >
      <defs>
        {animated && (
          <>
            <animate
              id="circle-pulse"
              attributeName="r"
              values="20;25;20"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              id="circle-rotate"
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 120 100;360 120 100"
              dur="15s"
              repeatCount="indefinite"
            />
          </>
        )}
      </defs>

      {/* Main circle outline */}
      <circle
        cx="120"
        cy="100"
        r="40"
        stroke="#0B5FFF"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      {/* Rotating smaller circles */}
      <g transform={animated ? "translate(120,100)" : ""}>
        {animated && <animateTransform href="#circle-rotate" />}
        <circle cx="0" cy="-30" r="8" fill="#FFB703" opacity="0.7" />
        <circle cx="26" cy="15" r="8" fill="#FFB703" opacity="0.7" />
        <circle cx="-26" cy="15" r="8" fill="#FFB703" opacity="0.7" />
      </g>

      {/* Connecting lines */}
      <g stroke="#0B5FFF" strokeWidth="1.5" opacity="0.2" fill="none">
        <line x1="120" y1="60" x2="120" y2="70" />
        <line x1="146" y1="115" x2="140" y2="110" />
        <line x1="94" y1="115" x2="100" y2="110" />
      </g>

      {/* Sparkles around */}
      {animated && (
        <>
          <circle cx="80" cy="60" r="3" fill="#FFB703" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="160" cy="60" r="3" fill="#FFB703" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="80" cy="140" r="3" fill="#FFB703" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="160" cy="140" r="3" fill="#FFB703" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </svg>
  )
}

// Success Illustration
export function SuccessIllustration({ className = "", animated = true }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Success"
    >
      <defs>
        {animated && (
          <>
            <animate
              id="check-draw"
              attributeName="stroke-dashoffset"
              values="100;0"
              dur="0.8s"
              fill="freeze"
            />
            <animate
              id="circle-grow"
              attributeName="r"
              values="0;50;45"
              dur="1s"
              fill="freeze"
            />
          </>
        )}
      </defs>

      {/* Background circle */}
      <circle
        cx="120"
        cy="100"
        r="45"
        fill="#16A34A"
        opacity="0.1"
      >
        {animated && <animate href="#circle-grow" />}
      </circle>

      {/* Checkmark circle */}
      <circle
        cx="120"
        cy="100"
        r="40"
        stroke="#16A34A"
        strokeWidth="3"
        fill="none"
      />

      {/* Checkmark */}
      <path
        d="M95 100 L110 115 L145 80"
        stroke="#16A34A"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset={animated ? "100" : "0"}
      >
        {animated && <animate href="#check-draw" />}
      </path>

      {/* Sparkles */}
      {animated && (
        <>
          <circle cx="70" cy="60" r="3" fill="#16A34A" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="170" cy="60" r="3" fill="#16A34A" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="70" cy="140" r="3" fill="#16A34A" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin="1.4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="170" cy="140" r="3" fill="#16A34A" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin="1.6s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </svg>
  )
}

// Loading Illustration
export function LoadingIllustration({ className = "", animated = true }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
    >
      <defs>
        {animated && (
          <>
            <animate
              id="spin"
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              values="0 120 100;360 120 100"
              dur="2s"
              repeatCount="indefinite"
            />
          </>
        )}
      </defs>

      {/* Rotating circles */}
      <g transform={animated ? "translate(120,100)" : ""}>
        {animated && <animateTransform href="#spin" />}
        <circle cx="0" cy="-30" r="8" fill="#0B5FFF" opacity="0.8" />
        <circle cx="26" cy="15" r="8" fill="#FFB703" opacity="0.8" />
        <circle cx="-26" cy="15" r="8" fill="#0B5FFF" opacity="0.8" />
      </g>

      {/* Pulsing center */}
      <circle cx="120" cy="100" r="15" fill="#0B5FFF" opacity="0.3">
        {animated && (
          <animate
            attributeName="r"
            values="15;20;15"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  )
}

// Transaction Illustration
export function TransactionIllustration({ className = "", animated = true }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Transaction"
    >
      {/* Arrow moving */}
      <path
        d="M60 100 L180 100"
        stroke="#0B5FFF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      >
        {animated && (
          <animate
            attributeName="stroke-dashoffset"
            values="0;120"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Arrow head */}
      <path
        d="M170 95 L180 100 L170 105"
        stroke="#0B5FFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Coins */}
      <circle cx="50" cy="100" r="12" fill="#FFB703" opacity="0.8">
        {animated && (
          <animate
            attributeName="cx"
            values="50;170;50"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="190" cy="100" r="12" fill="#16A34A" opacity="0.8" />

      {/* Sparkles */}
      {animated && (
        <>
          <circle cx="120" cy="80" r="2" fill="#FFB703" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="120" cy="120" r="2" fill="#FFB703" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              begin="0.75s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </svg>
  )
}

