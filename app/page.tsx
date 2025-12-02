"use client"

import { ArrowRight, Zap, Users, Shield, TrendingUp, CheckCircle2, Wallet, Smartphone, Sparkles, Coins, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button-custom"
import { Card, CardContent } from "@/components/ui/card-custom"
import { WalletConnectButton } from "@/components/web3/wallet-connect-button"
import { Logo } from "@/components/ui/logo"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion"

export default function LandingPage() {
  const router = useRouter()
  const { isConnected } = useWallet()
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 })
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Smooth spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasConnected = localStorage.getItem("afridaily_wallet_connected") === "true"
      if (wasConnected && isConnected) {
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
      glowColor: "shadow-[0_0_20px_rgba(11,95,255,0.3)]",
    },
    {
      icon: Users,
      title: "Savings Circles",
      description: "Join traditional Ajo and Esusu savings groups on-chain. Save together with your community transparently.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      glowColor: "shadow-[0_0_20px_rgba(255,183,3,0.3)]",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Built on Celo blockchain with smart contracts. All transactions are transparent and secure.",
      color: "text-[#16A34A]",
      bgColor: "bg-[#16A34A]/10",
      glowColor: "shadow-[0_0_20px_rgba(22,163,74,0.3)]",
    },
    {
      icon: TrendingUp,
      title: "Micro-Loans",
      description: "Access affordable credit through peer lending pools. Build credit history on-chain.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      glowColor: "shadow-[0_0_20px_rgba(11,95,255,0.3)]",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized for low-bandwidth networks. Works offline and supports local languages.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      glowColor: "shadow-[0_0_20px_rgba(255,183,3,0.3)]",
    },
    {
      icon: Wallet,
      title: "Stablecoin Native",
      description: "Use cNGN and cUSD for predictable savings. No currency volatility, just stable value.",
      color: "text-[#16A34A]",
      bgColor: "bg-[#16A34A]/10",
      glowColor: "shadow-[0_0_20px_rgba(22,163,74,0.3)]",
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header with Glow Effect */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="safe-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Logo size="md" showText={true} animated={true} className="md:text-2xl" />
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {["Features", "How It Works", "Benefits"].map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <Link href="/dashboard">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Dashboard
                </Button>
              </Link>
              <WalletConnectButton />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Motion Graphics */}
      <section ref={heroRef} className="relative safe-container py-12 md:py-20 lg:py-32 overflow-hidden">
        {/* Floating Coins Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: typeof window !== "undefined" ? Math.random() * window.innerWidth : i * 100,
                y: typeof window !== "undefined" ? Math.random() * window.innerHeight : i * 150,
                opacity: 0,
              }}
              animate={{
                y: [null, -100, null],
                x: [null, Math.sin(i) * 50, null],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            >
              <Coins className="w-8 h-8 text-accent/40" />
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-5xl mx-auto text-center space-y-8 md:space-y-10 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 relative overflow-hidden group"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative text-sm font-semibold text-primary z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Built for Africa
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight"
          >
            Manage Your Crypto Earnings
            <br />
            <motion.span
              className="text-primary relative inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="relative z-10">With Ease</span>
              <motion.span
                className="absolute inset-0 bg-primary/20 blur-2xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Salary streaming, savings circles, and micro-loans on the Celo blockchain. Built for crypto earners in
            Nigeria and Kenya.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="h-12 px-8 text-base relative overflow-hidden group shadow-lg shadow-primary/20">
                <Link href="/dashboard">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" asChild size="lg" className="h-12 px-8 text-base border-2">
                <a href="#how-it-works">Learn More</a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section with Scroll Animations */}
      <section id="features" ref={featuresRef} className="safe-container py-12 md:py-20 lg:py-28 bg-muted/30 relative">
        <motion.div
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your crypto earnings and build wealth together
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div key={idx} variants={cardVariants} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className={`hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 ${feature.glowColor} group relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-6 md:p-8 relative z-10">
                    <motion.div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-6 h-6 md:w-7 md:h-7 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="safe-container py-12 md:py-20 lg:py-28 relative">
        <motion.div
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto"
        >
          {[
            {
              step: "1",
              title: "Connect Your Wallet",
              description: "Link your Celo wallet to start managing your stablecoins (cUSD, cNGN)",
              icon: Wallet,
            },
            {
              step: "2",
              title: "Create Streams & Circles",
              description: "Set up salary streams or join savings circles with your community",
              icon: Zap,
            },
            {
              step: "3",
              title: "Earn & Save Together",
              description: "Watch your earnings grow and save together with transparent on-chain transactions",
              icon: TrendingUp,
            },
          ].map((item, idx) => {
            const StepIcon = item.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center relative"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl font-bold relative shadow-lg shadow-primary/30"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="relative z-10">{item.step}</span>
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                {idx < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-10 left-full w-12 h-0.5 bg-primary/30"
                    initial={{ scaleX: 0 }}
                    animate={howItWorksInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.5 + idx * 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" ref={benefitsRef} className="safe-container py-12 md:py-20 lg:py-28 bg-muted/30">
        <motion.div
          initial="hidden"
          animate={benefitsInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Why Choose AfriDaily</h2>
            <p className="text-lg text-muted-foreground">
              Built specifically for African markets with local needs in mind
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 8, scale: 1.02 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                </motion.div>
                <p className="text-base text-foreground">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section with Glow */}
      <section ref={ctaRef} className="safe-container py-12 md:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20 relative overflow-hidden shadow-2xl shadow-primary/20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Join thousands of crypto earners managing their finances on AfriDaily
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary/30">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="secondary" asChild size="lg" className="h-12 px-8 text-base border-2">
                    <Link href="/wallet/create">Create Wallet</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
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
