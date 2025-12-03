import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Deploying AfriDaily contracts to Celo Sepolia...\n");

  // Get the deployer account
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers found. Please check your PRIVATE_KEY in .env file.");
  }
  const deployer = signers[0];
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO\n");

  if (balance === 0n) {
    throw new Error("Insufficient balance. Please fund your account with CELO tokens.");
  }

  // Deploy CreditProfile first
  console.log("📄 Deploying CreditProfile...");
  const CreditProfileFactory = await ethers.getContractFactory("CreditProfile");
  const creditProfile = await CreditProfileFactory.deploy();
  await creditProfile.waitForDeployment();
  const creditProfileAddress = await creditProfile.getAddress();
  console.log("✅ CreditProfile deployed to:", creditProfileAddress);
  console.log("   Explorer: https://celo-sepolia.blockscout.com/address/" + creditProfileAddress + "\n");

  // Deploy LoanPool (depends on CreditProfile)
  console.log("📄 Deploying LoanPool...");
  const LoanPoolFactory = await ethers.getContractFactory("LoanPool");
  const loanPool = await LoanPoolFactory.deploy(creditProfileAddress);
  await loanPool.waitForDeployment();
  const loanPoolAddress = await loanPool.getAddress();
  console.log("✅ LoanPool deployed to:", loanPoolAddress);
  console.log("   Explorer: https://celo-sepolia.blockscout.com/address/" + loanPoolAddress + "\n");

  // Deploy StreamManager
  console.log("📄 Deploying StreamManager...");
  const StreamManagerFactory = await ethers.getContractFactory("StreamManager");
  const streamManager = await StreamManagerFactory.deploy();
  await streamManager.waitForDeployment();
  const streamManagerAddress = await streamManager.getAddress();
  console.log("✅ StreamManager deployed to:", streamManagerAddress);
  console.log("   Explorer: https://celo-sepolia.blockscout.com/address/" + streamManagerAddress + "\n");

  // Deploy CircleVault
  console.log("📄 Deploying CircleVault...");
  const CircleVaultFactory = await ethers.getContractFactory("CircleVault");
  const circleVault = await CircleVaultFactory.deploy();
  await circleVault.waitForDeployment();
  const circleVaultAddress = await circleVault.getAddress();
  console.log("✅ CircleVault deployed to:", circleVaultAddress);
  console.log("   Explorer: https://celo-sepolia.blockscout.com/address/" + circleVaultAddress + "\n");

  // Deploy Treasury
  console.log("📄 Deploying Treasury...");
  const TreasuryFactory = await ethers.getContractFactory("Treasury");
  const treasury = await TreasuryFactory.deploy();
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("✅ Treasury deployed to:", treasuryAddress);
  console.log("   Explorer: https://celo-sepolia.blockscout.com/address/" + treasuryAddress + "\n");

  // Summary
  console.log("=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network: Celo Sepolia (Chain ID: 11142220)");
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("  CreditProfile:", creditProfileAddress);
  console.log("  LoanPool:", loanPoolAddress);
  console.log("  StreamManager:", streamManagerAddress);
  console.log("  CircleVault:", circleVaultAddress);
  console.log("  Treasury:", treasuryAddress);
  console.log("=".repeat(60));
  console.log("\n✅ All contracts deployed successfully!");
  console.log("\n💡 Next steps:");
  console.log("  1. Save these addresses for frontend integration");
  console.log("  2. Verify contracts on BlockScout (optional)");
  console.log("  3. Update your frontend .env with these addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

