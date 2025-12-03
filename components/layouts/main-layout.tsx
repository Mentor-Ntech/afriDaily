"use client"

import type React from "react"

import { Header } from "./header"
import { BottomNav } from "./bottom-nav"
import { OfflineIndicator } from "./offline-indicator"
import { usePathname } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
  showWalletConnect?: boolean
}

export function MainLayout({ children, showWalletConnect = true }: MainLayoutProps) {
  const pathname = usePathname()

  // Hide nav on landing page and auth pages
  const isLandingPage = pathname === "/"
  const isAuthPage = pathname?.startsWith("/wallet/create") || pathname?.startsWith("/wallet/import")

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!isLandingPage && !isAuthPage && <Header showWalletConnect={showWalletConnect} />}
      {!isLandingPage && <OfflineIndicator />}

      {/* Main content with padding for bottom nav on mobile */}
      <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>

      {!isLandingPage && !isAuthPage && <BottomNav />}
    </div>
  )
}
