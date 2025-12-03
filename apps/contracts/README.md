# AfriDaily Smart Contracts

Secure, production-ready smart contracts for the AfriDaily platform on Celo blockchain.

## 📦 Contracts

- **StreamManager.sol** - Salary streaming functionality
- **CircleVault.sol** - Savings circles (Ajo/Esusu)
- **LoanPool.sol** - Micro-loans and peer lending
- **CreditProfile.sol** - On-chain credit profiling
- **Treasury.sol** - Treasury management with multi-sig

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Compile Contracts

```bash
pnpm compile
```

### Deploy to Celo Sepolia

```bash
# Set up environment variables first
# Create .env file with PRIVATE_KEY and CELOSCAN_API_KEY

# Deploy to Celo Sepolia testnet
pnpm deploy:sepolia
```

## 🌐 Network Configuration

**Primary Network: Celo Sepolia Testnet**
- Chain ID: 11142220
- RPC: `https://forno.celo-sepolia.celo-testnet.org`
- Explorer: `https://celo-sepolia.blockscout.com`

## 📝 Environment Variables

Create a `.env` file:

```env
PRIVATE_KEY=your-private-key-here
CELOSCAN_API_KEY=your-celoscan-api-key-here
```

## 🧪 Testing

```bash
pnpm test
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Contracts Review](./CONTRACTS_REVIEW.md)
- [Project Review Summary](./PROJECT_REVIEW_SUMMARY.md)

## 🔒 Security

All contracts include:
- Reentrancy protection
- Access control
- Emergency pause
- Input validation
- Comprehensive events

## 📄 License

MIT
