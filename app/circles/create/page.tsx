"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle2, Plus, X, Users, RotateCcw, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button-custom"
import { Input } from "@/components/ui/input-custom"
import { AmountInput } from "@/components/ui/amount-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatAddress } from "@/lib/formatting"

type CreateCircleStep = "type" | "details" | "members" | "review" | "success"

const STEPS: CreateCircleStep[] = ["type", "details", "members", "review", "success"]
const STEP_LABELS = ["Circle Type", "Details", "Members", "Review", "Complete"]

export default function CreateCirclePage() {
  const [step, setStep] = useState<CreateCircleStep>("type")
  const [formData, setFormData] = useState({
    circleType: "ajo" as "ajo" | "esusu",
    circleName: "",
    contributionAmount: "",
    currency: "cUSD" as const,
    frequency: "monthly" as const,
    totalDuration: "",
    memberLimit: "",
  })
  const [members, setMembers] = useState<string[]>([])
  const [newMemberAddress, setNewMemberAddress] = useState("")

  const currentStepIndex = STEPS.indexOf(step)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const handleTypeSelect = (type: "ajo" | "esusu") => {
    setFormData({ ...formData, circleType: type })
    setStep("details")
  }

  const isDetailsValid =
    formData.circleName && formData.contributionAmount && formData.totalDuration && formData.memberLimit

  const handleDetailsNext = () => {
    if (isDetailsValid) {
      setStep("members")
    }
  }

  const handleAddMember = () => {
    if (
      newMemberAddress &&
      newMemberAddress.startsWith("0x") &&
      newMemberAddress.length === 42 &&
      !members.includes(newMemberAddress) &&
      members.length < Number.parseInt(formData.memberLimit || "0")
    ) {
      setMembers([...members, newMemberAddress])
      setNewMemberAddress("")
    }
  }

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const handleMembersNext = () => {
    if (members.length >= 2) {
      setStep("review")
    }
  }

  const handleCreate = () => {
    setStep("success")
  }

  const isAddressValid = newMemberAddress.startsWith("0x") && newMemberAddress.length === 42
  const canAddMore = members.length < Number.parseInt(formData.memberLimit || "0")

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

        <Card className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="px-6 pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {STEPS.length}</span>
              <span className="text-sm text-muted-foreground">{STEP_LABELS[currentStepIndex]}</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
          </div>

          {/* Step 1: Circle Type */}
          {step === "type" && (
            <>
              <CardHeader>
                <CardTitle className="text-[24px] leading-[1.4]">Choose Circle Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "ajo" as const,
                    title: "Ajo Circle",
                    subtitle: "Rotating Savings",
                    description:
                      "Members take turns receiving the full pool amount. Each member gets the entire contribution once per cycle. Traditional rotating savings method.",
                    icon: RotateCcw,
                  },
                  {
                    id: "esusu" as const,
                    title: "Esusu Circle",
                    subtitle: "Fixed Monthly Savings",
                    description:
                      "Everyone receives the same fixed amount each month in a predetermined order. Ideal for predictable savings goals.",
                    icon: Calendar,
                  },
                ].map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`w-full p-4 md:p-6 border-2 rounded-lg text-left transition-all ${
                        formData.circleType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-base mb-1">{type.title}</p>
                          <p className="text-sm text-primary font-medium mb-2">{type.subtitle}</p>
                          <p className="text-sm text-muted-foreground leading-[1.4]">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </>
          )}

          {/* Step 2: Circle Details */}
          {step === "details" && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep("type")}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-[24px] leading-[1.4]">Circle Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Circle Name"
                  placeholder="e.g., Family Savings, Work Group"
                  value={formData.circleName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      circleName: e.target.value,
                    })
                  }
                />

                <div className="space-y-2">
                  <label className="text-label font-medium block text-foreground">Currency</label>
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
                  label="Monthly Contribution Amount"
                  placeholder="0.00"
                  value={formData.contributionAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contributionAmount: e.target.value.replace(/,/g, ""),
                    })
                  }
                />

                <div className="space-y-2">
                  <label className="text-label font-medium block text-foreground">Frequency</label>
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
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  type="number"
                  label="Total Duration (months)"
                  placeholder="12"
                  value={formData.totalDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalDuration: e.target.value,
                    })
                  }
                />

                <Input
                  type="number"
                  label="Member Limit"
                  placeholder="10"
                  value={formData.memberLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      memberLimit: e.target.value,
                    })
                  }
                  helperText="Minimum 2 members required"
                />

                <Button onClick={handleDetailsNext} className="w-full h-12" disabled={!isDetailsValid}>
                  Continue
                </Button>
              </CardContent>
            </>
          )}

          {/* Step 3: Add Members */}
          {step === "members" && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep("details")}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-[24px] leading-[1.4]">Invite Members</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                    Add at least 2 members (limit: {formData.memberLimit || "N/A"})
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Wallet address (0x...)"
                      value={newMemberAddress}
                      onChange={(e) => setNewMemberAddress(e.target.value)}
                      error={
                        newMemberAddress && !isAddressValid
                          ? "Invalid wallet address (must start with 0x and be 42 characters)"
                          : undefined
                      }
                    />
                    <Button
                      onClick={handleAddMember}
                      disabled={!isAddressValid || !canAddMore}
                      variant="secondary"
                      className="gap-1 h-11"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {members.length > 0 && (
                  <div className="border border-border rounded-lg divide-y">
                    {members.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4">
                        <span className="font-mono text-sm text-foreground">{formatAddress(member, 6)}</span>
                        <button
                          onClick={() => handleRemoveMember(idx)}
                          className="p-2 hover:bg-muted rounded transition-colors"
                          aria-label="Remove member"
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No members added yet</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("details")} className="flex-1 h-12">
                    Back
                  </Button>
                  <Button disabled={members.length < 2} onClick={handleMembersNext} className="flex-1 h-12">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Review */}
          {step === "review" && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStep("members")}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-[24px] leading-[1.4]">Review & Deploy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4 md:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Circle Name
                      </p>
                      <p className="font-semibold text-foreground">{formData.circleName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">Type</p>
                      <p className="font-semibold text-foreground capitalize">{formData.circleType}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Monthly Contribution
                      </p>
                      <p className="text-lg md:text-xl font-bold text-primary">
                        {formData.currency === "cUSD" ? "₵" : "₦"}
                        {Number.parseFloat(formData.contributionAmount || "0").toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
                        Duration
                      </p>
                      <p className="text-lg md:text-xl font-bold text-foreground">{formData.totalDuration} months</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                      Members ({members.length})
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {members.map((member, idx) => (
                        <p key={idx} className="font-mono text-xs text-muted-foreground">
                          {formatAddress(member, 8)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground">
                  Smart contract deployment fee: ₵1.50
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("members")} className="flex-1 h-12">
                    Back
                  </Button>
                  <Button onClick={handleCreate} className="flex-1 h-12">
                    Create Circle
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 5: Success */}
          {step === "success" && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#16A34A]" />
                </div>
                <CardTitle className="text-[24px] leading-[1.4]">Circle Created Successfully</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-base text-muted-foreground mb-4 leading-[1.5]">
                    Your {formData.circleType} savings circle is now live!
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 font-mono bg-muted p-3 rounded-lg">
                    Circle address: 0xabc123def456...
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button asChild className="w-full h-12">
                      <Link href="/circles">View All Circles</Link>
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
