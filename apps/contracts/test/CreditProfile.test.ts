import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { CreditProfile } from "../typechain-types";

describe("CreditProfile", function () {
  async function deployFixture() {
    const [owner, user1, user2, authorizedContract] = await ethers.getSigners();

    // Deploy CreditProfile
    const CreditProfileFactory = await ethers.getContractFactory("CreditProfile");
    const creditProfile = await CreditProfileFactory.deploy();
    await creditProfile.waitForDeployment();

    // Grant authorized contract role
    const AUTHORIZED_CONTRACT = await creditProfile.AUTHORIZED_CONTRACT();
    await creditProfile.grantRole(AUTHORIZED_CONTRACT, authorizedContract.address);

    return {
      creditProfile,
      owner,
      user1,
      user2,
      authorizedContract,
    };
  }

  describe("Deployment", function () {
    it("Should set the right admin roles", async function () {
      const { creditProfile, owner } = await loadFixture(deployFixture);
      const ADMIN_ROLE = await creditProfile.ADMIN_ROLE();
      expect(await creditProfile.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should have correct constants", async function () {
      const { creditProfile } = await loadFixture(deployFixture);
      expect(await creditProfile.MAX_CREDIT_SCORE()).to.equal(10000n);
      expect(await creditProfile.INITIAL_CREDIT_SCORE()).to.equal(5000n);
    });
  });

  describe("Credit Score Management", function () {
    it("Should initialize credit score on first repayment", async function () {
      const { creditProfile, user1, authorizedContract } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      const timestamp = Math.floor(Date.now() / 1000);

      await creditProfile.connect(authorizedContract).recordRepayment(
        user1.address,
        amount,
        timestamp
      );

      const score = await creditProfile.getCreditScore(user1.address);
      // First repayment increases score due to on-time bonus (50) and activity bonus (500)
      expect(score).to.be.gte(5000n); // Should be at least initial score
    });

    it("Should update credit score on repayment", async function () {
      const { creditProfile, user1, authorizedContract } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      const timestamp = Math.floor(Date.now() / 1000);

      await creditProfile.connect(authorizedContract).recordRepayment(
        user1.address,
        amount,
        timestamp
      );

      const scoreBefore = await creditProfile.getCreditScore(user1.address);
      
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTimestamp = Math.floor(Date.now() / 1000);
      await creditProfile.connect(authorizedContract).recordRepayment(
        user1.address,
        amount,
        newTimestamp
      );

      const scoreAfter = await creditProfile.getCreditScore(user1.address);
      // Score should increase or stay the same (but not decrease for on-time payments)
      expect(scoreAfter).to.be.gte(scoreBefore);
    });

    it("Should fail if not authorized contract", async function () {
      const { creditProfile, user1 } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      const timestamp = Math.floor(Date.now() / 1000);

      await expect(
        creditProfile.connect(user1).recordRepayment(
          user1.address,
          amount,
          timestamp
        )
      ).to.be.reverted;
    });
  });

  describe("Loan Recording", function () {
    it("Should record loan", async function () {
      const { creditProfile, user1, authorizedContract } = await loadFixture(deployFixture);
      
      const loanId = 1n;
      const principal = ethers.parseEther("1000");
      const timestamp = Math.floor(Date.now() / 1000);

      await expect(
        creditProfile.connect(authorizedContract).recordLoan(
          user1.address,
          loanId,
          principal
        )
      ).to.emit(creditProfile, "LoanRecorded");

      const profile = await creditProfile.getUserProfile(user1.address);
      expect(profile.totalLoans).to.equal(1n);
    });

    it("Should record loan completion", async function () {
      const { creditProfile, user1, authorizedContract } = await loadFixture(deployFixture);
      
      const loanId = 1n;
      const principal = ethers.parseEther("1000");

      await creditProfile.connect(authorizedContract).recordLoan(
        user1.address,
        loanId,
        principal
      );

      await expect(
        creditProfile.connect(authorizedContract).recordLoanCompletion(
          user1.address,
          loanId,
          true
        )
      ).to.emit(creditProfile, "LoanCompleted");

      const profile = await creditProfile.getUserProfile(user1.address);
      expect(profile.completedLoans).to.equal(1n);
    });
  });
});

