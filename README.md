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
cp .env.example .env
```

3. Fill in your `.env` file with your private key and API keys.

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
- **Blockchain**: Celo
- **Package Manager**: pnpm
- **Build System**: Turbo

## Documentation

- [Project Overview](./afridaily.md)
- [Folder Structure](./afrifolder.md)
- [Design System](./afrvirtual.md)

## License

MIT

