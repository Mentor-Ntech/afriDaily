"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet, LogOut, ExternalLink, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { useWallet } from "@/hooks/use-wallet"
import { formatAddress } from "@/lib/formatting"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletConnectButton() {
  const router = useRouter()
  const { isConnected, address, isLoading, connect, disconnect } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    try {
      await connect()
      // Save connection state
      if (typeof window !== "undefined") {
        localStorage.setItem("afridaily_wallet_connected", "true")
      }
      toast({
        title: "Wallet connected",
        description: "Successfully connected to your wallet",
      })
      // Redirect to dashboard after successful connection
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        toast({
          title: "Address copied",
          description: "Wallet address copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
        })
      }
    }
  }

  const handleDisconnect = () => {
    disconnect()
    // Clear connection state
    if (typeof window !== "undefined") {
      localStorage.removeItem("afridaily_wallet_connected")
    }
    toast({
      title: "Wallet disconnected",
      description: "You have been disconnected",
    })
    // Redirect to landing page if on dashboard
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
      router.push("/")
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        variant="primary"
        size="md"
        className="gap-2 h-10 md:h-11"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">{isLoading ? "Connecting..." : "Connect Wallet"}</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="md" className="gap-2 h-10 md:h-11">
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{formatAddress(address || "", 4)}</span>
          <span className="sm:hidden">{formatAddress(address || "", 2)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 border-b border-border">
          <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
          <p className="text-sm font-mono text-foreground break-all">{address}</p>
        </div>
        <DropdownMenuItem onClick={handleCopyAddress} className="gap-2 cursor-pointer">
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Address</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a
            href={`https://explorer.celo.org/mainnet/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Explorer</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="gap-2 cursor-pointer text-destructive">
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
