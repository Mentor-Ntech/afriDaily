# AfriDaily

Crypto-first mobile finance application for Africa, built on Celo blockchain.

## Project Structure

This is a monorepo using pnpm workspaces and Turbo:

```
afridaily/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── contracts/    # Hardhat smart contracts
├── package.json       # Root package.json
├── pnpm-workspace.yaml
└── turbo.json        # Turbo configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/contracts/.env.example apps/contracts/.env
```

3. Fill in your `.env` files with your private key and API keys.

### Development

#### Run Frontend

```bash
pnpm dev
```

This will start the Next.js development server at `http://localhost:3000`.

#### Compile Contracts

```bash
pnpm contracts:compile
```

#### Test Contracts

```bash
pnpm contracts:test
```

#### Deploy Contracts

Deploy to Celo Sepolia (testnet):

```bash
cd apps/contracts
pnpm deploy:sepolia
```

Deploy to Alfajores (testnet):

```bash
pnpm contracts:deploy:alfajores
```

Deploy to Celo Mainnet:

```bash
pnpm contracts:deploy:celo
```

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build artifacts
- `pnpm contracts:compile` - Compile smart contracts
- `pnpm contracts:test` - Run contract tests
- `pnpm contracts:deploy` - Deploy contracts (default network)
- `pnpm contracts:deploy:alfajores` - Deploy to Alfajores testnet
- `pnpm contracts:deploy:celo` - Deploy to Celo mainnet

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat
- **Blockchain**: Celo (Celo Sepolia testnet)
- **Package Manager**: pnpm
- **Build System**: Turbo

## Features

### ✅ Implemented

- **Wallet Management**: Connect wallet, view balances (cUSD, cNGN, CELO)
- **Salary Streaming**: Create, manage, and withdraw from streams
- **Savings Circles**: Create and manage Ajo/Esusu circles
- **Token Operations**: Send, receive, approve tokens
- **Real-time Updates**: Event listeners with polling fallback
- **Full Web3 Integration**: wagmi, viem, contract interactions

### 🚧 Future Features

- Automated savings rules
- On-chain credit profiling
- Micro-loans
- Multi-language support

## Documentation

- [Project Overview](./afridaily.md)
- [Folder Structure](./afrifolder.md)
- [Design System](./afrvirtual.md)

## License

MIT
