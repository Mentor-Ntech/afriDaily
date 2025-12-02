"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, FileText, Key, Lock } from "lucide-react"
import { Button } from "@/components/ui/button-custom"
import { Input } from "@/components/ui/input-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom"
import { Progress } from "@/components/ui/progress"

type ImportStep = "method-select" | "enter-credentials" | "password" | "success"

export default function ImportWalletPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<ImportStep>("method-select")
  const [importMethod, setImportMethod] = useState<"phrase" | "key" | "keystore">("phrase")
  const [phrase, setPhrase] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const STEPS: ImportStep[] = ["method-select", "enter-credentials", "password", "success"]
  const currentStepIndex = STEPS.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const handleMethodSelect = (method: typeof importMethod) => {
    setImportMethod(method)
    setCurrentStep("enter-credentials")
  }

  const handleCredentialsSubmit = () => {
    const isValid =
      (importMethod === "phrase" && phrase.trim().split(" ").length >= 12) ||
      (importMethod === "key" && privateKey.length > 0) ||
      (importMethod === "keystore" && keystoreFile !== null)

    if (isValid) {
      setCurrentStep("password")
    }
  }

  const handlePasswordCreate = () => {
    if (password && password === passwordConfirm && password.length >= 8) {
      setCurrentStep("success")
    }
  }

  const isPasswordValid = password.length >= 8 && password === passwordConfirm
  const phraseWordCount = phrase.trim().split(/\s+/).filter(Boolean).length
  const isPhraseValid = phraseWordCount === 12 || phraseWordCount === 24

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8 md:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
            <Link href="/wallet/create" className="text-primary hover:underline">
              Create Instead
            </Link>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Method Selection */}
        {currentStep === "method-select" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[24px] leading-[1.4]">Import Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "phrase" as const,
                  label: "Recovery Phrase",
                  desc: "12 or 24 words",
                  icon: Lock,
                },
                {
                  id: "key" as const,
                  label: "Private Key",
                  desc: "Hex or WIF format",
                  icon: Key,
                },
                {
                  id: "keystore" as const,
                  label: "Keystore File",
                  desc: "JSON file",
                  icon: FileText,
                },
              ].map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left flex items-center gap-4"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.desc}</p>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Enter Credentials */}
        {currentStep === "enter-credentials" && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentStep("method-select")}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-[24px] leading-[1.4]">
                  {importMethod === "phrase" && "Enter Recovery Phrase"}
                  {importMethod === "key" && "Enter Private Key"}
                  {importMethod === "keystore" && "Upload Keystore File"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {importMethod === "phrase" && (
                <div className="space-y-2">
                  <textarea
                    className="w-full p-4 border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-mono resize-none h-32"
                    placeholder="Enter your 12 or 24 word recovery phrase"
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {phraseWordCount > 0 && (
                      <span className={isPhraseValid ? "text-[#16A34A]" : "text-destructive"}>
                        {phraseWordCount} word{phraseWordCount !== 1 ? "s" : ""}
                        {isPhraseValid ? " ✓" : " (need 12 or 24)"}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {importMethod === "key" && (
                <Input
                  type="password"
                  label="Private Key"
                  placeholder="0x..."
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  helperText="Never share your private key with anyone"
                />
              )}

              {importMethod === "keystore" && (
                <div className="space-y-2">
                  <label className="text-label font-medium block text-foreground">Keystore File</label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setKeystoreFile(e.target.files?.[0] || null)}
                    className="w-full p-4 border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {keystoreFile && (
                    <p className="text-sm text-[#16A34A]">✓ {keystoreFile.name} selected</p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep("method-select")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  disabled={
                    (importMethod === "phrase" && !isPhraseValid) ||
                    (importMethod === "key" && !privateKey) ||
                    (importMethod === "keystore" && !keystoreFile)
                  }
                  onClick={handleCredentialsSubmit}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Password Setup */}
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
                error={password && password.length < 8 ? "Password must be at least 8 characters" : undefined}
              />
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                error={passwordConfirm && password !== passwordConfirm ? "Passwords do not match" : undefined}
              />

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep("enter-credentials")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button disabled={!isPasswordValid} onClick={handlePasswordCreate} className="flex-1">
                  Import Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {currentStep === "success" && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#16A34A]" />
              </div>
              <CardTitle className="text-[24px] leading-[1.4]">Wallet Imported Successfully</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-muted-foreground text-center leading-[1.5]">
                Your wallet has been successfully imported and is ready to use.
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
