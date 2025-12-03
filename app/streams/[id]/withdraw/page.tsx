"use client"

import { use } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { AmountInput } from "@/components/ui/amount-input"
import { Input } from "@/components/ui/input-custom"
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/formatting"

type WithdrawStep = "form" | "review" | "success"

export default function WithdrawStreamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [step, setStep] = useState<WithdrawStep>("form")
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [useMyWallet, setUseMyWallet] = useState(true)
  const [currency] = useState<"cUSD" | "cNGN">("cUSD")

  const stream = {
    id,
    name: "Salary Stream",
    employer: "Acme Corp",
    balance: "12.34",
    currency: "cUSD" as const,
  }

  const networkFee = "0.10"
  const totalAmount = Number.parseFloat(amount || "0") + Number.parseFloat(networkFee)

  const handleReview = () => {
    if (amount && Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= Number.parseFloat(stream.balance)) {
      setStep("review")
    }
  }

  const handleConfirm = () => {
    // Placeholder for actual withdrawal logic
    setStep("success")
  }

  const handleUseMyWallet = () => {
    setUseMyWallet(true)
    setRecipientAddress("0x1234567890123456789012345678901234567890") // Mock address
  }

  const isAmountValid = amount && Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= Number.parseFloat(stream.balance)
  const isRecipientValid = useMyWallet || (recipientAddress && recipientAddress.startsWith("0x") && recipientAddress.length === 42)

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      <div className="safe-container py-6 md:py-8">
        <Link
          href={`/streams/${id}`}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stream
        </Link>

        <Card className="max-w-2xl mx-auto">
          {step === "form" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Withdraw from Stream</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stream Info */}
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Stream</p>
                  <p className="font-semibold text-foreground mb-2">{stream.name}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xs text-muted-foreground">Available Balance:</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(stream.balance, stream.currency)}</p>
                  </div>
                </div>

                {/* Amount Input */}
                <AmountInput
                  currency={currency}
                  label="Withdrawal Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/,/g, ""))}
                  helperText={`Maximum: ${formatCurrency(stream.balance, stream.currency)}`}
                />

                {/* Max Button */}
                <Button
                  variant="ghost"
                  onClick={() => setAmount(stream.balance)}
                  className="w-full"
                  disabled={!stream.balance}
                >
                  Use Maximum ({formatCurrency(stream.balance, stream.currency)})
                </Button>

                {/* Recipient Address */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-label font-medium block text-foreground">Recipient Address</label>
                    <Button variant="ghost" size="sm" onClick={handleUseMyWallet} className="text-xs">
                      Use My Wallet
                    </Button>
                  </div>
                  {useMyWallet ? (
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm font-mono text-foreground break-all">0x1234...7890</p>
                      <p className="text-xs text-muted-foreground mt-1">Your wallet address</p>
                    </div>
                  ) : (
                    <Input
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => {
                        setRecipientAddress(e.target.value)
                        setUseMyWallet(false)
                      }}
                      helperText="Enter the recipient wallet address"
                    />
                  )}
                </div>

                {/* Network Fee */}
                <div className="bg-muted rounded-lg p-4 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Network Fee:</span>
                    <span className="font-semibold text-foreground">{formatCurrency(networkFee, currency)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-semibold text-foreground">Total:</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(totalAmount.toFixed(2), currency)}</span>
                  </div>
                </div>

                {/* Review Button */}
                <Button onClick={handleReview} disabled={!isAmountValid || !isRecipientValid} className="w-full">
                  Review Withdrawal
                </Button>
              </CardContent>
            </>
          )}

          {step === "review" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Confirm Withdrawal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Amount</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(amount, currency)}</p>
                  </div>
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stream:</span>
                      <span className="text-sm font-semibold text-foreground">{stream.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Recipient:</span>
                      <span className="text-sm font-mono text-foreground">
                        {useMyWallet ? "0x1234...7890" : `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Network Fee:</span>
                      <span className="text-sm font-semibold text-foreground">{formatCurrency(networkFee, currency)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-sm font-semibold text-foreground">Total:</span>
                      <span className="text-lg font-bold text-primary">{formatCurrency(totalAmount.toFixed(2), currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("form")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1">
                    Confirm Withdrawal
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === "success" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4] text-center">Withdrawal Successful</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">
                    {formatCurrency(amount, currency)} withdrawn successfully
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Your funds have been sent to the recipient address
                  </p>
                  <div className="bg-muted rounded-lg p-4 mb-6">
                    <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-foreground break-all">0xabc123def456ghi789jkl012mno345pqr678</p>
                      <a
                        href="https://explorer.celo.org/mainnet/tx/0xabc123def456ghi789jkl012mno345pqr678"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" asChild className="flex-1">
                      <Link href={`/streams/${id}`}>Back to Stream</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/wallet">View Wallet</Link>
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

