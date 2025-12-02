# AfriDaily - Crypto Earnings Management Platform

A crypto-first mobile finance application built for everyday financial flows in Africa, focusing on Nigeria and Kenya. Built on Celo blockchain with Mento stablecoins (cNGN, cUSD).

## 🎯 Project Alignment

### ✅ Phase 1 Features Implemented

- **Wallet Onboarding** ✅
  - Simple key management and recovery
  - Wallet creation with 12-word recovery phrase
  - Wallet import (phrase, private key, keystore)
  - Secure password/PIN setup

- **Stablecoin Management** ✅
  - cUSD and cNGN support
  - Wallet balance display
  - Send/Receive functionality
  - QR code for receiving
  - Transaction history with filters

- **Salary Streaming** ✅
  - Create salary streams with configurable rates
  - Hourly/Daily/Weekly/Monthly frequency
  - Auto-withdraw thresholds
  - Stream details with earnings charts
  - Withdraw from streams

- **Peer Savings Circles** ✅
  - Ajo (Rotating Savings) circles
  - Esusu (Fixed Monthly) circles
  - Create circles with member management
  - Contribution tracking
  - Progress visualization
  - Member status tracking

- **Design System** ✅
  - Exact color palette (Brand #0B5FFF, Accent #FFB703, Success #16A34A, Danger #EF4444)
  - Typography scale (H1: 28px, H2: 24px, Body: 16px, Small: 14px)
  - 8px base spacing system
  - 200ms motion transitions
  - WCAG AA accessibility compliance

- **Mobile-First PWA** ✅
  - Responsive design (mobile, tablet, desktop)
  - Bottom navigation for mobile
  - Offline indicator
  - Touch-optimized (44px minimum targets)

### 🚧 Phase 1 Features (Future Implementation)

- Automated savings rules (round-ups, rule-based allocations)
- On-chain credit profiling
- Basic lending pools for micro-loans
- Multi-language support (Swahili, Hausa, Yoruba, Igbo)
- Voice-assisted flows

### 📋 Phase 2 Features (Future)

- Employer payroll APIs
- Integrated P2P on/off-ramps
- Merchant bill payment rails
- Enterprise payroll tooling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd afri-daily-pwa-design
   pnpm install
   # or
   npm install
   ```

2. **Run development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
afri-daily-pwa-design/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Main dashboard
│   ├── wallet/            # Wallet management
│   ├── streams/           # Salary streams
│   └── circles/            # Savings circles
├── components/            # React components
│   ├── layouts/           # Layout components
│   ├── features/          # Feature components
│   ├── ui/                # UI primitives
│   └── web3/              # Web3 integration
├── lib/                   # Utilities and constants
└── hooks/                 # Custom React hooks
```

## 🎨 Design System

### Colors
- **Brand Primary**: `#0B5FFF` (Blue)
- **Accent**: `#FFB703` (Orange/Yellow)
- **Success**: `#16A34A` (Green)
- **Danger**: `#EF4444` (Red)

### Typography
- **H1**: 28px, line-height 1.4, weight 700
- **H2**: 24px, line-height 1.4, weight 600
- **Body**: 16px, line-height 1.5, weight 400
- **Small**: 14px, line-height 1.4, weight 400

### Spacing
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

## 🔗 Key Routes

- `/` - Landing page
- `/dashboard` - Main dashboard
- `/wallet` - Wallet overview
- `/wallet/create` - Create wallet
- `/wallet/import` - Import wallet
- `/streams` - Salary streams list
- `/streams/create` - Create stream
- `/streams/[id]` - Stream details
- `/circles` - Savings circles list
- `/circles/create` - Create circle
- `/circles/[id]` - Circle details
- `/circles/[id]/contribute` - Make contribution

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks
- **Web3**: Ready for Wagmi/Viem integration

## 📱 Features

### Wallet Management
- Create/import wallets
- View balances (cUSD, cNGN)
- Send/receive stablecoins
- Transaction history
- QR code for receiving

### Salary Streaming
- Create streams with hourly rates
- Configure payment frequency
- Auto-withdraw thresholds
- View earnings over time
- Withdraw funds

### Savings Circles
- Create Ajo or Esusu circles
- Invite members
- Track contributions
- View progress
- Make contributions

## 🔐 Security

- Recovery phrase generation and verification
- Secure password/PIN setup
- Private key encryption (ready for implementation)
- Wallet backup functionality

## 🌍 Localization Ready

Structure in place for:
- English (current)
- Swahili
- Hausa
- Yoruba
- Igbo

## 📝 Notes

- Currently uses mock data for demonstration
- Web3 integration hooks are placeholder (ready for Wagmi/Viem)
- Smart contract integration pending
- Backend API integration pending

## 🤝 Contributing

This is a Phase 1 MVP implementation. Future enhancements will include:
- Full Web3 integration with Celo
- Smart contract interactions
- Backend API integration
- Automated savings rules
- Credit profiling
- Micro-loans

## 📄 License

Private - AfriDaily Project

