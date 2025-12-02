"use client"

import { TrendingUp, Plus, ArrowRightCircle, Zap, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent } from "@/components/ui/card-custom"
import { StreamCard } from "@/components/features/stream-card"
import { CircleCard } from "@/components/features/circle-card"
import { RecentActivityList } from "@/components/features/recent-activity-list"
import { EmptyStreamsIllustration, EmptyCirclesIllustration } from "@/components/ui/illustrations"

// Mock data - will be replaced with actual API calls
const mockStreams = [
  {
    id: "1",
    name: "Salary Stream",
    employer: "Acme Corp",
    rate: "0.45",
    currency: "cUSD" as const,
    balance: "12.34",
    nextPayout: "2025-12-30",
    isActive: true,
  },
  {
    id: "2",
    name: "Freelance Project",
    employer: "Tech Startup",
    rate: "0.75",
    currency: "cUSD" as const,
    balance: "45.67",
    nextPayout: "2025-12-25",
    isActive: true,
  },
]

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
]

// Use fixed dates to prevent hydration errors
const mockActivity = [
  {
    id: "1",
    type: "withdrawal",
    amount: "25.00",
    currency: "cUSD" as const,
    description: "Withdrawal to wallet",
    status: "success" as const,
    timestamp: new Date("2025-12-02T09:30:00"),
  },
  {
    id: "2",
    type: "circle-contribution",
    amount: "50.00",
    currency: "cUSD" as const,
    description: "Contribution to Family Ajo",
    status: "success" as const,
    timestamp: new Date("2025-12-01T14:20:00"),
  },
  {
    id: "3",
    type: "stream-earned",
    amount: "45.67",
    currency: "cUSD" as const,
    description: "Earned from Freelance Project",
    status: "success" as const,
    timestamp: new Date("2025-11-30T10:15:00"),
  },
]

export default function DashboardPage() {
  const totalBalance = "347.92"

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="safe-container py-6 md:py-8 lg:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
            Welcome back
          </h1>
          <p className="text-base text-muted-foreground leading-[1.5]">
            Manage your crypto earnings with ease
          </p>
        </div>

        {/* Total Balance Card */}
        <Card className="mb-6 md:mb-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm">
          <CardContent className="pt-6 md:pt-8 pb-6 md:pb-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">Total Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-primary leading-[1.4]">
                    ₵{totalBalance}
                  </span>
                  <span className="text-sm text-muted-foreground">cUSD</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[#16A34A] text-sm font-semibold mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.4%</span>
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 md:mb-12">
          <Button asChild className="gap-2 h-12 w-full">
            <Link href="/streams/create">
              <Plus className="w-5 h-5" />
              <span>Create Stream</span>
            </Link>
          </Button>
          <Button variant="secondary" asChild className="gap-2 h-12 w-full">
            <Link href="/circles/create">
              <Plus className="w-5 h-5" />
              <span>Join Circle</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="gap-2 h-12 w-full">
            <Link href="/wallet">
              <ArrowRightCircle className="w-5 h-5" />
              <span>Add Funds</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Active Streams Section */}
      <div className="safe-container mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-[24px] font-semibold text-foreground leading-[1.4] mb-1">
              Active Salary Streams
            </h2>
            <p className="text-sm text-muted-foreground">
              {mockStreams.length} active stream{mockStreams.length !== 1 ? "s" : ""} earning for you
            </p>
          </div>
          <Button variant="ghost" asChild className="gap-1">
            <Link href="/streams">View All</Link>
          </Button>
        </div>

        {mockStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {mockStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
                ) : (
                  <Card className="text-center py-12 md:py-16">
                    <CardContent>
                      <div className="w-48 h-40 mx-auto mb-6 flex items-center justify-center">
                        <EmptyStreamsIllustration className="w-full h-full" animated={true} />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                        No active streams
                      </h3>
                      <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                        Create your first salary stream to start earning
                      </p>
                      <Button asChild>
                        <Link href="/streams/create">Create Stream</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
      </div>

      {/* Savings Circles Section */}
      <div className="safe-container mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-[24px] font-semibold text-foreground leading-[1.4] mb-1">
              My Savings Circles
            </h2>
            <p className="text-sm text-muted-foreground">
              {mockCircles.length} circle{mockCircles.length !== 1 ? "s" : ""} saving together
            </p>
          </div>
          <Button variant="ghost" asChild className="gap-1">
            <Link href="/circles">View All</Link>
          </Button>
        </div>

        {mockCircles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {mockCircles.map((circle) => (
              <CircleCard key={circle.id} circle={circle} />
            ))}
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
                        Join or create a savings circle to start saving with others
                      </p>
                      <Button asChild>
                        <Link href="/circles/create">Create Circle</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
      </div>

      {/* Recent Activity Section */}
      <div className="safe-container mb-12 md:mb-16 pb-8">
        <h2 className="text-[24px] font-semibold text-foreground leading-[1.4] mb-4 md:mb-6">
          Recent Activity
        </h2>
        <RecentActivityList activities={mockActivity} />
      </div>
    </div>
  )
}

