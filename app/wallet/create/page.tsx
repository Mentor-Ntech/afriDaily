"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Eye, EyeOff, Copy, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Input } from "@/components/ui/input-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

type WalletStep = "welcome" | "warning" | "phrase-display" | "phrase-verify" | "password" | "success"

const STEPS: WalletStep[] = ["welcome", "warning", "phrase-display", "phrase-verify", "password", "success"]
const STEP_LABELS = ["Welcome", "Security", "Recovery Phrase", "Verify", "Password", "Complete"]

export default function CreateWalletPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WalletStep>("welcome")
  const [showPhrase, setShowPhrase] = useState(false)
  const [phraseSaved, setPhraseSaved] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [pin, setPin] = useState("")
  const [verificationWords, setVerificationWords] = useState({ word3: "", word7: "", word11: "" })
  const [recoveryPhrase] = useState(
    "abandon ability able about above absolute absorb abstract abuse access accident account",
  )

  const currentStepIndex = STEPS.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const words = recoveryPhrase.split(" ")
  const correctWords = {
    word3: words[2],
    word7: words[6],
    word11: words[10],
  }

  const isVerificationValid =
    verificationWords.word3.toLowerCase() === correctWords.word3.toLowerCase() &&
    verificationWords.word7.toLowerCase() === correctWords.word7.toLowerCase() &&
    verificationWords.word11.toLowerCase() === correctWords.word11.toLowerCase()

  const handleCopyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(recoveryPhrase)
    } catch (error) {
      console.error("Failed to copy phrase")
    }
  }

  const handlePasswordCreate = () => {
    if (password && password === passwordConfirm && password.length >= 8) {
      setCurrentStep("success")
    }
  }

  const isPasswordValid = password.length >= 8 && password === passwordConfirm

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8 md:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
            <span>{STEP_LABELS[currentStepIndex]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Welcome Step */}
        {currentStep === "welcome" && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Lock className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <CardTitle className="text-[24px] leading-[1.4]">Create Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-muted-foreground text-center leading-[1.5]">
                Your wallet stores your stablecoins securely on the Celo blockchain.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" asChild className="flex-1">
                  <Link href="/wallet/import">Import Instead</Link>
                </Button>
                <Button onClick={() => setCurrentStep("warning")} className="flex-1">
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Warning Step */}
        {currentStep === "warning" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Important: Keep Your Phrase Safe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-destructive mb-1">Save your recovery phrase</p>
                    <p className="text-sm text-muted-foreground leading-[1.4]">
                      You'll need it to restore your wallet. Never share it with anyone.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={phraseSaved}
                  onChange={(e) => setPhraseSaved(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-2 border-input cursor-pointer"
                />
                <span className="text-sm text-foreground leading-[1.4]">
                  I understand I'm responsible for keeping my recovery phrase safe
                </span>
              </label>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setCurrentStep("welcome")} className="flex-1">
                  Back
                </Button>
                <Button
                  disabled={!phraseSaved}
                  onClick={() => {
                    setPhraseSaved(false)
                    setCurrentStep("phrase-display")
                  }}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phrase Display Step */}
        {currentStep === "phrase-display" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Your Recovery Phrase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-lg p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">12-Word Recovery Phrase</p>
                  <button
                    onClick={() => setShowPhrase(!showPhrase)}
                    className="p-2 hover:bg-background rounded transition-colors"
                    aria-label={showPhrase ? "Hide phrase" : "Show phrase"}
                  >
                    {showPhrase ? (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {showPhrase ? (
                  <div className="grid grid-cols-3 gap-2">
                    {words.map((word, idx) => (
                      <div
                        key={idx}
                        className="bg-background rounded-lg p-2 text-xs text-center border border-border"
                      >
                        <span className="text-muted-foreground font-mono mr-1">{idx + 1}.</span>
                        <span className="font-medium">{word}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {Array(12)
                      .fill(0)
                      .map((_, idx) => (
                        <div key={idx} className="bg-background rounded-lg p-2 h-10 border border-border" />
                      ))}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                onClick={handleCopyPhrase}
                disabled={!showPhrase}
                className="w-full gap-2 h-11"
              >
                <Copy className="w-4 h-4" />
                Copy Phrase
              </Button>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground text-center">
                  ⚠️ Never share your recovery phrase with anyone
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={phraseSaved}
                  onChange={(e) => setPhraseSaved(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-2 border-input cursor-pointer"
                />
                <span className="text-sm text-foreground leading-[1.4]">
                  I've saved my recovery phrase in a safe place
                </span>
              </label>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setCurrentStep("warning")} className="flex-1">
                  Back
                </Button>
                <Button
                  disabled={!phraseSaved || !showPhrase}
                  onClick={() => {
                    setPhraseSaved(false)
                    setCurrentStep("phrase-verify")
                  }}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phrase Verification Step */}
        {currentStep === "phrase-verify" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Verify Your Phrase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground leading-[1.4]">
                To confirm you've saved your phrase, enter the words requested below:
              </p>

              <div className="space-y-4">
                <Input
                  label="Word #3"
                  placeholder="Enter word #3"
                  value={verificationWords.word3}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, word3: e.target.value })
                  }
                />
                <Input
                  label="Word #7"
                  placeholder="Enter word #7"
                  value={verificationWords.word7}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, word7: e.target.value })
                  }
                />
                <Input
                  label="Word #11"
                  placeholder="Enter word #11"
                  value={verificationWords.word11}
                  onChange={(e) =>
                    setVerificationWords({ ...verificationWords, word11: e.target.value })
                  }
                />
              </div>

              {!isVerificationValid && verificationWords.word3 && (
                <p className="text-sm text-destructive">Please verify all words correctly</p>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setCurrentStep("phrase-display")} className="flex-1">
                  Back
                </Button>
                <Button
                  disabled={!isVerificationValid}
                  onClick={() => setCurrentStep("password")}
                  className="flex-1"
                >
                  Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Password Setup Step */}
        {currentStep === "password" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Set Your Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                type="password"
                label="Password (minimum 8 characters)"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={
                  password && password.length < 8 ? "Password must be at least 8 characters" : undefined
                }
              />
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                error={
                  passwordConfirm && password !== passwordConfirm ? "Passwords do not match" : undefined
                }
              />
              <Input
                type="text"
                inputMode="numeric"
                label="Optional: 6-Digit PIN for Quick Access"
                placeholder="123456"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setCurrentStep("phrase-verify")} className="flex-1">
                  Back
                </Button>
                <Button disabled={!isPasswordValid} onClick={handlePasswordCreate} className="flex-1">
                  Create Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {currentStep === "success" && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#16A34A]" />
              </div>
              <CardTitle className="text-[24px] leading-[1.4]">Wallet Created Successfully</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-muted-foreground text-center leading-[1.5]">
                Your wallet is ready to use. You can now manage your crypto earnings.
              </p>
              <Button asChild className="w-full h-12">
                <Link href="/">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
