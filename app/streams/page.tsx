"use client"

import Link from "next/link"
import { Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent } from "@/components/ui/card-custom"
import { StreamCard } from "@/components/features/stream-card"
import { EmptyStreamsIllustration } from "@/components/ui/illustrations"
import { formatCurrency } from "@/lib/formatting"

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
  {
    id: "3",
    name: "Consulting Work",
    employer: "Design Agency",
    rate: "1.25",
    currency: "cUSD" as const,
    balance: "89.91",
    nextPayout: "2025-12-28",
    isActive: false,
  },
]

export default function StreamsPage() {
  const activeStreams = mockStreams.filter((s) => s.isActive)
  const inactiveStreams = mockStreams.filter((s) => !s.isActive)
  const totalEarned = mockStreams.reduce((sum, s) => sum + Number.parseFloat(s.balance), 0)
  const monthlyPotential = activeStreams.reduce(
    (sum, s) => sum + Number.parseFloat(s.rate) * 160,
    0,
  )

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      {/* Header */}
      <div className="safe-container py-6 md:py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
              Salary Streams
            </h1>
            <p className="text-base text-muted-foreground leading-[1.5]">
              {activeStreams.length} active stream{activeStreams.length !== 1 ? "s" : ""} earning for you
            </p>
          </div>
          <Button asChild className="gap-2 h-12 w-full sm:w-auto">
            <Link href="/streams/create">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Stream</span>
              <span className="sm:hidden">New Stream</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="safe-container space-y-6 md:space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Total Earned
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {formatCurrency(totalEarned.toString(), "cUSD")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Active Streams
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary">{activeStreams.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                Monthly Potential
              </p>
              <p className="text-2xl md:text-3xl font-bold text-[#16A34A]">
                {formatCurrency(monthlyPotential.toString(), "cUSD")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Streams */}
        {activeStreams.length > 0 ? (
          <div>
            <h2 className="text-[24px] font-semibold text-foreground leading-[1.4] mb-4 md:mb-6">
              Active Streams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {activeStreams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
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

        {/* Inactive/Paused Streams */}
        {inactiveStreams.length > 0 && (
          <div>
            <h2 className="text-[24px] font-semibold text-foreground leading-[1.4] mb-4 md:mb-6">
              Paused Streams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {inactiveStreams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
