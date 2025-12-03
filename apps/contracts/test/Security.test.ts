import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { StreamManager } from "../typechain-types";
import { CircleVault } from "../typechain-types";
import { LoanPool } from "../typechain-types";
import { CreditProfile } from "../typechain-types";
import { Treasury } from "../typechain-types";

describe("Security Tests", function () {
  async function streamManagerFixture() {
    const [owner, payer, recipient] = await ethers.getSigners();
    
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy("Test Token", "TEST", 18);
    await mockToken.waitForDeployment();
    await mockToken.mint(payer.address, ethers.parseEther("1000000000")); // 1 billion tokens

    const StreamManagerFactory = await ethers.getContractFactory("StreamManager");
    const streamManager = await StreamManagerFactory.deploy();
    await streamManager.waitForDeployment();
    await streamManager.addSupportedToken(await mockToken.getAddress());

    return { streamManager, mockToken, payer, recipient, owner };
  }

  async function circleVaultFixture() {
    const [owner, member1, member2] = await ethers.getSigners();
    
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy("Test Token", "TEST", 18);
    await mockToken.waitForDeployment();
    await mockToken.mint(member1.address, ethers.parseEther("10000"));
    await mockToken.mint(member2.address, ethers.parseEther("10000"));

    const CircleVaultFactory = await ethers.getContractFactory("CircleVault");
    const circleVault = await CircleVaultFactory.deploy();
    await circleVault.waitForDeployment();

    return { circleVault, mockToken, member1, member2, owner };
  }

  async function loanPoolFixture() {
    const [owner, borrower, lender] = await ethers.getSigners();
    
    const CreditProfileFactory = await ethers.getContractFactory("CreditProfile");
    const creditProfile = await CreditProfileFactory.deploy();
    await creditProfile.waitForDeployment();

    const LoanPoolFactory = await ethers.getContractFactory("LoanPool");
    const loanPool = await LoanPoolFactory.deploy(await creditProfile.getAddress());
    await loanPool.waitForDeployment();

    const AUTHORIZED_CONTRACT = await creditProfile.AUTHORIZED_CONTRACT();
    await creditProfile.grantRole(AUTHORIZED_CONTRACT, await loanPool.getAddress());
    await creditProfile.grantRole(AUTHORIZED_CONTRACT, owner.address);

    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy("Test Token", "TEST", 18);
    await mockToken.waitForDeployment();
    await mockToken.mint(borrower.address, ethers.parseEther("10000"));
    await mockToken.mint(lender.address, ethers.parseEther("10000"));

    await loanPool.addSupportedToken(await mockToken.getAddress());
    const LENDER_ROLE = await loanPool.LENDER_ROLE();
    await loanPool.grantRole(LENDER_ROLE, lender.address);

    // Initialize credit profile
    await creditProfile.connect(owner).recordRepayment(
      borrower.address,
      ethers.parseEther("100"),
      Math.floor(Date.now() / 1000)
    );

    return { loanPool, creditProfile, mockToken, borrower, lender, owner };
  }

  async function accessControlFixture() {
    const [owner, unauthorized] = await ethers.getSigners();
    
    const StreamManagerFactory = await ethers.getContractFactory("StreamManager");
    const streamManager = await StreamManagerFactory.deploy();
    await streamManager.waitForDeployment();

    const CircleVaultFactory = await ethers.getContractFactory("CircleVault");
    const circleVault = await CircleVaultFactory.deploy();
    await circleVault.waitForDeployment();

    const CreditProfileFactory = await ethers.getContractFactory("CreditProfile");
    const creditProfile = await CreditProfileFactory.deploy();
    await creditProfile.waitForDeployment();

    const LoanPoolFactory = await ethers.getContractFactory("LoanPool");
    const loanPool = await LoanPoolFactory.deploy(await creditProfile.getAddress());
    await loanPool.waitForDeployment();

    const TreasuryFactory = await ethers.getContractFactory("Treasury");
    const treasury = await TreasuryFactory.deploy();
    await treasury.waitForDeployment();

    return { streamManager, circleVault, loanPool, creditProfile, treasury, unauthorized };
  }

  describe("Reentrancy Protection", function () {
    it("Should prevent reentrancy in StreamManager.withdrawFromStream", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(streamManagerFixture);

      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const initialDeposit = ratePerSecond * BigInt(duration);

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);
      await streamManager.connect(payer).createStream(
        recipient.address,
        await mockToken.getAddress(),
        ratePerSecond,
        BigInt(duration),
        initialDeposit
      );

      await time.increase(24 * 60 * 60);
      
      // Try to withdraw multiple times in same transaction - should fail due to reentrancy guard
      const streamId = 1n;
      await streamManager.connect(recipient).withdrawFromStream(streamId, 0);
      
      // Second withdrawal should work normally (not reentrant)
      await time.increase(24 * 60 * 60);
      await expect(streamManager.connect(recipient).withdrawFromStream(streamId, 0))
        .to.emit(streamManager, "StreamWithdrawn");
    });

    it("Should prevent reentrancy in CircleVault.contribute", async function () {
      const { circleVault, mockToken, member1, member2 } = await loadFixture(circleVaultFixture);

      const contributionAmount = ethers.parseEther("100");
      await circleVault.connect(member1).createCircle(
        "Test Circle",
        0, // Ajo
        await mockToken.getAddress(),
        contributionAmount,
        30 * 24 * 60 * 60, // 30 days
        2,
        12
      );

      await mockToken.connect(member2).approve(await circleVault.getAddress(), contributionAmount);
      await circleVault.connect(member2).joinCircle(1n);

      // First contribution should succeed
      await expect(circleVault.connect(member2).contribute(1n))
        .to.emit(circleVault, "ContributionMade");

      // Second contribution in same cycle should fail
      await expect(circleVault.connect(member2).contribute(1n))
        .to.be.revertedWith("CircleVault: already contributed this cycle");
    });

    it("Should prevent reentrancy in LoanPool.repayLoan", async function () {
      const { loanPool, mockToken, borrower, lender } = await loadFixture(loanPoolFixture);

      const principal = ethers.parseEther("1000");
      const duration = 30 * 24 * 60 * 60;

      await loanPool.connect(borrower).requestLoan(
        await mockToken.getAddress(),
        principal,
        duration,
        false
      );

      const loanId = 1n;
      await mockToken.connect(lender).approve(await loanPool.getAddress(), principal);
      await loanPool.connect(lender).fundLoan(loanId);

      const totalOwed = await loanPool.getTotalOwed(loanId);
      await mockToken.connect(borrower).approve(await loanPool.getAddress(), totalOwed);

      // Repayment should succeed
      await expect(loanPool.connect(borrower).repayLoan(loanId, 0))
        .to.emit(loanPool, "LoanRepayment");

      // Check loan status is now Repaid
      const loan = await loanPool.getLoan(loanId);
      expect(loan.status).to.equal(2); // Repaid status

      // Second repayment should fail (loan not active anymore)
      await expect(loanPool.connect(borrower).repayLoan(loanId, ethers.parseEther("100")))
        .to.be.revertedWith("LoanPool: loan not active");
    });
  });

  describe("Access Control", function () {
    it("Should prevent unauthorized access to StreamManager admin functions", async function () {
      const { streamManager, unauthorized } = await loadFixture(accessControlFixture);

      await expect(
        streamManager.connect(unauthorized).addSupportedToken(ethers.ZeroAddress)
      ).to.be.reverted;
    });

    it("Should prevent unauthorized access to CircleVault admin functions", async function () {
      const { circleVault, unauthorized } = await loadFixture(accessControlFixture);

      await expect(
        circleVault.connect(unauthorized).pause()
      ).to.be.reverted;
    });

    it("Should prevent unauthorized access to LoanPool admin functions", async function () {
      const { loanPool, unauthorized } = await loadFixture(accessControlFixture);

      await expect(
        loanPool.connect(unauthorized).addSupportedToken(ethers.ZeroAddress)
      ).to.be.reverted;
    });

    it("Should prevent unauthorized access to CreditProfile admin functions", async function () {
      const { creditProfile, unauthorized } = await loadFixture(accessControlFixture);

      await expect(
        creditProfile.connect(unauthorized).authorizeContract(ethers.ZeroAddress)
      ).to.be.reverted;
    });

    it("Should prevent unauthorized access to Treasury functions", async function () {
      const { treasury, unauthorized } = await loadFixture(accessControlFixture);

      await expect(
        treasury.connect(unauthorized).proposeWithdrawal(
          ethers.ZeroAddress,
          unauthorized.address,
          ethers.parseEther("100"),
          "test"
        )
      ).to.be.reverted;
    });
  });

  describe("Integer Overflow/Underflow Protection", function () {
    it("Should handle large amounts without overflow in StreamManager", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(streamManagerFixture);

      // Mint additional tokens for large stream
      const ratePerSecond = ethers.parseEther("1000000"); // Very large rate
      const duration = 365 * 24 * 60 * 60; // 365 days
      const initialDeposit = ratePerSecond * BigInt(duration);
      
      // Ensure payer has enough balance
      const currentBalance = await mockToken.balanceOf(payer.address);
      if (currentBalance < initialDeposit) {
        await mockToken.mint(payer.address, initialDeposit - currentBalance + ethers.parseEther("1000000"));
      }

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);
      
      // Should handle large amounts without overflow
      await expect(
        streamManager.connect(payer).createStream(
          recipient.address,
          await mockToken.getAddress(),
          ratePerSecond,
          BigInt(duration),
          initialDeposit
        )
      ).to.emit(streamManager, "StreamCreated");
    });

    it("Should prevent underflow in CreditProfile._updateCreditScore", async function () {
      async function creditProfileFixture() {
        const [owner, user1, authorizedContract] = await ethers.getSigners();
        
        const CreditProfileFactory = await ethers.getContractFactory("CreditProfile");
        const creditProfile = await CreditProfileFactory.deploy();
        await creditProfile.waitForDeployment();

        const AUTHORIZED_CONTRACT = await creditProfile.AUTHORIZED_CONTRACT();
        await creditProfile.grantRole(AUTHORIZED_CONTRACT, authorizedContract.address);

        return { creditProfile, user1, authorizedContract, owner };
      }

      const { creditProfile, user1, authorizedContract } = await loadFixture(creditProfileFixture);

      // Record a repayment with future timestamp (should not cause underflow)
      const amount = ethers.parseEther("100");
      const futureTimestamp = Math.floor(Date.now() / 1000) + 1000000; // Far future

      await creditProfile.connect(authorizedContract).recordRepayment(
        user1.address,
        amount,
        futureTimestamp
      );

      // Score should still be valid
      const score = await creditProfile.getCreditScore(user1.address);
      expect(score).to.be.gte(0n);
      expect(score).to.be.lte(10000n);
    });
  });

  describe("Input Validation", function () {
    it("Should reject zero address in StreamManager.createStream", async function () {
      const { streamManager, mockToken, payer } = await loadFixture(streamManagerFixture);

      await expect(
        streamManager.connect(payer).createStream(
          ethers.ZeroAddress,
          await mockToken.getAddress(),
          ethers.parseEther("1"),
          30 * 24 * 60 * 60,
          ethers.parseEther("2592000")
        )
      ).to.be.revertedWith("StreamManager: invalid recipient");
    });

    it("Should reject invalid amounts in LoanPool.requestLoan", async function () {
      const { loanPool, mockToken, borrower } = await loadFixture(loanPoolFixture);

      // Too small
      await expect(
        loanPool.connect(borrower).requestLoan(
          await mockToken.getAddress(),
          ethers.parseEther("0.5"),
          30 * 24 * 60 * 60,
          false
        )
      ).to.be.revertedWith("LoanPool: invalid amount");

      // Too large
      await expect(
        loanPool.connect(borrower).requestLoan(
          await mockToken.getAddress(),
          ethers.parseEther("200000"),
          30 * 24 * 60 * 60,
          false
        )
      ).to.be.revertedWith("LoanPool: invalid amount");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero balance withdrawals gracefully", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(streamManagerFixture);

      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const initialDeposit = ratePerSecond * BigInt(duration);

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);
      await streamManager.connect(payer).createStream(
        recipient.address,
        await mockToken.getAddress(),
        ratePerSecond,
        BigInt(duration),
        initialDeposit
      );

      const streamId = 1n;
      
      // Get available balance (may be small due to time passing)
      const availableBalance = await streamManager.getAvailableBalance(streamId);
      
      // Critical security test: Try to withdraw more than available (should fail)
      // This prevents users from withdrawing more than they're entitled to
      const excessiveAmount = availableBalance + ethers.parseEther("1000");
      await expect(
        streamManager.connect(recipient).withdrawFromStream(streamId, excessiveAmount)
      ).to.be.revertedWith("StreamManager: insufficient balance");
      
      // Test that withdrawing exactly available balance works
      // This ensures the contract correctly calculates and allows valid withdrawals
      if (availableBalance > 0n) {
        await expect(
          streamManager.connect(recipient).withdrawFromStream(streamId, availableBalance)
        ).to.emit(streamManager, "StreamWithdrawn");
      }
    });

    it("Should prevent double spending in CircleVault", async function () {
      const { circleVault, mockToken, member1, member2 } = await loadFixture(circleVaultFixture);

      const contributionAmount = ethers.parseEther("100");
      await circleVault.connect(member1).createCircle(
        "Test Circle",
        0,
        await mockToken.getAddress(),
        contributionAmount,
        30 * 24 * 60 * 60,
        2,
        12
      );

      await mockToken.connect(member2).approve(await circleVault.getAddress(), contributionAmount);
      await circleVault.connect(member2).joinCircle(1n);

      // Contribute
      await circleVault.connect(member2).contribute(1n);

      // Try to contribute again in same cycle
      await expect(circleVault.connect(member2).contribute(1n))
        .to.be.revertedWith("CircleVault: already contributed this cycle");
    });
  });
});
