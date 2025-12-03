# AfriDaily Contracts - Celo Sepolia Deployment

**Deployment Date:** December 3, 2025  
**Network:** Celo Sepolia Testnet  
**Chain ID:** 11142220  
**Deployer Address:** 0x5c7e85c6e93570Ba4f45e41aB41ee8e06e14772F

## Contract Addresses

### CreditProfile
- **Address:** `0x8eF59e8Bff9ae9ca27eb7C031CfBE915C5d335Dc`
- **Explorer:** https://celo-sepolia.blockscout.com/address/0x8eF59e8Bff9ae9ca27eb7C031CfBE915C5d335Dc
- **Description:** On-chain credit profiling system for tracking user credit scores

### LoanPool
- **Address:** `0x7d6Dadd13bAe7f361D442BFb42F966127019054a`
- **Explorer:** https://celo-sepolia.blockscout.com/address/0x7d6Dadd13bAe7f361D442BFb42F966127019054a
- **Description:** Micro-loans and peer lending pool management
- **Dependencies:** CreditProfile

### StreamManager
- **Address:** `0x2A1E6591867e030F91560aB4782738B590C0fe5C`
- **Explorer:** https://celo-sepolia.blockscout.com/address/0x2A1E6591867e030F91560aB4782738B590C0fe5C
- **Description:** Salary streaming for crypto earners

### CircleVault
- **Address:** `0x99F06936A62c3f96fe7cB697FF3c49F75ADa3761`
- **Explorer:** https://celo-sepolia.blockscout.com/address/0x99F06936A62c3f96fe7cB697FF3c49F75ADa3761
- **Description:** Savings circles (Ajo/Esusu) for peer savings groups

### Treasury
- **Address:** `0x897588900F28bC93bAb039D64B33A70bf49F6BaB`
- **Explorer:** https://celo-sepolia.blockscout.com/address/0x897588900F28bC93bAb039D64B33A70bf49F6BaB
- **Description:** Protocol treasury with multi-signature controls

## Network Information

- **RPC URL:** https://forno.celo-sepolia.celo-testnet.org
- **Explorer:** https://celo-sepolia.blockscout.com
- **Chain ID:** 11142220
- **Currency:** CELO

## Next Steps

1. **Frontend Integration:**
   - Update your frontend `.env` file with these contract addresses
   - Configure your wagmi/RainbowKit setup to use these addresses

2. **Contract Verification (Optional):**
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
   ```

3. **Testing:**
   - Test contract interactions on the testnet
   - Verify all functions work as expected

4. **Documentation:**
   - Update API documentation with contract addresses
   - Share addresses with your team

## Security Notes

- These are testnet deployments - do not use for production
- Always verify contracts before mainnet deployment
- Keep your private keys secure and never commit them

