# 📁 Environment Files Structure

## Current Setup ✅

```
afridaily/
├── apps/
│   ├── web/
│   │   ├── .env.example          # Template (safe to commit)
│   │   └── .env.local            # Your actual keys (gitignored) ⚠️
│   │
│   └── contracts/
│       ├── .env.example          # Template (safe to commit)
│       └── .env                  # Your actual keys (gitignored) ⚠️
```

## File Locations

### Frontend: `apps/web/`

- **`.env.example`** - Template file (committed to git)
  - Contains placeholders and instructions
  - Safe to share and commit
  
- **`.env.local`** - Your actual environment variables (NOT committed)
  - Contains your real API keys and secrets
  - Automatically loaded by Next.js
  - Already in `.gitignore` ✅

### Contracts: `apps/contracts/`

- **`.env.example`** - Template file (committed to git)
  - Contains placeholders and instructions
  - Safe to share and commit
  
- **`.env`** - Your actual environment variables (NOT committed)
  - Contains your private key and API keys
  - Used by Hardhat for deployment
  - Already in `.gitignore` ✅

## Current Values

### Frontend (`.env.local`)
- ✅ `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Set with your actual Project ID
- ✅ `CELO_RPC_URL` - Set to Celo mainnet RPC

### Contracts (`.env`)
- ⚠️ Create this file from `.env.example` when ready to deploy

## Quick Commands

### View your current setup:
```bash
# Frontend
cat apps/web/.env.local

# Contracts (if exists)
cat apps/contracts/.env
```

### Create contracts .env from template:
```bash
cd apps/contracts
cp .env.example .env
# Then edit .env and add your actual keys
```

## Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ `.env` is in `.gitignore`
- ✅ `.env.example` files contain only placeholders
- ✅ Never commit actual API keys or private keys
- ✅ Use separate test wallets for development

---

**Your environment files are properly organized! 🎉**

