"use client"

import Link from "next/link"
import { Clock, Eye, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent } from "@/components/ui/card-custom"
import { formatCurrency, formatDate } from "@/lib/formatting"

interface Stream {
  id: string
  name: string
  employer: string
  rate: string
  currency: "cUSD" | "cNGN"
  balance: string
  nextPayout: string
  isActive: boolean
}

interface StreamCardProps {
  stream: Stream
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-1">Salary Stream — {stream.employer}</h3>
          <p className="text-sm text-muted-foreground">Rate: {formatCurrency(stream.rate, stream.currency)} / hr</p>
        </div>

        {/* Balance */}
        <div className="mb-6 pb-6 border-b border-border">
          <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Available</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(stream.balance, stream.currency)}</p>
        </div>

        {/* Metadata */}
        <div className="mb-6 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Next payout • {formatDate(new Date(stream.nextPayout))}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" asChild className="flex-1 gap-2">
            <Link href={`/streams/${stream.id}`}>
              <Eye className="w-4 h-4" />
              Details
            </Link>
          </Button>
          <Button size="sm" asChild className="flex-1 gap-2">
            <Link href={`/streams/${stream.id}/withdraw`}>
              <Wallet className="w-4 h-4" />
              Withdraw
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
