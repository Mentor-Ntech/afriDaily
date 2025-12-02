"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button-custom"
import { Copy, CheckCircle2, ExternalLink, Clock, XCircle, ArrowUp, ArrowDown, Users, TrendingUp } from "lucide-react"
import { formatDateTime, formatCurrency, formatAddress } from "@/lib/formatting"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface TransactionDetails {
  id: string
  type: "sent" | "received" | "withdrawal" | "stream-earned" | "circle-contribution" | "circle-payout"
  amount: string
  currency: "cUSD" | "cNGN"
  description?: string
  address?: string
  hash: string
  status: "success" | "pending" | "failed"
  timestamp: Date
  fee?: string
  network?: string
}

interface TransactionDetailsDialogProps {
  transaction: TransactionDetails | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailsDialog({ transaction, open, onOpenChange }: TransactionDetailsDialogProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  if (!transaction) return null

  const isPositive = transaction.type === "received" || transaction.type === "stream-earned" || transaction.type === "circle-payout"
  const isNegative = transaction.type === "sent" || transaction.type === "withdrawal" || transaction.type === "circle-contribution"

  const getTypeIcon = () => {
    switch (transaction.type) {
      case "sent":
      case "withdrawal":
        return <ArrowUp className="w-5 h-5" />
      case "received":
      case "circle-payout":
        return <ArrowDown className="w-5 h-5" />
      case "stream-earned":
        return <TrendingUp className="w-5 h-5" />
      case "circle-contribution":
        return <Users className="w-5 h-5" />
      default:
        return <ArrowUp className="w-5 h-5" />
    }
  }

  const getTypeLabel = () => {
    switch (transaction.type) {
      case "sent":
        return "Sent"
      case "received":
        return "Received"
      case "withdrawal":
        return "Withdrawal"
      case "stream-earned":
        return "Stream Earnings"
      case "circle-contribution":
        return "Circle Contribution"
      case "circle-payout":
        return "Circle Payout"
      default:
        return "Transaction"
    }
  }

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto mx-4 md:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-[24px] leading-[1.4]">Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6 py-2 md:py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                transaction.status === "success"
                  ? "bg-success/10 text-success"
                  : transaction.status === "pending"
                    ? "bg-accent/10 text-accent"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              {transaction.status === "success" ? (
                <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8" />
              ) : transaction.status === "pending" ? (
                <Clock className="w-7 h-7 md:w-8 md:h-8" />
              ) : (
                <XCircle className="w-7 h-7 md:w-8 md:h-8" />
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">Amount</p>
            <p
              className={`text-2xl md:text-3xl lg:text-4xl font-bold ${
                isPositive ? "text-success" : isNegative ? "text-destructive" : "text-foreground"
              }`}
            >
              {isPositive ? "+" : isNegative ? "-" : ""}
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">{getTypeLabel()}</p>
          </div>

          {/* Transaction Info */}
          <div className="bg-muted rounded-lg p-3 md:p-4 space-y-3 md:space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Status</p>
              <div className="flex items-center gap-2">
                {transaction.status === "success" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="font-semibold text-success text-sm md:text-base">Success</span>
                  </>
                ) : transaction.status === "pending" ? (
                  <>
                    <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="font-semibold text-accent text-sm md:text-base">Pending</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <span className="font-semibold text-destructive text-sm md:text-base">Failed</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Date & Time</p>
              <p className="font-semibold text-foreground text-sm md:text-base break-words">{formatDateTime(transaction.timestamp)}</p>
            </div>

            {transaction.description && (
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Description</p>
                <p className="font-semibold text-foreground text-sm md:text-base break-words">{transaction.description}</p>
              </div>
            )}

            {transaction.address && (
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                  {transaction.type === "sent" || transaction.type === "withdrawal" ? "To Address" : "From Address"}
                </p>
                <div className="flex items-start gap-2">
                  <p className="font-mono text-xs md:text-sm text-foreground break-all flex-1">{transaction.address}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0 touch-target"
                    onClick={() => handleCopy(transaction.address!, "Address")}
                    title="Copy address"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                Transaction Hash
              </p>
              <div className="flex items-start gap-2">
                <p className="font-mono text-xs md:text-sm text-foreground break-all flex-1">{transaction.hash}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0 touch-target"
                  onClick={() => handleCopy(transaction.hash, "Transaction hash")}
                  title="Copy transaction hash"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {transaction.fee && (
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Network Fee</p>
                <p className="font-semibold text-foreground text-sm md:text-base">{formatCurrency(transaction.fee, transaction.currency)}</p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Network</p>
              <p className="font-semibold text-foreground text-sm md:text-base">{transaction.network || "Celo Mainnet"}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Button
              variant="secondary"
              onClick={() => handleCopy(transaction.hash, "Transaction hash")}
              className="flex-1 gap-2 h-11 text-sm md:text-base"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy Hash</span>
              <span className="sm:hidden">Copy</span>
            </Button>
            <Button
              variant="secondary"
              asChild
              className="flex-1 gap-2 h-11 text-sm md:text-base"
            >
              <a
                href={`https://explorer.celo.org/mainnet/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View Explorer</span>
                <span className="sm:hidden">Explorer</span>
              </a>
            </Button>
          </div>

          <Button onClick={() => onOpenChange(false)} className="w-full h-11 text-sm md:text-base">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

