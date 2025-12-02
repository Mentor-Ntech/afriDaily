"use client"

import Link from "next/link"
import { Plus, Users, TrendingUp, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent } from "@/components/ui/card-custom"
import { CircleCard } from "@/components/features/circle-card"
import { EmptyCirclesIllustration } from "@/components/ui/illustrations"
import { formatCurrency } from "@/lib/formatting"

const mockCircles = [
  {
    id: "1",
    name: "Family Ajo Circle",
    type: "ajo" as const,
    totalSaved: "240.00",
    members: 5,
    nextContribution: "2025-12-15",
    nextAmount: "50.00",
    progress: 60,
    currency: "cUSD" as const,
  },
  {
    id: "2",
    name: "Work Esusu Group",
    type: "esusu" as const,
    totalSaved: "500.00",
    members: 8,
    nextContribution: "2025-12-20",
    nextAmount: "75.00",
    progress: 45,
    currency: "cUSD" as const,
  },
  {
    id: "3",
    name: "Investment Circle",
    type: "ajo" as const,
    totalSaved: "1200.00",
    members: 12,
    nextContribution: "2025-12-25",
    nextAmount: "100.00",
    progress: 80,
    currency: "cUSD" as const,
  },
]

export default function CirclesPage() {
  const totalInvested = mockCircles.reduce((sum, c) => sum + Number.parseFloat(c.totalSaved), 0)
  const totalMembers = mockCircles.reduce((sum, c) => sum + c.members, 0)

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      {/* Header */}
      <div className="safe-container py-6 md:py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
              Savings Circles
            </h1>
            <p className="text-base text-muted-foreground leading-[1.5]">
              {mockCircles.length} circle{mockCircles.length !== 1 ? "s" : ""} saving together
            </p>
          </div>
          <Button asChild className="gap-2 h-12 w-full sm:w-auto">
            <Link href="/circles/create">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Circle</span>
              <span className="sm:hidden">New Circle</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="safe-container space-y-6 md:space-y-8">
        {/* Info Section - Cultural Context */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
            About Savings Circles
          </h2>
          <p className="text-base text-muted-foreground mb-4 md:mb-6 leading-[1.5]">
            Savings circles are traditional rotating (Ajo) or fixed order (Esusu) savings groups that
            help you save money with community members while building trust and supporting each other's
            financial goals. All transactions are recorded on the blockchain for transparency and
            security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Ajo (Rotating Savings)</p>
                <p className="text-sm text-muted-foreground leading-[1.4]">
                  Members take turns receiving the full pool amount
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Esusu (Fixed Order)</p>
                <p className="text-sm text-muted-foreground leading-[1.4]">
                  Fixed monthly disbursement to each member in order
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Transparent & Secure</p>
                <p className="text-sm text-muted-foreground leading-[1.4]">
                  All transactions recorded on blockchain with smart contract enforcement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Trust & Community</p>
                <p className="text-sm text-muted-foreground leading-[1.4]">
                  Build financial relationships while achieving your savings goals together
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Total Members
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary">{totalMembers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-[#16A34A]/10">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-[#16A34A]" />
                </div>
              </div>
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Total Saved
              </p>
              <p className="text-2xl md:text-3xl font-bold text-[#16A34A]">
                {formatCurrency(totalInvested.toString(), "cUSD")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Plus className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
              </div>
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Active Circles
              </p>
              <p className="text-2xl md:text-3xl font-bold text-accent">{mockCircles.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Circles Grid */}
        {mockCircles.length > 0 ? (
          <div>
            <h2 className="text-[24px] font-semibold text-foreground leading-[1.4] mb-4 md:mb-6">
              My Savings Circles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {mockCircles.map((circle) => (
                <CircleCard key={circle.id} circle={circle} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="text-center py-12 md:py-16">
            <CardContent>
              <div className="w-48 h-40 mx-auto mb-6 flex items-center justify-center">
                <EmptyCirclesIllustration className="w-full h-full" animated={true} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                No savings circles yet
              </h3>
              <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                Create or join a savings circle to start saving with others
              </p>
              <Button asChild>
                <Link href="/circles/create">Create Circle</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
