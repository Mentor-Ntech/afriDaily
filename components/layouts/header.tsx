"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { WalletConnectButton } from "@/components/web3/wallet-connect-button"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/logo"

interface HeaderProps {
  showWalletConnect?: boolean
  onMenuClick?: () => void
}

export function Header({ showWalletConnect = true, onMenuClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    onMenuClick?.()
  }

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="safe-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="md" showText={true} animated={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/wallet"
            className={`text-sm font-medium transition-colors ${
              pathname?.startsWith("/wallet") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Wallet
          </Link>
          <Link
            href="/streams"
            className={`text-sm font-medium transition-colors ${
              pathname?.startsWith("/streams") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Streams
          </Link>
          <Link
            href="/circles"
            className={`text-sm font-medium transition-colors ${
              pathname?.startsWith("/circles") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Circles
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {showWalletConnect && <WalletConnectButton />}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-muted/30">
          <div className="safe-container py-4 space-y-2">
            <Link
              href="/dashboard"
              className={`block px-4 py-2 rounded-lg hover:bg-muted font-medium transition-colors ${
                pathname === "/dashboard" ? "text-foreground bg-muted" : "text-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/wallet"
              className={`block px-4 py-2 rounded-lg hover:bg-muted font-medium transition-colors ${
                pathname?.startsWith("/wallet") ? "text-foreground bg-muted" : "text-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Wallet
            </Link>
            <Link
              href="/streams"
              className={`block px-4 py-2 rounded-lg hover:bg-muted font-medium transition-colors ${
                pathname?.startsWith("/streams") ? "text-foreground bg-muted" : "text-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Streams
            </Link>
            <Link
              href="/circles"
              className={`block px-4 py-2 rounded-lg hover:bg-muted font-medium transition-colors ${
                pathname?.startsWith("/circles") ? "text-foreground bg-muted" : "text-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Circles
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
