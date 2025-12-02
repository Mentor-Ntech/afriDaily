"use client"

import { useState } from "react"
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button-custom"
import { Input } from "@/components/ui/input-custom"
import { AmountInput } from "@/components/ui/amount-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type CreateStreamStep = "basic" | "config" | "review" | "success"

const STEPS: CreateStreamStep[] = ["basic", "config", "review", "success"]
const STEP_LABELS = ["Basic Info", "Configuration", "Review", "Complete"]

export default function CreateStreamPage() {
  const [step, setStep] = useState<CreateStreamStep>("basic")
  const [formData, setFormData] = useState({
    streamName: "",
    employer: "",
    hourlyRate: "",
    currency: "cUSD" as const,
    frequency: "hourly" as const,
    startDate: "",
    autoWithdraw: false,
    withdrawalThreshold: "",
  })

  const currentStepIndex = STEPS.indexOf(step)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const isBasicValid = formData.streamName && formData.employer && formData.hourlyRate
  const isConfigValid = formData.startDate

  const handleBasicNext = () => {
    if (isBasicValid) {
      setStep("config")
    }
  }

  const handleConfigNext = () => {
    if (isConfigValid) {
      setStep("review")
    }
  }

  const handleCreate = () => {
    setStep("success")
  }

  const monthlyPotential = Number.parseFloat(formData.hourlyRate || "0") * 160

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

        <Card className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="px-6 pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {STEPS.length}</span>
              <span className="text-sm text-muted-foreground">{STEP_LABELS[currentStepIndex]}</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
          </div>

          {/* Step 1: Basic Info */}
          {step === "basic" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Stream Name"
                  placeholder="e.g., Salary Stream, Freelance Project"
                  value={formData.streamName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      streamName: e.target.value,
                    })
                  }
                />

                <Input
                  label="Employer / Client Name"
                  placeholder="e.g., Acme Corp, Tech Startup"
                  value={formData.employer}
                  onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                />

                <div className="space-y-2">
                  <Label className="text-label font-medium">Currency</Label>
                  <div className="flex gap-3">
                    {(["cUSD", "cNGN"] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setFormData({ ...formData, currency: curr })}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all h-11 ${
                          formData.currency === curr
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
                  currency={formData.currency}
                  label="Hourly Rate"
                  placeholder="0.00"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourlyRate: e.target.value.replace(/,/g, ""),
                    })
                  }
                />

                <div className="space-y-2">
                  <Label className="text-label font-medium">Payment Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, frequency: value as typeof formData.frequency })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleBasicNext} className="w-full h-12" disabled={!isBasicValid}>
                  Continue
                </Button>
              </CardContent>
            </>
          )}

          {/* Step 2: Configuration */}
          {step === "config" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />

                <div className="flex items-center justify-between p-4 border-2 border-input rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Auto-withdraw</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically withdraw when threshold is reached
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoWithdraw}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, autoWithdraw: checked })
                    }
                  />
                </div>

                {formData.autoWithdraw && (
                  <AmountInput
                    currency={formData.currency}
                    label="Withdrawal Threshold"
                    placeholder="0.00"
                    helperText="Automatically withdraw when balance reaches this amount"
                    value={formData.withdrawalThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        withdrawalThreshold: e.target.value.replace(/,/g, ""),
                      })
                    }
                  />
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("basic")} className="flex-1 h-12">
                    Back
                  </Button>
                  <Button onClick={handleConfigNext} className="flex-1 h-12" disabled={!isConfigValid}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Review & Confirm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4 md:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Stream Name
                      </p>
                      <p className="font-semibold text-foreground">{formData.streamName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Employer
                      </p>
                      <p className="font-semibold text-foreground">{formData.employer}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Hourly Rate
                      </p>
                      <p className="text-lg md:text-xl font-bold text-primary">
                        {formData.currency === "cUSD" ? "$" : "₦"}
                        {Number.parseFloat(formData.hourlyRate || "0").toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Monthly Potential
                      </p>
                      <p className="text-lg md:text-xl font-bold text-[#16A34A]">
                        {formData.currency === "cUSD" ? "$" : "₦"}
                        {monthlyPotential.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                      Summary
                    </p>
                    <ul className="text-sm text-foreground space-y-1">
                      <li>Start date: {formData.startDate || "Not set"}</li>
                      <li>Payment frequency: {formData.frequency}</li>
                      {formData.autoWithdraw && (
                        <li>
                          Auto-withdraw threshold: {formData.currency === "cUSD" ? "$" : "₦"}
                          {formData.withdrawalThreshold}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground">
                  Estimated gas fee: $0.50
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("config")} className="flex-1 h-12">
                    Back
                  </Button>
                  <Button onClick={handleCreate} className="flex-1 h-12">
                    Create Stream
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#16A34A]" />
                </div>
                <CardTitle className="text-[24px] leading-[1.4]">Stream Created Successfully</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-base text-muted-foreground mb-4 leading-[1.5]">
                    Your salary stream is now active and you'll start earning {formData.frequency}.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 font-mono bg-muted p-3 rounded-lg">
                    Stream address: 0xabc123def456...
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button asChild className="w-full h-12">
                      <Link href="/streams">View All Streams</Link>
                    </Button>
                    <Button variant="secondary" asChild className="w-full h-12">
                      <Link href="/">Back to Home</Link>
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
