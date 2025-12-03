# Setup for Celo Sepolia Deployment

## Step 1: Create .env File

Create a `.env` file in the `apps/contracts` directory with the following content:

```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
CELOSCAN_API_KEY=your_celoscan_api_key_optional
```

**Important:**
- Your private key should NOT include the `0x` prefix
- Never commit the `.env` file to version control (it's already in `.gitignore`)
- Use a wallet with CELO tokens on Celo Sepolia for gas fees

## Step 2: Get Testnet CELO

You need CELO tokens on Celo Sepolia testnet for gas fees. You can get them from:
- Celo Sepolia Faucet: Search for "Celo Sepolia faucet" or check Celo documentation
- Or use the Alfajores faucet and bridge if needed

## Step 3: Deploy Contracts

Once your `.env` file is set up with your private key, run:

```bash
cd apps/contracts
pnpm run deploy:sepolia
```

Or use the deployment script:
```bash
./scripts/deploy-sepolia.sh
```

## Deployment Order

The contracts will be deployed in this order:
1. **CreditProfile** - Credit scoring system
2. **LoanPool** - Micro-loans (depends on CreditProfile)
3. **StreamManager** - Salary streaming
4. **CircleVault** - Savings circles
5. **Treasury** - Protocol treasury

## Network Information

- **Network**: Celo Sepolia Testnet
- **Chain ID**: 11142220
- **RPC URL**: https://forno.celo-sepolia.celo-testnet.org
- **Explorer**: https://celo-sepolia.blockscout.com

## After Deployment

Save the contract addresses from the deployment output. You'll need them for:
- Frontend integration
- Contract interactions
- Testing

## Troubleshooting

1. **"PRIVATE_KEY not set"**: Make sure your `.env` file exists and contains your private key
2. **"Insufficient funds"**: Ensure your wallet has CELO tokens for gas
3. **Network errors**: Check your internet connection and RPC endpoint

