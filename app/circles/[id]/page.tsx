"use client"

import { use, useState } from "react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { ArrowLeft, Users, TrendingUp, Plus, CheckCircle2, Clock, Calendar, Copy, ExternalLink, Send } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency, formatAddress } from "@/lib/formatting"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input-custom"
import { useToast } from "@/hooks/use-toast"

export default function CircleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [inviteAddress, setInviteAddress] = useState("")
  const [copied, setCopied] = useState(false)

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

  // Mock history data
  const historyData = [
    {
      id: "1",
      type: "contribution" as const,
      member: "0x1234...5678",
      amount: "50.00",
      currency: "cUSD" as const,
      date: "2025-12-01",
      status: "completed" as const,
      txHash: "0xabc123...",
    },
    {
      id: "2",
      type: "contribution" as const,
      member: "0x9876...5432",
      amount: "50.00",
      currency: "cUSD" as const,
      date: "2025-11-15",
      status: "completed" as const,
      txHash: "0xdef456...",
    },
    {
      id: "3",
      type: "payout" as const,
      member: "0xabcd...ef01",
      amount: "250.00",
      currency: "cUSD" as const,
      date: "2025-11-01",
      status: "completed" as const,
      txHash: "0xghi789...",
    },
    {
      id: "4",
      type: "contribution" as const,
      member: "0x5678...9012",
      amount: "50.00",
      currency: "cUSD" as const,
      date: "2025-10-15",
      status: "completed" as const,
      txHash: "0xjkl012...",
    },
  ]

  const handleInviteMember = () => {
    if (!inviteAddress || !inviteAddress.startsWith("0x") || inviteAddress.length !== 42) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid wallet address (0x followed by 40 characters)",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call a smart contract or API
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${formatAddress(inviteAddress, 4)}`,
    })
    setInviteAddress("")
    setShowInviteDialog(false)
  }

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const isValidAddress = (address: string) => {
    return address.startsWith("0x") && address.length === 42
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
              <Button
                variant="secondary"
                className="w-full justify-start gap-2 h-11"
                onClick={() => setShowInviteDialog(true)}
              >
                <Users className="w-4 h-4" />
                Invite Member
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-11"
                onClick={() => setShowHistoryDialog(true)}
              >
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

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[24px] leading-[1.4]">Invite Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join this savings circle. They will receive an invitation notification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-2">Circle Information</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Circle: {circle.name}</p>
                <p>Type: {circle.type === "ajo" ? "Rotating Savings (Ajo)" : "Fixed Monthly (Esusu)"}</p>
                <p>Monthly Contribution: {formatCurrency(circle.nextAmount, circle.currency)}</p>
              </div>
            </div>

            <div>
              <Input
                label="Wallet Address"
                placeholder="0x..."
                value={inviteAddress}
                onChange={(e) => setInviteAddress(e.target.value)}
                error={
                  inviteAddress && !isValidAddress(inviteAddress)
                    ? "Invalid wallet address format"
                    : undefined
                }
                helperText="Enter the wallet address of the member you want to invite"
              />
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">What happens next?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The member will receive an invitation notification</li>
                    <li>They can accept or decline the invitation</li>
                    <li>Once accepted, they can start contributing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowInviteDialog(false)} className="flex-1 h-11">
                Cancel
              </Button>
              <Button
                onClick={handleInviteMember}
                disabled={!inviteAddress || !isValidAddress(inviteAddress)}
                className="flex-1 h-11 gap-2"
              >
                <Send className="w-4 h-4" />
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[24px] leading-[1.4]">Circle History</DialogTitle>
            <DialogDescription>
              View all transactions and contributions for this savings circle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Circle Name</p>
                  <p className="font-semibold text-foreground">{circle.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Transactions</p>
                  <p className="font-semibold text-foreground">{historyData.length}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {historyData.map((item) => (
                <Card key={item.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {item.type === "contribution" ? (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Plus className="w-4 h-4 text-primary" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-accent" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-foreground capitalize">{item.type}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {formatAddress(item.member, 6)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground ml-10">
                          <span>{formatDate(new Date(item.date))}</span>
                          <span className="font-mono text-xs">{formatAddress(item.txHash, 8)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {item.type === "contribution" ? "+" : "-"}
                          {formatCurrency(item.amount, item.currency)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyAddress(item.txHash)}
                            title="Copy transaction hash"
                          >
                            {copied ? (
                              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                            title="View on explorer"
                          >
                            <a
                              href={`https://explorer.celo.org/mainnet/tx/${item.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <Button variant="secondary" onClick={() => setShowHistoryDialog(false)} className="h-11">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
