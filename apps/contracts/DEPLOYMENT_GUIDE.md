# 🚀 AfriDaily Smart Contracts - Deployment Guide

## 🌐 Target Network: Celo Sepolia Testnet

**Network Details:**
- **Chain ID**: 11142220
- **RPC URL**: `https://forno.celo-sepolia.celo-testnet.org`
- **Explorer**: `https://celo-sepolia.blockscout.com`
- **Faucet**: Get testnet tokens from Celo Sepolia faucet

## 📋 Prerequisites

1. **Environment Variables** - Create `.env` file in `apps/contracts/`:
   ```env
   PRIVATE_KEY=your-private-key-here
   CELOSCAN_API_KEY=your-celoscan-api-key-here
   ```

2. **Testnet Tokens** - Get CELO tokens for gas:
   - Visit Celo Sepolia faucet
   - Request testnet tokens to your deployment address

## 🚀 Deployment Steps

### Step 1: Set Up Environment

```bash
cd apps/contracts
cp .env.example .env
# Edit .env and add your PRIVATE_KEY and CELOSCAN_API_KEY
```

### Step 2: Compile Contracts

```bash
pnpm compile
```

### Step 3: Deploy to Celo Sepolia

```bash
# Deploy all contracts to Celo Sepolia
pnpm deploy:sepolia

# Or use the default (now set to sepolia)
pnpm deploy
```

### Step 4: Verify Contracts (Optional)

After deployment, verify contracts on the explorer:

```bash
pnpm verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 📦 Deployment Order

The deployment script (`ignition/modules/AfriDailyDeploy.ts`) deploys in this order:

1. **CreditProfile** - Standalone, no dependencies
2. **LoanPool** - Depends on CreditProfile
3. **StreamManager** - Standalone
4. **CircleVault** - Standalone
5. **Treasury** - Standalone

## 📝 Deployment Output

After successful deployment, you'll receive:

- Contract addresses for all 5 contracts
- Transaction hashes
- Deployment artifacts saved in `ignition/deployments/`

## 🔍 Verify Deployment

1. Check transaction on explorer:
   ```
   https://celo-sepolia.blockscout.com/tx/<TX_HASH>
   ```

2. View contract on explorer:
   ```
   https://celo-sepolia.blockscout.com/address/<CONTRACT_ADDRESS>
   ```

## ⚙️ Configuration

### Network Configuration (hardhat.config.ts)

```typescript
sepolia: {
  url: "https://forno.celo-sepolia.celo-testnet.org",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  chainId: 11142220,
}
```

### Explorer Configuration

```typescript
{
  network: "sepolia",
  chainId: 11142220,
  urls: {
    apiURL: "https://api-celo-sepolia.blockscout.com/api",
    browserURL: "https://celo-sepolia.blockscout.com",
  },
}
```

## 🔐 Security Reminders

- ⚠️ **NEVER** commit your `.env` file
- ⚠️ Use a **separate test wallet** for deployment
- ⚠️ Only use **testnet accounts** for Celo Sepolia
- ⚠️ Keep your **private key secure**

## 📚 Next Steps After Deployment

1. **Initialize Contracts**:
   - Add supported tokens to StreamManager
   - Authorize LoanPool in CreditProfile
   - Set up Treasury roles

2. **Test Interactions**:
   - Create a test stream
   - Create a test circle
   - Request a test loan

3. **Update Frontend**:
   - Update contract addresses in frontend config
   - Test wallet connections
   - Test contract interactions

## 🆘 Troubleshooting

### "Insufficient funds"
- Get testnet tokens from Celo Sepolia faucet
- Ensure your account has enough CELO for gas

### "Network not found"
- Check `hardhat.config.ts` has sepolia network configured
- Verify RPC URL is correct

### "Contract verification failed"
- Check CELOSCAN_API_KEY is set correctly
- Ensure constructor arguments match

---

**Ready to deploy to Celo Sepolia! 🚀**

