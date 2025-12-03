"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { ArrowLeft, CreditCard, ArrowRightLeft, ExternalLink, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/formatting"

type FundingMethod = "card" | "bank" | "crypto" | "p2p"

interface FundingOption {
  id: FundingMethod
  title: string
  description: string
  icon: typeof CreditCard
  available: boolean
  minAmount?: string
  fee?: string
  estimatedTime?: string
}

export default function AddFundsPage() {
  const [selectedMethod, setSelectedMethod] = useState<FundingMethod | null>(null)

  const fundingOptions: FundingOption[] = [
    {
      id: "card",
      title: "Buy with Card",
      description: "Purchase cUSD or cNGN directly with your debit/credit card",
      icon: CreditCard,
      available: true,
      minAmount: "10.00",
      fee: "3.5%",
      estimatedTime: "Instant",
    },
    {
      id: "bank",
      title: "Bank Transfer",
      description: "Deposit NGN or USD from your bank account",
      icon: ArrowRightLeft,
      available: true,
      minAmount: "50.00",
      fee: "1.5%",
      estimatedTime: "1-3 business days",
    },
    {
      id: "crypto",
      title: "Swap Crypto",
      description: "Exchange other cryptocurrencies for cUSD or cNGN",
      icon: ArrowRightLeft,
      available: true,
      minAmount: "5.00",
      fee: "0.5%",
      estimatedTime: "5-15 minutes",
    },
    {
      id: "p2p",
      title: "P2P Exchange",
      description: "Buy from verified sellers in your local currency",
      icon: ExternalLink,
      available: false,
      minAmount: "20.00",
      fee: "0%",
      estimatedTime: "15-30 minutes",
    },
  ]

  const handleSelectMethod = (method: FundingMethod) => {
    if (fundingOptions.find((opt) => opt.id === method)?.available) {
      setSelectedMethod(method)
    }
  }

  const handleContinue = () => {
    // In a real app, this would navigate to the specific funding flow
    // For now, we'll show a message
    alert(`This would initiate the ${selectedMethod} funding flow. Integration with payment providers coming soon.`)
  }

  return (
    <div className="bg-background min-h-screen pb-12 md:pb-16">
      <div className="safe-container py-6 md:py-8">
        <Link
          href="/wallet"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 font-semibold text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wallet
        </Link>

        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.4]">
              Add Funds
            </h1>
            <p className="text-base text-muted-foreground">
              Choose a method to add cUSD or cNGN to your wallet
            </p>
          </div>

          {/* Funding Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {fundingOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedMethod === option.id
              const isDisabled = !option.available

              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-primary border-primary"
                      : isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-primary/50"
                  }`}
                  onClick={() => !isDisabled && handleSelectMethod(option.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{option.title}</h3>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                          {isDisabled && (
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {option.minAmount && (
                            <div className="flex items-center gap-1">
                              <span>Min: {formatCurrency(option.minAmount, "cUSD")}</span>
                            </div>
                          )}
                          {option.fee && (
                            <div className="flex items-center gap-1">
                              <span>Fee: {option.fee}</span>
                            </div>
                          )}
                          {option.estimatedTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{option.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Selected Method Details */}
          {selectedMethod && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Selected Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const option = fundingOptions.find((opt) => opt.id === selectedMethod)!
                  const Icon = option.icon

                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                        {option.minAmount && (
                          <div>
                            <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                              Minimum
                            </p>
                            <p className="font-semibold text-foreground">
                              {formatCurrency(option.minAmount, "cUSD")}
                            </p>
                          </div>
                        )}
                        {option.fee && (
                          <div>
                            <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                              Fee
                            </p>
                            <p className="font-semibold text-foreground">{option.fee}</p>
                          </div>
                        )}
                        {option.estimatedTime && (
                          <div>
                            <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                              Time
                            </p>
                            <p className="font-semibold text-foreground">{option.estimatedTime}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setSelectedMethod(null)} className="flex-1 h-11">
                          Cancel
                        </Button>
                        <Button onClick={handleContinue} className="flex-1 h-11">
                          Continue
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Important Notice */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">i</span>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">About Adding Funds</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>All funds are converted to Celo stablecoins (cUSD or cNGN)</li>
                    <li>Fees vary by payment method and are displayed before confirmation</li>
                    <li>Bank transfers may take 1-3 business days to process</li>
                    <li>Card purchases are typically instant but may require verification</li>
                    <li>Your funds are secured on the Celo blockchain</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

