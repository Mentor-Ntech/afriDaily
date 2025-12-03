"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { ArrowLeft, Copy, CheckCircle2, Download, Share2, QrCode, MessageCircle } from "lucide-react"
import Link from "next/link"
import { formatAddress } from "@/lib/formatting"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ReceivePage() {
  const { address } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const walletAddress = address || "0x1234567890123456789012345678901234567890"

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
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

  const shareMessage = `Send me funds on AfriDaily!\n\nMy wallet address:\n${walletAddress}\n\nPowered by Celo blockchain 🚀`

  const handleShareWhatsApp = () => {
    const encodedMessage = encodeURIComponent(shareMessage)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    toast({
      title: "Opening WhatsApp",
      description: "Share your wallet address via WhatsApp",
    })
  }

  const handleShareTelegram = () => {
    const encodedMessage = encodeURIComponent(shareMessage)
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent("https://afridaily.app")}&text=${encodedMessage}`
    window.open(telegramUrl, "_blank")
    toast({
      title: "Opening Telegram",
      description: "Share your wallet address via Telegram",
    })
  }

  const handleDownloadQR = () => {
    // In a real app, this would download the QR code image
    toast({
      title: "QR Code",
      description: "QR code download feature coming soon",
    })
  }

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      <div className="safe-container py-6 md:py-8">
        <Link
          href="/wallet"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wallet
        </Link>

        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
              Receive Funds
            </h1>
            <p className="text-base text-muted-foreground">
              Share your wallet address or QR code to receive payments
            </p>
          </div>

          {/* QR Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4] text-center">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-lg border-2 border-border">
                  {/* QR Code Placeholder - In a real app, use a QR code library like qrcode.react */}
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Scan this QR code with another wallet to send funds
              </p>
              <Button variant="secondary" onClick={handleDownloadQR} className="w-full gap-2 h-11">
                <Download className="w-4 h-4" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Wallet Address Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Wallet Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4 md:p-6">
                <p className="font-mono text-sm md:text-base text-foreground break-all text-center">
                  {walletAddress}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleCopyAddress}
                  variant={copied ? "secondary" : "primary"}
                  className="gap-2 h-11"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Address
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="gap-2 h-11">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleShareWhatsApp} className="gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">W</span>
                      </div>
                      <span>Share on WhatsApp</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareTelegram} className="gap-2 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-[#0088cc] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">T</span>
                      </div>
                      <span>Share on Telegram</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Supported Networks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Supported Networks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold text-foreground">Celo Mainnet</p>
                    <p className="text-sm text-muted-foreground">cUSD, cNGN, CELO</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold text-foreground">Celo Alfajores (Testnet)</p>
                    <p className="text-sm text-muted-foreground">Test tokens only</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent text-xs font-bold">!</span>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Important</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Only send Celo-compatible tokens (cUSD, cNGN, CELO) to this address</li>
                    <li>Double-check the address before sharing</li>
                    <li>Never share your private key or recovery phrase</li>
                    <li>This address works on Celo Mainnet and Alfajores testnet</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

