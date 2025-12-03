import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { StreamManager } from "../typechain-types";
import { MockERC20 } from "../typechain-types";

describe("StreamManager", function () {
  async function deployFixture() {
    const [owner, payer, recipient, otherAccount] = await ethers.getSigners();

    // Deploy mock token
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy("Mock cUSD", "cUSD", 18);
    await mockToken.waitForDeployment();

    // Deploy StreamManager
    const StreamManagerFactory = await ethers.getContractFactory("StreamManager");
    const streamManager = await StreamManagerFactory.deploy();
    await streamManager.waitForDeployment();

    // Add token as supported
    await streamManager.addSupportedToken(await mockToken.getAddress());

    // Mint tokens to payer
    const mintAmount = ethers.parseEther("10000");
    await mockToken.mint(payer.address, mintAmount);
    await mockToken.mint(owner.address, mintAmount);

    return {
      streamManager,
      mockToken,
      owner,
      payer,
      recipient,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the right admin roles", async function () {
      const { streamManager, owner } = await loadFixture(deployFixture);
      const ADMIN_ROLE = await streamManager.ADMIN_ROLE();
      expect(await streamManager.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should have correct constants", async function () {
      const { streamManager } = await loadFixture(deployFixture);
      expect(await streamManager.MIN_STREAM_DURATION()).to.equal(86400n); // 1 day
      expect(await streamManager.MAX_STREAM_DURATION()).to.equal(31536000n); // 365 days
      expect(await streamManager.MIN_RATE_PER_SECOND()).to.equal(1n);
    });
  });

  describe("Token Management", function () {
    it("Should add supported token", async function () {
      const { streamManager, mockToken } = await loadFixture(deployFixture);
      const tokenAddress = await mockToken.getAddress();
      expect(await streamManager.getSupportedTokens()).to.include(tokenAddress);
    });

    it("Should remove supported token", async function () {
      const { streamManager, mockToken, owner } = await loadFixture(deployFixture);
      const tokenAddress = await mockToken.getAddress();
      await streamManager.removeSupportedToken(tokenAddress);
      const supportedTokens = await streamManager.getSupportedTokens();
      expect(supportedTokens).to.not.include(tokenAddress);
    });
  });

  describe("Stream Creation", function () {
    it("Should create a stream successfully", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(deployFixture);
      
      const ratePerSecond = ethers.parseEther("1"); // 1 token per second
      const duration = 30 * 24 * 60 * 60; // 30 days
      const initialDeposit = ratePerSecond * BigInt(duration);

      // Ensure payer has enough balance
      const payerBalance = await mockToken.balanceOf(payer.address);
      if (payerBalance < initialDeposit) {
        await mockToken.mint(payer.address, initialDeposit - payerBalance + ethers.parseEther("1000"));
      }

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);

      await expect(
        streamManager.connect(payer).createStream(
          recipient.address,
          await mockToken.getAddress(),
          ratePerSecond,
          duration,
          initialDeposit
        )
      ).to.emit(streamManager, "StreamCreated");

      const streamId = 1n;
      const stream = await streamManager.getStream(streamId);
      expect(stream.recipient).to.equal(recipient.address);
      expect(stream.payer).to.equal(payer.address);
      expect(stream.isActive).to.be.true;
    });

    it("Should fail with invalid recipient", async function () {
      const { streamManager, mockToken, payer } = await loadFixture(deployFixture);
      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const initialDeposit = ratePerSecond * BigInt(duration);

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);

      await expect(
        streamManager.connect(payer).createStream(
          ethers.ZeroAddress,
          await mockToken.getAddress(),
          ratePerSecond,
          duration,
          initialDeposit
        )
      ).to.be.revertedWith("StreamManager: invalid recipient");
    });

    it("Should fail with insufficient deposit", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(deployFixture);
      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const requiredDeposit = ratePerSecond * BigInt(duration);
      const insufficientDeposit = requiredDeposit - 1n;

      await mockToken.connect(payer).approve(await streamManager.getAddress(), insufficientDeposit);

      await expect(
        streamManager.connect(payer).createStream(
          recipient.address,
          await mockToken.getAddress(),
          ratePerSecond,
          duration,
          insufficientDeposit
        )
      ).to.be.revertedWith("StreamManager: insufficient deposit");
    });
  });

  describe("Stream Withdrawal", function () {
    it("Should allow withdrawal of available balance", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(deployFixture);
      
      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const initialDeposit = ratePerSecond * BigInt(duration);

      // Ensure payer has enough balance
      const payerBalance = await mockToken.balanceOf(payer.address);
      if (payerBalance < initialDeposit) {
        await mockToken.mint(payer.address, initialDeposit - payerBalance + ethers.parseEther("1000"));
      }

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);
      await streamManager.connect(payer).createStream(
        recipient.address,
        await mockToken.getAddress(),
        ratePerSecond,
        duration,
        initialDeposit
      );

      // Advance time by 1 day
      await time.increase(24 * 60 * 60);
      
      const streamId = 1n;
      const availableBalance = await streamManager.getAvailableBalance(streamId);
      expect(availableBalance).to.be.gt(0);

      await expect(
        streamManager.connect(recipient).withdrawFromStream(streamId, 0)
      ).to.emit(streamManager, "StreamWithdrawn");
    });

    it("Should fail if not the recipient", async function () {
      const { streamManager, mockToken, payer, recipient, otherAccount } = await loadFixture(deployFixture);
      
      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const initialDeposit = ratePerSecond * BigInt(duration);

      // Ensure payer has enough balance
      const payerBalance = await mockToken.balanceOf(payer.address);
      if (payerBalance < initialDeposit) {
        await mockToken.mint(payer.address, initialDeposit - payerBalance + ethers.parseEther("1000"));
      }

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);
      await streamManager.connect(payer).createStream(
        recipient.address,
        await mockToken.getAddress(),
        ratePerSecond,
        duration,
        initialDeposit
      );

      await time.increase(24 * 60 * 60);
      
      const streamId = 1n;
      await expect(
        streamManager.connect(otherAccount).withdrawFromStream(streamId, ethers.parseEther("100"))
      ).to.be.revertedWith("StreamManager: not the recipient");
    });
  });

  describe("Stream Management", function () {
    it("Should pause and resume stream", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(deployFixture);
      
      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const initialDeposit = ratePerSecond * BigInt(duration);

      // Ensure payer has enough balance
      const payerBalance = await mockToken.balanceOf(payer.address);
      if (payerBalance < initialDeposit) {
        await mockToken.mint(payer.address, initialDeposit - payerBalance + ethers.parseEther("1000"));
      }

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);
      await streamManager.connect(payer).createStream(
        recipient.address,
        await mockToken.getAddress(),
        ratePerSecond,
        duration,
        initialDeposit
      );

      const streamId = 1n;
      await expect(streamManager.connect(payer).pauseStream(streamId))
        .to.emit(streamManager, "StreamPaused");

      await expect(streamManager.connect(payer).resumeStream(streamId))
        .to.emit(streamManager, "StreamResumed");
    });

    it("Should cancel stream and refund", async function () {
      const { streamManager, mockToken, payer, recipient } = await loadFixture(deployFixture);
      
      const ratePerSecond = ethers.parseEther("1");
      const duration = 30 * 24 * 60 * 60;
      const initialDeposit = ratePerSecond * BigInt(duration);

      // Ensure payer has enough balance
      const payerBalance = await mockToken.balanceOf(payer.address);
      if (payerBalance < initialDeposit) {
        await mockToken.mint(payer.address, initialDeposit - payerBalance + ethers.parseEther("1000"));
      }

      await mockToken.connect(payer).approve(await streamManager.getAddress(), initialDeposit);
      await streamManager.connect(payer).createStream(
        recipient.address,
        await mockToken.getAddress(),
        ratePerSecond,
        duration,
        initialDeposit
      );

      const streamId = 1n;
      const balanceBefore = await mockToken.balanceOf(payer.address);

      await expect(streamManager.connect(payer).cancelStream(streamId))
        .to.emit(streamManager, "StreamCancelled");

      const balanceAfter = await mockToken.balanceOf(payer.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });
});

