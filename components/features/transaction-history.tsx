"use client"

import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { formatDateTime, formatCurrency } from "@/lib/formatting"
import { TransactionIllustration } from "@/components/ui/illustrations"

interface Transaction {
  id: string
  type: "sent" | "received"
  address: string
  amount: string
  currency: "cUSD" | "cNGN"
  timestamp: Date
  hash: string
  status: "success" | "pending" | "failed"
}

interface TransactionHistoryProps {
  transactions?: Transaction[]
}

export function TransactionHistory({ transactions = [] }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-48 h-40 mx-auto mb-6 flex items-center justify-center">
          <TransactionIllustration className="w-full h-full" animated={true} />
        </div>
        <p className="text-muted-foreground text-base">No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between py-4 hover:bg-muted/30 px-2 transition-colors rounded group"
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`p-3 rounded-full ${
                tx.type === "sent" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
              }`}
            >
              {tx.type === "sent" ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">
                  {tx.type === "sent" ? "Sent to" : "Received from"} {tx.address}
                </p>
                <a
                  href={`https://explorer.celo.org/mainnet/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="View on explorer"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                {formatDateTime(tx.timestamp)}
              </p>
            </div>
          </div>

          <div className="text-right ml-4">
            <p className={`font-bold ${tx.type === "sent" ? "text-destructive" : "text-success"}`}>
              {tx.type === "sent" ? "-" : "+"}
              {formatCurrency(tx.amount, tx.currency)}
            </p>
            <p
              className={`text-xs font-semibold ${
                tx.status === "success" ? "text-success" : tx.status === "pending" ? "text-accent" : "text-destructive"
              }`}
            >
              {tx.status === "success" && "✓ Success"}
              {tx.status === "pending" && "◌ Pending"}
              {tx.status === "failed" && "✗ Failed"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
