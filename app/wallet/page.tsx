"use client"

import { useState } from "react"
import { QrCode, Copy, Download, Eye, Send, Plus, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from "@/components/features/transaction-history"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatAddress, formatCurrency, formatDateTime } from "@/lib/formatting"
import { useToast } from "@/hooks/use-toast"

const mockAddress = "0x1234567890123456789012345678901234567890"
// Use fixed dates to prevent hydration errors
const mockTransactions = [
  {
    id: "1",
    type: "sent" as const,
    address: "0x9876543210987654321098765432109876543210",
    amount: "50.00",
    currency: "cUSD" as const,
    timestamp: new Date("2025-12-02T09:30:00"),
    hash: "0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    status: "success" as const,
    fee: "0.10",
  },
  {
    id: "2",
    type: "received" as const,
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    amount: "100.00",
    currency: "cUSD" as const,
    timestamp: new Date("2025-12-01T14:20:00"),
    hash: "0xdef456ghi789jkl012mno345pqr678stu901vwx234yz567abc",
    status: "success" as const,
    fee: "0.00",
  },
  {
    id: "3",
    type: "sent" as const,
    address: "0x5678901234567890123456789012345678901234",
    amount: "25.50",
    currency: "cNGN" as const,
    timestamp: new Date("2025-11-30T10:15:00"),
    hash: "0xghi789jkl012mno345pqr678stu901vwx234yz567abc890def",
    status: "pending" as const,
    fee: "0.10",
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
      : activeTab === "streams" || activeTab === "circles"
        ? []
        : mockTransactions.filter((tx) => tx.type === activeTab)

  return (
    <div className="bg-background min-h-screen pb-20 md:pb-0">
      <div className="safe-container py-4 md:py-6 lg:py-8">
        {/* Balance Overview Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm mb-4 md:mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="mb-4 md:mb-6">
              <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1 md:mb-2">Total Balance</p>
              <div className="flex items-baseline gap-2 mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">
                  $347.92
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">cUSD</span>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-border">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                    cUSD Balance
                  </p>
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {formatCurrency("347.92", "cUSD")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                    cNGN Balance
                  </p>
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {formatCurrency("45000", "cNGN")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
          <Button asChild className="h-11 md:h-12 gap-2 text-sm md:text-base">
            <a href="/wallet/send">
              <Send className="w-4 h-4 md:w-5 md:h-5" />
              <span>Send</span>
            </a>
          </Button>
          <Button variant="secondary" asChild className="h-11 md:h-12 gap-2 text-sm md:text-base">
            <a href="/wallet/receive">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Receive</span>
            </a>
          </Button>
          <Button variant="ghost" asChild className="h-11 md:h-12 gap-2 text-sm md:text-base">
            <a href="/wallet/add-funds">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Add Funds</span>
            </a>
          </Button>
        </div>

        {/* Wallet Address Section */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-lg md:text-xl font-semibold">Wallet Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="bg-muted rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm text-center break-all leading-relaxed">
              {mockAddress}
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Button variant="ghost" onClick={handleCopyAddress} className="gap-2 h-10 md:h-11 text-sm md:text-base">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="ghost" onClick={() => setShowQRModal(true)} className="gap-2 h-10 md:h-11 text-sm md:text-base">
                <QrCode className="w-4 h-4" />
                QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Transaction History</CardTitle>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto p-0.5 md:p-1 bg-muted gap-0.5 md:gap-1">
                <TabsTrigger
                  value="all"
                  className="text-[10px] xs:text-xs sm:text-sm px-1 md:px-2 py-1.5 md:py-2 data-[state=active]:bg-background"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  className="text-[10px] xs:text-xs sm:text-sm px-1 md:px-2 py-1.5 md:py-2 data-[state=active]:bg-background"
                >
                  Sent
                </TabsTrigger>
                <TabsTrigger
                  value="received"
                  className="text-[10px] xs:text-xs sm:text-sm px-1 md:px-2 py-1.5 md:py-2 data-[state=active]:bg-background"
                >
                  Received
                </TabsTrigger>
                <TabsTrigger
                  value="streams"
                  className="text-[10px] xs:text-xs sm:text-sm px-1 md:px-2 py-1.5 md:py-2 data-[state=active]:bg-background"
                >
                  Streams
                </TabsTrigger>
                <TabsTrigger
                  value="circles"
                  className="text-[10px] xs:text-xs sm:text-sm px-1 md:px-2 py-1.5 md:py-2 data-[state=active]:bg-background"
                >
                  Circles
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0 md:p-6">
            <TransactionHistory transactions={filteredTransactions} />
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-destructive/20">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg font-semibold">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            <Button variant="ghost" asChild className="w-full justify-start gap-2 h-10 md:h-11 text-sm md:text-base">
              <a href="/wallet/backup">
                <Download className="w-4 h-4" />
                <span>Backup Wallet</span>
              </a>
            </Button>
            <Button variant="danger-ghost" asChild className="w-full justify-start gap-2 h-10 md:h-11 text-sm md:text-base">
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
        <DialogContent className="w-[95vw] max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Receive Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <QrCode className="w-24 h-24 text-muted-foreground" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Wallet Address</p>
              <p className="font-mono text-xs md:text-sm break-all text-foreground bg-muted p-3 rounded-lg">
                {formatAddress(mockAddress, 6)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
              <Button variant="secondary" onClick={handleCopyAddress} className="flex-1 gap-2 h-10 md:h-11">
                <Copy className="w-4 h-4" />
                Copy Address
              </Button>
              <Button onClick={() => setShowQRModal(false)} className="flex-1 h-10 md:h-11">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
