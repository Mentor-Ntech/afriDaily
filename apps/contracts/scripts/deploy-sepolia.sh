#!/bin/bash

# Deployment script for Celo Sepolia
# Usage: ./scripts/deploy-sepolia.sh

set -e

echo "🚀 Deploying AfriDaily contracts to Celo Sepolia..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create a .env file with your PRIVATE_KEY"
    echo "   You can copy .env.template to .env and add your private key"
    exit 1
fi

# Check if PRIVATE_KEY is set
if ! grep -q "PRIVATE_KEY=" .env || grep -q "PRIVATE_KEY=$" .env || grep -q "PRIVATE_KEY=your_private_key_here" .env; then
    echo "❌ Error: PRIVATE_KEY not set in .env file!"
    echo "📝 Please add your private key to the .env file"
    exit 1
fi

# Compile contracts
echo "📦 Compiling contracts..."
pnpm run compile

# Deploy to Celo Sepolia
echo ""
echo "🌐 Deploying to Celo Sepolia testnet..."
pnpm run deploy:sepolia

echo ""
echo "✅ Deployment complete!"
echo "📋 Check the deployment output above for contract addresses"

