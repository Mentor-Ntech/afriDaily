import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Treasury } from "../typechain-types";
import { MockERC20 } from "../typechain-types";

describe("Treasury", function () {
  async function deployFixture() {
    const [owner, treasurer1, treasurer2, recipient, depositor] = await ethers.getSigners();

    // Deploy mock token
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy("Mock cUSD", "cUSD", 18);
    await mockToken.waitForDeployment();

    // Deploy Treasury
    const TreasuryFactory = await ethers.getContractFactory("Treasury");
    const treasury = await TreasuryFactory.deploy();
    await treasury.waitForDeployment();

    // Grant treasurer roles
    const TREASURER_ROLE = await treasury.TREASURER_ROLE();
    await treasury.grantRole(TREASURER_ROLE, treasurer1.address);
    await treasury.grantRole(TREASURER_ROLE, treasurer2.address);

    // Mint tokens to depositor
    const mintAmount = ethers.parseEther("100000");
    await mockToken.mint(depositor.address, mintAmount);

    return {
      treasury,
      mockToken,
      owner,
      treasurer1,
      treasurer2,
      recipient,
      depositor,
    };
  }

  describe("Deployment", function () {
    it("Should set the right admin roles", async function () {
      const { treasury, owner } = await loadFixture(deployFixture);
      const ADMIN_ROLE = await treasury.ADMIN_ROLE();
      expect(await treasury.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should have correct default values", async function () {
      const { treasury } = await loadFixture(deployFixture);
      expect(await treasury.minApprovals()).to.equal(2n);
      expect(await treasury.timelockDuration()).to.equal(2n * 24n * 60n * 60n); // 2 days
    });
  });

  describe("Deposits", function () {
    it("Should allow deposits", async function () {
      const { treasury, mockToken, depositor } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("10000");
      await mockToken.connect(depositor).approve(await treasury.getAddress(), amount);

      await expect(
        treasury.connect(depositor).deposit(await mockToken.getAddress(), amount)
      ).to.emit(treasury, "FundsDeposited");

      const balance = await treasury.balances(await mockToken.getAddress());
      expect(balance).to.equal(amount);
    });

    it("Should fail with invalid token", async function () {
      const { treasury, depositor } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("10000");

      await expect(
        treasury.connect(depositor).deposit(ethers.ZeroAddress, amount)
      ).to.be.revertedWith("Treasury: invalid token");
    });
  });

  describe("Withdrawal Proposals", function () {
    it("Should create withdrawal proposal", async function () {
      const { treasury, mockToken, treasurer1, recipient, depositor } = await loadFixture(deployFixture);
      
      // First deposit
      const depositAmount = ethers.parseEther("10000");
      await mockToken.connect(depositor).approve(await treasury.getAddress(), depositAmount);
      await treasury.connect(depositor).deposit(await mockToken.getAddress(), depositAmount);

      const withdrawalAmount = ethers.parseEther("5000");
      const reason = "Test withdrawal";

      await expect(
        treasury.connect(treasurer1).proposeWithdrawal(
          await mockToken.getAddress(),
          recipient.address,
          withdrawalAmount,
          reason
        )
      ).to.emit(treasury, "WithdrawalProposed");

      const proposalId = 1n;
      const proposal = await treasury.getProposal(proposalId);
      expect(proposal.amount).to.equal(withdrawalAmount);
      expect(proposal.recipient).to.equal(recipient.address);
    });

    it("Should require minimum approvals", async function () {
      const { treasury, mockToken, treasurer1, treasurer2, recipient, depositor } = await loadFixture(deployFixture);
      
      // Deposit
      const depositAmount = ethers.parseEther("10000");
      await mockToken.connect(depositor).approve(await treasury.getAddress(), depositAmount);
      await treasury.connect(depositor).deposit(await mockToken.getAddress(), depositAmount);

      // Create proposal
      const withdrawalAmount = ethers.parseEther("5000");
      await treasury.connect(treasurer1).proposeWithdrawal(
        await mockToken.getAddress(),
        recipient.address,
        withdrawalAmount,
        "Test"
      );

      const proposalId = 1n;
      
      // Approve by second treasurer
      await expect(
        treasury.connect(treasurer2).approveWithdrawal(proposalId)
      ).to.emit(treasury, "WithdrawalApproved");

      // Advance time past timelock
      const timelockDuration = await treasury.timelockDuration();
      await time.increase(timelockDuration);

      // Execute withdrawal
      await expect(
        treasury.connect(treasurer1).executeWithdrawal(proposalId)
      ).to.emit(treasury, "WithdrawalExecuted");
    });

    it("Should fail if timelock not expired", async function () {
      const { treasury, mockToken, treasurer1, treasurer2, recipient, depositor } = await loadFixture(deployFixture);
      
      // Deposit
      const depositAmount = ethers.parseEther("10000");
      await mockToken.connect(depositor).approve(await treasury.getAddress(), depositAmount);
      await treasury.connect(depositor).deposit(await mockToken.getAddress(), depositAmount);

      // Create proposal
      const withdrawalAmount = ethers.parseEther("5000");
      await treasury.connect(treasurer1).proposeWithdrawal(
        await mockToken.getAddress(),
        recipient.address,
        withdrawalAmount,
        "Test"
      );

      const proposalId = 1n;
      await treasury.connect(treasurer2).approveWithdrawal(proposalId);

      // Try to execute before timelock expires
      await expect(
        treasury.connect(treasurer1).executeWithdrawal(proposalId)
      ).to.be.revertedWith("Treasury: timelock not expired");
    });
  });
});

