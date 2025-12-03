# Deployment Instructions for Celo Sepolia

## Prerequisites

1. **Private Key**: You need a wallet with CELO tokens on Celo Sepolia testnet for gas fees
2. **Get Testnet CELO**: Use the Celo Sepolia faucet: https://faucet.celo.org/alfajores (or search for Celo Sepolia faucet)

## Setup

1. **Create `.env` file** in the `apps/contracts` directory:
   ```bash
   PRIVATE_KEY=your_private_key_here
   CELOSCAN_API_KEY=your_api_key_here  # Optional, for contract verification
   ```

2. **Important**: 
   - Never commit your `.env` file to version control
   - The `.env` file is already in `.gitignore`
   - Your private key should NOT include the `0x` prefix

## Deployment Steps

### 1. Compile Contracts
```bash
cd apps/contracts
pnpm run compile
```

### 2. Deploy to Celo Sepolia
```bash
pnpm run deploy:sepolia
```

Or use the default deploy command:
```bash
pnpm run deploy
```

### 3. Verify Contracts (Optional)
After deployment, you can verify contracts on CeloScan:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Deployment Order

The contracts are deployed in the following order:
1. **CreditProfile** - Credit scoring system (no dependencies)
2. **LoanPool** - Depends on CreditProfile
3. **StreamManager** - Salary streaming (standalone)
4. **CircleVault** - Savings circles (standalone)
5. **Treasury** - Protocol treasury (standalone)

## Network Configuration

- **Network**: Celo Sepolia Testnet
- **Chain ID**: 11142220
- **RPC URL**: https://forno.celo-sepolia.celo-testnet.org
- **Explorer**: https://celo-sepolia.blockscout.com

## Post-Deployment

After deployment, you'll receive contract addresses. Save these addresses as they'll be needed for:
- Frontend integration
- Contract interactions
- Testing

## Troubleshooting

1. **Insufficient funds**: Make sure your wallet has CELO tokens for gas
2. **Network errors**: Check your internet connection and RPC endpoint
3. **Compilation errors**: Run `pnpm run clean` and then `pnpm run compile`

## Security Notes

- Never share your private key
- Use a dedicated wallet for deployment
- Consider using a hardware wallet for mainnet deployments
- Always verify contracts after deployment

