"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, Users, TrendingUp, CheckCircle2, Clock } from "lucide-react"
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
      <Card className="text-center py-8 md:py-12">
        <CardContent>
          <div className="w-32 h-28 md:w-48 md:h-40 mx-auto mb-4 md:mb-6 flex items-center justify-center">
            <TransactionIllustration className="w-full h-full" animated={true} />
          </div>
          <p className="text-sm md:text-base text-muted-foreground">No activity yet</p>
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
              <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
            ) : activity.type === "stream-earned" ? (
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            ) : activity.type === "circle-contribution" ? (
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ArrowDown className="w-4 h-4 md:w-5 md:h-5" />
            )

          return (
            <div
              key={activity.id}
              onClick={() => handleTransactionClick(activity)}
              className="flex items-center justify-between py-3 md:py-4 px-3 md:px-4 hover:bg-muted/30 active:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`p-2.5 md:p-3 rounded-full flex-shrink-0 ${
                    isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base text-foreground mb-0.5 md:mb-1 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3 md:ml-4">
                <p
                  className={`font-bold text-sm md:text-base mb-0.5 md:mb-1 ${
                    isPositive ? "text-success" : "text-foreground"
                  }`}
                >
                  {isPositive ? "+" : "-"}
                  {formatCurrency(activity.amount, activity.currency)}
                </p>
                <div className="flex items-center justify-end gap-1">
                  {activity.status === "success" && (
                    <>
                      <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#16A34A] flex-shrink-0" />
                      <span className="text-xs font-semibold text-[#16A34A]">Success</span>
                    </>
                  )}
                  {activity.status === "pending" && (
                    <>
                      <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent flex-shrink-0" />
                      <span className="text-xs font-semibold text-accent">Pending</span>
                    </>
                  )}
                  {activity.status === "failed" && (
                    <span className="text-xs font-semibold text-destructive">Failed</span>
                  )}
                </div>
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
