"use client"

import { ArrowRight, Zap, Users, Shield, TrendingUp, CheckCircle2, Wallet, Smartphone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent } from "@/components/ui/card-custom"
import { WalletConnectButton } from "@/components/web3/wallet-connect-button"
import { Logo } from "@/components/ui/logo"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"

export default function LandingPage() {
  const router = useRouter()
  const { isConnected } = useWallet()

  // Check if user was previously connected and redirect only then
  // This allows the landing page to show first for new users
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasConnected = localStorage.getItem("afridaily_wallet_connected") === "true"
      if (wasConnected && isConnected) {
        // User was previously connected, redirect to dashboard
        router.push("/dashboard")
      }
    }
  }, [isConnected, router])

  const features = [
    {
      icon: Zap,
      title: "Salary Streaming",
      description: "Earn crypto income in real-time with configurable payment streams. Perfect for freelancers and remote workers.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Savings Circles",
      description: "Join traditional Ajo and Esusu savings groups on-chain. Save together with your community transparently.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Built on Celo blockchain with smart contracts. All transactions are transparent and secure.",
      color: "text-[#16A34A]",
      bgColor: "bg-[#16A34A]/10",
    },
    {
      icon: TrendingUp,
      title: "Micro-Loans",
      description: "Access affordable credit through peer lending pools. Build credit history on-chain.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized for low-bandwidth networks. Works offline and supports local languages.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Wallet,
      title: "Stablecoin Native",
      description: "Use cNGN and cUSD for predictable savings. No currency volatility, just stable value.",
      color: "text-[#16A34A]",
      bgColor: "bg-[#16A34A]/10",
    },
  ]

  const benefits = [
    "No currency volatility with stablecoins",
    "Transparent on-chain transactions",
    "Cultural savings methods (Ajo/Esusu)",
    "Low transaction fees on Celo",
    "Offline-first mobile experience",
    "Multi-language support",
  ]

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="safe-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="md" showText={true} animated={true} className="md:text-2xl" />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Dashboard
                </Button>
              </Link>
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="safe-container py-12 md:py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-semibold text-primary">🚀 Built for Africa</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Manage Your Crypto Earnings
            <br />
            <span className="text-primary">With Ease</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Salary streaming, savings circles, and micro-loans on the Celo blockchain. Built for crypto earners in
            Nigeria and Kenya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button variant="secondary" asChild size="lg" className="h-12 px-8 text-base">
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="safe-container py-12 md:py-20 bg-muted/30">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your crypto earnings and build wealth together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6 md:p-8">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 md:w-7 md:h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="safe-container py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "Connect Your Wallet",
              description: "Link your Celo wallet to start managing your stablecoins (cUSD, cNGN)",
            },
            {
              step: "2",
              title: "Create Streams & Circles",
              description: "Set up salary streams or join savings circles with your community",
            },
            {
              step: "3",
              title: "Earn & Save Together",
              description: "Watch your earnings grow and save together with transparent on-chain transactions",
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl font-bold">
                {item.step}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="safe-container py-12 md:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose AfriDaily</h2>
            <p className="text-lg text-muted-foreground">
              Built specifically for African markets with local needs in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <p className="text-base text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="safe-container py-12 md:py-20">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of crypto earners managing their finances on AfriDaily
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base gap-2">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="secondary" asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/wallet/create">Create Wallet</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="safe-container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <Logo size="md" showText={true} animated={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Crypto-first financial platform for Africa
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/streams" className="hover:text-foreground transition-colors">
                    Streams
                  </Link>
                </li>
                <li>
                  <Link href="/circles" className="hover:text-foreground transition-colors">
                    Circles
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:text-foreground transition-colors">
                    Benefits
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/wallet/create" className="hover:text-foreground transition-colors">
                    Create Wallet
                  </Link>
                </li>
                <li>
                  <Link href="/wallet/import" className="hover:text-foreground transition-colors">
                    Import Wallet
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AfriDaily. Built on Celo blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
