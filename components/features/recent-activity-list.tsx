"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card-custom"
import { formatCurrency, formatDateTime } from "@/lib/formatting"
import { TransactionIllustration } from "@/components/ui/illustrations"
import { TransactionDetailsDialog } from "./transaction-details-dialog"

interface Activity {
  id: string
  type: "withdrawal" | "stream-earned" | "circle-contribution" | "circle-payout"
  amount: string
  currency: "cUSD" | "cNGN"
  description: string
  status: "success" | "pending" | "failed"
  timestamp: Date
  hash?: string
  address?: string
  fee?: string
}

interface RecentActivityListProps {
  activities?: Activity[]
}

export function RecentActivityList({ activities = [] }: RecentActivityListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Activity | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (activities.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="w-48 h-40 mx-auto mb-6 flex items-center justify-center">
            <TransactionIllustration className="w-full h-full" animated={true} />
          </div>
          <p className="text-muted-foreground text-base">No activity yet</p>
        </CardContent>
      </Card>
    )
  }

  const handleTransactionClick = (activity: Activity) => {
    setSelectedTransaction(activity)
    setDialogOpen(true)
  }

  return (
    <>
      <Card>
        <div className="divide-y divide-border">
          {activities.map((activity) => {
          const isPositive = activity.type === "stream-earned" || activity.type === "circle-payout"
          const icon =
            activity.type === "withdrawal" ? (
              <ArrowUp className="w-5 h-5" />
            ) : activity.type === "stream-earned" ? (
              <TrendingUp className="w-5 h-5" />
            ) : activity.type === "circle-contribution" ? (
              <Users className="w-5 h-5" />
            ) : (
              <ArrowDown className="w-5 h-5" />
            )

          return (
            <div
              key={activity.id}
              onClick={() => handleTransactionClick(activity)}
              className="flex items-center justify-between p-3 md:p-4 hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer touch-target min-h-[60px]"
            >
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div
                  className={`p-2 md:p-3 rounded-full flex-shrink-0 ${
                    isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm md:text-base truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2 md:ml-4">
                <p className={`font-bold text-sm md:text-base ${isPositive ? "text-success" : "text-foreground"}`}>
                  {isPositive ? "+" : "-"}
                  {formatCurrency(activity.amount, activity.currency)}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    activity.status === "success"
                      ? "text-success"
                      : activity.status === "pending"
                        ? "text-accent"
                        : "text-destructive"
                  }`}
                >
                  {activity.status === "success" && "✓ Success"}
                  {activity.status === "pending" && "Pending"}
                  {activity.status === "failed" && "Failed"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>

    <TransactionDetailsDialog
      transaction={
        selectedTransaction
          ? {
              id: selectedTransaction.id,
              type: selectedTransaction.type,
              amount: selectedTransaction.amount,
              currency: selectedTransaction.currency,
              description: selectedTransaction.description,
              address: selectedTransaction.address,
              hash: selectedTransaction.hash || `0x${selectedTransaction.id}`,
              status: selectedTransaction.status,
              timestamp: selectedTransaction.timestamp,
              fee: selectedTransaction.fee,
            }
          : null
      }
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    />
    </>
  )
}
