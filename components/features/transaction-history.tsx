"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, ExternalLink, CheckCircle2, Clock } from "lucide-react"
import { formatDateTime, formatCurrency, formatAddress } from "@/lib/formatting"
import { TransactionIllustration } from "@/components/ui/illustrations"
import { TransactionDetailsDialog } from "./transaction-details-dialog"

interface Transaction {
  id: string
  type: "sent" | "received"
  address: string
  amount: string
  currency: "cUSD" | "cNGN"
  timestamp: Date
  hash: string
  status: "success" | "pending" | "failed"
  fee?: string
}

interface TransactionHistoryProps {
  transactions?: Transaction[]
}

export function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="w-32 h-28 md:w-48 md:h-40 mx-auto mb-4 md:mb-6 flex items-center justify-center">
          <TransactionIllustration className="w-full h-full" animated={true} />
        </div>
        <p className="text-sm md:text-base text-muted-foreground">No transactions yet</p>
      </div>
    )
  }

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="divide-y divide-border">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => handleTransactionClick(tx)}
            className="flex items-center justify-between py-3 md:py-4 px-3 md:px-4 hover:bg-muted/30 active:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`p-2.5 md:p-3 rounded-full flex-shrink-0 ${
                  tx.type === "sent" ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"
                }`}
              >
                {tx.type === "sent" ? (
                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <ArrowDown className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base text-foreground mb-0.5 md:mb-1">
                  {tx.type === "sent" ? "Sent to" : "Received from"} {formatAddress(tx.address, 4)}
                </p>
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                  {formatDateTime(tx.timestamp)}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-3 md:ml-4">
              <p
                className={`font-bold text-sm md:text-base mb-0.5 md:mb-1 ${
                  tx.type === "sent" ? "text-destructive" : "text-foreground"
                }`}
              >
                {tx.type === "sent" ? "-" : "+"}
                {formatCurrency(tx.amount, tx.currency)}
              </p>
              <div className="flex items-center justify-end gap-1">
                {tx.status === "success" && (
                  <>
                    <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#16A34A] flex-shrink-0" />
                    <span className="text-xs font-semibold text-[#16A34A]">Success</span>
                  </>
                )}
                {tx.status === "pending" && (
                  <>
                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent flex-shrink-0" />
                    <span className="text-xs font-semibold text-accent">Pending</span>
                  </>
                )}
                {tx.status === "failed" && (
                  <span className="text-xs font-semibold text-destructive">Failed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <TransactionDetailsDialog
        transaction={
          selectedTransaction
            ? {
                id: selectedTransaction.id,
                type: selectedTransaction.type,
                amount: selectedTransaction.amount,
                currency: selectedTransaction.currency,
                address: selectedTransaction.address,
                hash: selectedTransaction.hash,
                status: selectedTransaction.status,
                timestamp: selectedTransaction.timestamp,
                fee: selectedTransaction.fee,
                network: "Celo Mainnet",
              }
            : null
        }
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
