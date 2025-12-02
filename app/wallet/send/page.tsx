"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button-custom"
import { Input } from "@/components/ui/input-custom"
import { AmountInput } from "@/components/ui/amount-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { ArrowLeft, ArrowUp } from "lucide-react"
import Link from "next/link"

export default function SendPage() {
  const [step, setStep] = useState<"form" | "review" | "confirm">("form")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<"cUSD" | "cNGN">("cUSD")
  const [error, setError] = useState("")

  const handleReview = () => {
    if (!recipient || !amount) {
      setError("Please fill in all fields")
      return
    }
    setError("")
    setStep("review")
  }

  const handleConfirm = () => {
    setStep("confirm")
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="safe-container py-6">
        <Link href="/wallet" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to Wallet
        </Link>

        <Card className="max-w-md mx-auto">
          {step === "form" && (
            <>
              <CardHeader>
                <CardTitle>Send Stablecoins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Recipient Address"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  error={error && !recipient ? error : undefined}
                />

                <div className="space-y-2">
                  <label className="text-label font-medium block text-foreground">Currency</label>
                  <div className="flex gap-3">
                    {(["cUSD", "cNGN"] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                          currency === curr
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-input text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <AmountInput
                  currency={currency}
                  label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={error && !amount ? error : undefined}
                />

                <div className="bg-muted rounded-lg p-4 text-xs text-muted-foreground space-y-1">
                  <p>Available balance: ₵347.92</p>
                  <p>Network fee: ₵0.10 (estimated)</p>
                  <p>Total: ₵{(Number.parseFloat(amount || "0") + 0.1).toFixed(2)}</p>
                </div>

                <Button onClick={handleReview} className="w-full">
                  Review Transaction
                </Button>
              </CardContent>
            </>
          )}

          {step === "review" && (
            <>
              <CardHeader>
                <CardTitle>Review Transaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                      Recipient
                    </p>
                    <p className="font-mono text-sm text-foreground">{recipient}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      {currency === "cUSD" ? "₵" : "₦"}
                      {amount}
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                      Network Fee
                    </p>
                    <p className="font-semibold text-foreground">₵0.10</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("form")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1">
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === "confirm" && (
            <>
              <CardHeader>
                <CardTitle className="text-center">Sent Successfully</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <ArrowUp className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-muted-foreground mb-4">Your transaction has been sent successfully</p>
                  <p className="font-mono text-sm text-foreground mb-6 break-all">0xabc123def456ghi789jkl012mno...</p>
                  <Link href="/wallet">
                    <Button className="w-full">Back to Wallet</Button>
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
