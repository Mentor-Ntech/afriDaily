"use client"

import { use } from "react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { ArrowLeft, Users, TrendingUp, Plus, CheckCircle2, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency, formatAddress } from "@/lib/formatting"
import { Progress } from "@/components/ui/progress"

export default function CircleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const circle = {
    id,
    name: "Family Ajo Circle",
    type: "ajo" as const,
    totalSaved: "240.00",
    members: 5,
    nextContribution: "2025-12-15",
    nextAmount: "50.00",
    progress: 60,
    createdDate: "2025-06-01",
    totalCycles: 12,
    currentCycle: 7,
    currency: "cUSD" as const,
    memberDetails: [
      { address: "0x1234567890123456789012345678901234567890", status: "paid" as const, paidDate: "2025-12-01" },
      { address: "0x9876543210987654321098765432109876543210", status: "paid" as const, paidDate: "2025-12-02" },
      { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", status: "pending" as const, paidDate: null },
      { address: "0x5678901234567890123456789012345678901234", status: "paid" as const, paidDate: "2025-12-03" },
      { address: "0xefghijklmnopqrstuvwxyzabcdefghijklmnop", status: "paid" as const, paidDate: "2025-12-01" },
    ],
  }

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      <div className="safe-container py-6 md:py-8">
        <Link
          href="/circles"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Circles
        </Link>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
                {circle.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wide font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {circle.type === "ajo" ? "Rotating Savings" : "Fixed Monthly"}
                </span>
                <span className="text-sm text-muted-foreground">
                  Cycle {circle.currentCycle} of {circle.totalCycles}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">Total Saved</p>
              <p className="text-xl md:text-2xl font-bold text-primary">
                {formatCurrency(circle.totalSaved, circle.currency)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">Members</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{circle.members}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">Progress</p>
              <p className="text-xl md:text-2xl font-bold text-[#16A34A]">{circle.progress}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Next Contribution
              </p>
              <p className="text-lg md:text-xl font-bold text-foreground">
                {formatDate(new Date(circle.nextContribution))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Progress Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Circle Progress</span>
                  <span className="text-sm font-bold text-primary">{circle.progress}%</span>
                </div>
                <Progress value={circle.progress} className="h-3" />
              </div>

              <div className="bg-muted rounded-lg p-4 md:p-6">
                <p className="text-sm font-semibold text-foreground mb-3">Current Cycle Details</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {formatDate(new Date(circle.createdDate))}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      Current Cycle: {circle.currentCycle} / {circle.totalCycles}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Monthly Contribution: {formatCurrency(circle.nextAmount, circle.currency)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start gap-2 h-11">
                <Link href={`/circles/${circle.id}/contribute`}>
                  <Plus className="w-4 h-4" />
                  Make Contribution
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 h-11">
                <Users className="w-4 h-4" />
                Invite Member
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 h-11">
                <TrendingUp className="w-4 h-4" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[24px] leading-[1.4]">Member Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {circle.memberDetails.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <p className="font-mono text-sm text-foreground">{formatAddress(member.address, 6)}</p>
                  </div>
                  <div className="text-right">
                    {member.status === "paid" ? (
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                        {member.paidDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(new Date(member.paidDate))}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
