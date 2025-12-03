"use client"

import { use } from "react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { Plus, Edit, Power, Trash, ArrowLeft, TrendingUp, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/formatting"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const earningsData = [
  { month: "Jan", earnings: 120 },
  { month: "Feb", earnings: 190 },
  { month: "Mar", earnings: 300 },
  { month: "Apr", earnings: 280 },
  { month: "May", earnings: 350 },
  { month: "Jun", earnings: 400 },
  { month: "Jul", earnings: 347 },
]

export default function StreamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const stream = {
    id,
    name: "Salary Stream",
    employer: "Acme Corp",
    rate: "0.45",
    currency: "cUSD" as const,
    balance: "12.34",
    nextPayout: "2025-12-30",
    isActive: true,
    startDate: "2025-12-01",
    totalEarned: "347.89",
    lastPayout: "2025-12-15",
    frequency: "hourly" as const,
  }

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      <div className="safe-container py-6 md:py-8">
        <Link
          href="/streams"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Streams
        </Link>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
            {stream.name}
          </h1>
          <p className="text-base text-muted-foreground leading-[1.5]">{stream.employer}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">Available</p>
              <p className="text-xl md:text-2xl font-bold text-primary">
                {formatCurrency(stream.balance, stream.currency)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">Total Earned</p>
              <p className="text-xl md:text-2xl font-bold text-[#16A34A]">
                {formatCurrency(stream.totalEarned, stream.currency)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">Rate / Hour</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {formatCurrency(stream.rate, stream.currency)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Monthly Potential
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {formatCurrency((Number.parseFloat(stream.rate) * 160).toString(), stream.currency)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Chart */}
        <Card className="mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="text-[24px] leading-[1.4]">Earnings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Stream Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span className="font-semibold text-foreground">Active</span>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Start Date</p>
                <p className="font-semibold text-foreground">{formatDate(new Date(stream.startDate))}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Last Payout</p>
                <p className="font-semibold text-foreground">{formatDate(new Date(stream.lastPayout))}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Next Payout</p>
                <p className="font-semibold text-foreground">{formatDate(new Date(stream.nextPayout))}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Frequency</p>
                <p className="font-semibold text-foreground capitalize">{stream.frequency}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start gap-2 h-11">
                <Link href={`/streams/${stream.id}/withdraw`}>
                  <Plus className="w-4 h-4" />
                  Withdraw Funds
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 h-11">
                <Edit className="w-4 h-4" />
                Edit Stream
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 h-11">
                <Power className="w-4 h-4" />
                Pause Stream
              </Button>
              <Button variant="danger-ghost" className="w-full justify-start gap-2 h-11">
                <Trash className="w-4 h-4" />
                Delete Stream
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
