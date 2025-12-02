"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, Zap, Users } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/streams", label: "Streams", icon: Zap },
  { href: "/circles", label: "Circles", icon: Users },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm md:hidden z-40"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around h-20 pb-safe">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (pathname.startsWith(href) && href !== "/dashboard" && pathname !== "/")
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors hover:bg-muted/50"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
