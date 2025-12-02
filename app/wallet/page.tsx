"use client"

import { useState } from "react"
import { QrCode, Copy, Download, Eye, Send, Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from "@/components/features/transaction-history"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatAddress, formatCurrency } from "@/lib/formatting"
import { useToast } from "@/hooks/use-toast"

const mockAddress = "0x1234567890123456789012345678901234567890"
// Use fixed dates to prevent hydration errors
const mockTransactions = [
  {
    id: "1",
    type: "sent" as const,
    address: "0x9876...5432",
    amount: "50.00",
    currency: "cUSD" as const,
    timestamp: new Date("2025-12-02T09:30:00"),
    hash: "0xabc123def456...",
    status: "success" as const,
  },
  {
    id: "2",
    type: "received" as const,
    address: "0xabcd...ef01",
    amount: "100.00",
    currency: "cUSD" as const,
    timestamp: new Date("2025-12-01T14:20:00"),
    hash: "0xdef456ghi789...",
    status: "success" as const,
  },
  {
    id: "3",
    type: "sent" as const,
    address: "0x5678...9012",
    amount: "25.50",
    currency: "cNGN" as const,
    timestamp: new Date("2025-11-30T10:15:00"),
    hash: "0xghi789jkl012...",
    status: "pending" as const,
  },
]

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showQRModal, setShowQRModal] = useState(false)
  const { toast } = useToast()

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(mockAddress)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const filteredTransactions =
    activeTab === "all"
      ? mockTransactions
      : mockTransactions.filter((tx) => tx.type === activeTab)

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      {/* Header */}
      <div className="safe-container py-6 md:py-8 lg:py-12">
        <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
          My Wallet
        </h1>
        <p className="text-base text-muted-foreground leading-[1.5]">
          Manage your funds and transactions
        </p>
      </div>

      <div className="safe-container space-y-6 md:space-y-8">
        {/* Balance Overview Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm">
          <CardContent className="pt-6 md:pt-8 pb-6 md:pb-8">
            <div className="mb-6 md:mb-8">
              <p className="text-sm text-muted-foreground font-medium mb-2">Total Balance</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-primary leading-[1.4]">
                  ₵347.92
                </span>
                <span className="text-sm text-muted-foreground">cUSD</span>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 pt-6 border-t border-border">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                    cUSD Balance
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {formatCurrency("347.92", "cUSD")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                    cNGN Balance
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {formatCurrency("45000", "cNGN")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button asChild className="h-12 gap-2">
            <a href="/wallet/send">
              <Send className="w-5 h-5" />
              <span>Send</span>
            </a>
          </Button>
          <Button variant="secondary" asChild className="h-12 gap-2">
            <a href="/wallet/receive">
              <Plus className="w-5 h-5" />
              <span>Receive</span>
            </a>
          </Button>
          <Button variant="ghost" asChild className="h-12 gap-2">
            <a href="/wallet/add-funds">
              <Plus className="w-5 h-5" />
              <span>Add Funds</span>
            </a>
          </Button>
        </div>

        {/* Wallet Address Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[24px] leading-[1.4]">Wallet Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 font-mono text-sm text-center break-all">
              {mockAddress}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={handleCopyAddress} className="gap-2 h-11">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="ghost" onClick={() => setShowQRModal(true)} className="gap-2 h-11">
                <QrCode className="w-4 h-4" />
                QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[24px] leading-[1.4] mb-4">Transaction History</CardTitle>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="sent" className="text-xs sm:text-sm">
                  Sent
                </TabsTrigger>
                <TabsTrigger value="received" className="text-xs sm:text-sm">
                  Received
                </TabsTrigger>
                <TabsTrigger value="streams" className="text-xs sm:text-sm">
                  Streams
                </TabsTrigger>
                <TabsTrigger value="circles" className="text-xs sm:text-sm">
                  Circles
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <TransactionHistory transactions={filteredTransactions} />
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-base">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" asChild className="w-full justify-start gap-2 h-11">
              <a href="/wallet/backup">
                <Download className="w-4 h-4" />
                <span>Backup Wallet</span>
              </a>
            </Button>
            <Button variant="danger-ghost" asChild className="w-full justify-start gap-2 h-11">
              <a href="/wallet/export-key">
                <Eye className="w-4 h-4" />
                <span>Export Private Key</span>
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[24px] leading-[1.4]">Receive Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <QrCode className="w-24 h-24 text-muted-foreground" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">
                Wallet Address
              </p>
              <p className="font-mono text-sm break-all text-foreground bg-muted p-3 rounded-lg">
                {formatAddress(mockAddress, 6)}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={handleCopyAddress} className="flex-1 gap-2">
                <Copy className="w-4 h-4" />
                Copy Address
              </Button>
              <Button onClick={() => setShowQRModal(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
