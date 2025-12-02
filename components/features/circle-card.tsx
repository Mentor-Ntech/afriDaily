"use client"

import Link from "next/link"
import { Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent } from "@/components/ui/card-custom"
import { formatCurrency, formatDate } from "@/lib/formatting"

interface Circle {
  id: string
  name: string
  type: "ajo" | "esusu"
  totalSaved: string
  members: number
  nextContribution: string
  nextAmount: string
  progress: number
}

interface CircleCardProps {
  circle: Circle
}

export function CircleCard({ circle }: CircleCardProps) {
  const typeLabel = circle.type === "ajo" ? "Rotating Savings" : "Fixed Order Savings"

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{circle.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                {typeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Total Saved */}
        <div className="mb-4 pb-4 border-b border-border">
          <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(circle.totalSaved, "cUSD")}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Progress</span>
            <span className="text-xs font-semibold text-foreground">{circle.progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${circle.progress}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs font-medium">Members</span>
            </div>
            <p className="font-semibold text-foreground">{circle.members}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs font-medium">Next Due</span>
            </div>
            <p className="font-semibold text-foreground text-sm">{formatDate(new Date(circle.nextContribution))}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" asChild className="flex-1">
            <Link href={`/circles/${circle.id}`}>
              Details
            </Link>
          </Button>
          <Button size="sm" asChild className="flex-1">
            <Link href={`/circles/${circle.id}/contribute`}>
              Contribute
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
