"use client"

import { use } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { AmountInput } from "@/components/ui/amount-input"
import { ArrowLeft, CheckCircle2, Clock, Wallet } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/formatting"

export default function ContributeToCirclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [step, setStep] = useState<"form" | "review" | "confirm">("form")
  const [amount, setAmount] = useState("50.00")
  const [currency] = useState<"cUSD" | "cNGN">("cUSD")

  const circle = {
    name: "Family Ajo Circle",
    dueDate: "2025-12-15",
    requiredAmount: "50.00",
    type: "ajo" as const,
  }

  const handleReview = () => {
    if (Number.parseFloat(amount) > 0) {
      setStep("review")
    }
  }

  const handleConfirm = () => {
    // In real app, this would trigger the blockchain transaction
    setStep("confirm")
  }

  const totalAmount = Number.parseFloat(amount || "0") + 0.1 // Network fee

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      <div className="safe-container py-6 md:py-8">
        <Link
          href={`/circles/${id}`}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Circle
        </Link>

        <Card className="max-w-md mx-auto">
          {step === "form" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Make Contribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4 md:p-6">
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Circle</p>
                  <p className="font-semibold text-foreground mb-4 text-lg">{circle.name}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due Date
                      </p>
                      <p className="font-semibold text-foreground">{formatDate(new Date(circle.dueDate))}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Required Amount</p>
                      <p className="font-semibold text-foreground">{formatCurrency(circle.requiredAmount, currency)}</p>
                    </div>
                  </div>
                </div>

                <AmountInput
                  currency={currency}
                  label="Contribution Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/,/g, ""))}
                  helperText="You can contribute more than the required amount"
                />

                <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Contribution:</span>
                    <span className="font-semibold text-foreground">{formatCurrency(amount, currency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Network fee:</span>
                    <span className="font-semibold text-foreground">{formatCurrency("0.10", currency)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total:</span>
                    <span className="font-bold text-primary text-lg">
                      {formatCurrency(totalAmount.toFixed(2), currency)}
                    </span>
                  </div>
                </div>

                <Button onClick={handleReview} className="w-full h-12" disabled={Number.parseFloat(amount) <= 0}>
                  Review Contribution
                </Button>
              </CardContent>
            </>
          )}

          {step === "review" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Confirm Contribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4 md:p-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Amount</p>
                    <p className="text-3xl md:text-4xl font-bold text-primary">
                      {formatCurrency(amount, currency)}
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Circle</p>
                    <p className="font-semibold text-foreground text-lg">{circle.name}</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                      Transaction Details
                    </p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Network: Celo Mainnet</p>
                      <p>Fee: {formatCurrency("0.10", currency)}</p>
                      <p>Total: {formatCurrency(totalAmount.toFixed(2), currency)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("form")} className="flex-1 h-12">
                    Back
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1 h-12">
                    Confirm & Pay
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === "confirm" && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#16A34A]" />
                </div>
                <CardTitle className="text-[24px] leading-[1.4]">Contribution Successful</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-base text-muted-foreground mb-4 leading-[1.5]">
                    Your contribution of {formatCurrency(amount, currency)} has been submitted to the circle.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 font-mono bg-muted p-3 rounded-lg">
                    Transaction: 0xabc123def456...
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button asChild className="w-full h-12">
                      <Link href={`/circles/${id}`}>Back to Circle</Link>
                    </Button>
                    <Button variant="secondary" asChild className="w-full h-12">
                      <Link href="/circles">View All Circles</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
