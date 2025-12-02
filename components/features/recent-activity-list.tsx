"use client"

import { ArrowUp, ArrowDown, Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card-custom"
import { formatCurrency, formatDateTime } from "@/lib/formatting"
import { TransactionIllustration } from "@/components/ui/illustrations"

interface Activity {
  id: string
  type: "withdrawal" | "stream-earned" | "circle-contribution" | "circle-payout"
  amount: string
  currency: "cUSD" | "cNGN"
  description: string
  status: "success" | "pending" | "failed"
  timestamp: Date
}

interface RecentActivityListProps {
  activities?: Activity[]
}

export function RecentActivityList({ activities = [] }: RecentActivityListProps) {
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

  return (
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
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-3 rounded-full ${
                    isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${isPositive ? "text-success" : "text-foreground"}`}>
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
  )
}
