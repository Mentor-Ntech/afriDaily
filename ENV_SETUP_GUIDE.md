# 🔐 Environment Variables Setup Guide

This guide will help you set up your environment variables for the AfriDaily project.

## 📁 File Structure

```
afridaily/
├── .env.example                    # Root template (optional)
├── apps/
│   ├── web/
│   │   ├── .env.example           # Web app template
│   │   └── .env.local             # ⚠️ Create this file (gitignored)
│   └── contracts/
│       ├── .env.example           # Contracts template
│       └── .env                   # ⚠️ Create this file (gitignored)
```

## 🚀 Quick Setup

### 1. Web App (Frontend)

**Location:** `apps/web/.env.local`

```bash
cd apps/web
cp .env.example .env.local
```

Then edit `.env.local` and add your WalletConnect Project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-actual-project-id
```

**How to get WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com
2. Sign up or log in
3. Click "Create New Project"
4. Enter project name: "AfriDaily"
5. Copy the Project ID
6. Paste it in your `.env.local` file

### 2. Smart Contracts

**Location:** `apps/contracts/.env`

```bash
cd apps/contracts
cp .env.example .env
```

Then edit `.env` and add your keys:

```env
PRIVATE_KEY=0xYourPrivateKeyHere
CELOSCAN_API_KEY=your-celoscan-api-key
```

**How to get CeloScan API Key:**
1. Go to https://celoscan.io/myapikey
2. Sign up or log in
3. Create a new API key
4. Copy the key
5. Paste it in your `.env` file

**⚠️ Security Warning for PRIVATE_KEY:**
- **NEVER** use your main wallet's private key
- Create a separate test wallet for development
- Only use testnet accounts for testing
- Never commit `.env` files to git (they're already gitignored)

## 📝 Required Variables

### Frontend (`apps/web/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅ Yes | WalletConnect Project ID for wallet connections |

### Contracts (`apps/contracts/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PRIVATE_KEY` | ✅ Yes (for deployment) | Private key for deploying contracts |
| `CELOSCAN_API_KEY` | ✅ Yes (for verification) | API key for contract verification |

## 🔒 Security Best Practices

1. ✅ **Always use `.env.example` as a template** - Never commit actual `.env` files
2. ✅ **Use separate wallets** - Never use your main wallet for development
3. ✅ **Testnet first** - Always test on Alfajores before mainnet
4. ✅ **Rotate keys regularly** - Change API keys periodically
5. ✅ **Use environment-specific files** - `.env.local` for local, `.env.production` for production

## 🧪 Testing Your Setup

### Test Frontend:
```bash
cd apps/web
pnpm dev
# Should start without errors
```

### Test Contracts:
```bash
cd apps/contracts
pnpm compile
# Should compile successfully
```

## 📚 Additional Resources

- [WalletConnect Cloud](https://cloud.walletconnect.com) - Get Project ID
- [CeloScan API](https://celoscan.io/myapikey) - Get API Key
- [Celo Alfajores Faucet](https://faucet.celo.org) - Get testnet tokens

## ❓ Troubleshooting

### "Module not found" errors
- Make sure you've created `.env.local` in `apps/web/`
- Restart your dev server after creating the file

### Wallet connection not working
- Check that `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
- Make sure the variable name starts with `NEXT_PUBLIC_` (required for Next.js)

### Contract deployment fails
- Verify `PRIVATE_KEY` is correct (should start with `0x`)
- Make sure you have testnet tokens (for Alfajores)
- Check that the private key matches the account with tokens

---

**Remember:** `.env` and `.env.local` files are already in `.gitignore` - your secrets are safe! 🔐

