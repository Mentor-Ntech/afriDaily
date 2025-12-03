# ✅ AfriDaily Project Structure

## Clean Monorepo Structure

```
afridaily/
├── apps/
│   ├── web/                    # Next.js Frontend Application
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and helpers
│   │   └── public/           # Static assets
│   │
│   └── contracts/             # Hardhat Smart Contracts
│       ├── contracts/        # Solidity contracts
│       ├── test/             # Contract tests
│       └── ignition/         # Deployment modules
│
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # PNPM workspace definition
├── turbo.json                 # Turbo build system
└── tsconfig.json              # TypeScript config
```

## ✅ Only ONE of Each:

- ✅ **One `web` folder**: `apps/web/` (your Next.js frontend)
- ✅ **One `contracts` folder**: `apps/contracts/` (your Hardhat contracts)
- ✅ **One `app` folder**: `apps/web/app/` (Next.js App Router)

## 🗑️ Removed:

- ❌ Old `afri-daily-pwa-design/` folder (was just build artifacts)

## 📁 Key Directories:

### Frontend (`apps/web/`)
- `app/` - All your Next.js pages and routes
- `components/` - React components
- `hooks/` - Custom hooks (use-wallet, use-toast, etc.)
- `lib/` - Utilities (formatting, constants, utils)

### Contracts (`apps/contracts/`)
- `contracts/` - Solidity smart contracts
- `test/` - Contract tests
- `ignition/` - Deployment scripts

---

**Everything is now properly organized! 🎉**

