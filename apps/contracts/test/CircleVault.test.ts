import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { CircleVault } from "../typechain-types";
import { MockERC20 } from "../typechain-types";

describe("CircleVault", function () {
  async function deployFixture() {
    const [owner, creator, member1, member2, member3] = await ethers.getSigners();

    // Deploy mock token
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy("Mock cUSD", "cUSD", 18);
    await mockToken.waitForDeployment();

    // Deploy CircleVault
    const CircleVaultFactory = await ethers.getContractFactory("CircleVault");
    const circleVault = await CircleVaultFactory.deploy();
    await circleVault.waitForDeployment();

    // Mint tokens to members
    const mintAmount = ethers.parseEther("10000");
    await mockToken.mint(creator.address, mintAmount);
    await mockToken.mint(member1.address, mintAmount);
    await mockToken.mint(member2.address, mintAmount);
    await mockToken.mint(member3.address, mintAmount);

    return {
      circleVault,
      mockToken,
      owner,
      creator,
      member1,
      member2,
      member3,
    };
  }

  describe("Deployment", function () {
    it("Should set the right admin roles", async function () {
      const { circleVault, owner } = await loadFixture(deployFixture);
      const ADMIN_ROLE = await circleVault.ADMIN_ROLE();
      expect(await circleVault.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should have correct constants", async function () {
      const { circleVault } = await loadFixture(deployFixture);
      expect(await circleVault.MIN_CONTRIBUTION()).to.equal(ethers.parseEther("1"));
      expect(await circleVault.MAX_MEMBERS()).to.equal(50n);
      expect(await circleVault.MIN_MEMBERS()).to.equal(2n);
    });
  });

  describe("Circle Creation", function () {
    it("Should create an Ajo circle successfully", async function () {
      const { circleVault, mockToken, creator } = await loadFixture(deployFixture);
      
      const contributionAmount = ethers.parseEther("100");
      const contributionFrequency = 30 * 24 * 60 * 60; // 30 days
      const maxMembers = 3n;
      const totalCycles = 3n;

      await expect(
        circleVault.connect(creator).createCircle(
          "Family Ajo",
          0, // Ajo
          await mockToken.getAddress(),
          contributionAmount,
          contributionFrequency,
          maxMembers,
          totalCycles
        )
      ).to.emit(circleVault, "CircleCreated");

      const circleId = 1n;
      const circle = await circleVault.getCircle(circleId);
      expect(circle.name).to.equal("Family Ajo");
      expect(circle.circleType).to.equal(0); // Ajo
      expect(circle.creator).to.equal(creator.address);
    });

    it("Should create an Esusu circle successfully", async function () {
      const { circleVault, mockToken, creator } = await loadFixture(deployFixture);
      
      const contributionAmount = ethers.parseEther("100");
      const contributionFrequency = 30 * 24 * 60 * 60;
      const maxMembers = 3n;
      const totalCycles = 3n;

      await expect(
        circleVault.connect(creator).createCircle(
          "Savings Esusu",
          1, // Esusu
          await mockToken.getAddress(),
          contributionAmount,
          contributionFrequency,
          maxMembers,
          totalCycles
        )
      ).to.emit(circleVault, "CircleCreated");

      const circleId = 1n;
      const circle = await circleVault.getCircle(circleId);
      expect(circle.circleType).to.equal(1); // Esusu
    });

    it("Should fail with invalid parameters", async function () {
      const { circleVault, mockToken, creator } = await loadFixture(deployFixture);
      
      await expect(
        circleVault.connect(creator).createCircle(
          "",
          0,
          await mockToken.getAddress(),
          ethers.parseEther("100"),
          30 * 24 * 60 * 60,
          3n,
          3n
        )
      ).to.be.revertedWith("CircleVault: name required");
    });
  });

  describe("Joining Circles", function () {
    it("Should allow members to join circle", async function () {
      const { circleVault, mockToken, creator, member1 } = await loadFixture(deployFixture);
      
      const contributionAmount = ethers.parseEther("100");
      const contributionFrequency = 30 * 24 * 60 * 60;
      const maxMembers = 3n;
      const totalCycles = 3n;

      await circleVault.connect(creator).createCircle(
        "Test Circle",
        0,
        await mockToken.getAddress(),
        contributionAmount,
        contributionFrequency,
        maxMembers,
        totalCycles
      );

      const circleId = 1n;
      await expect(
        circleVault.connect(member1).joinCircle(circleId)
      ).to.emit(circleVault, "MemberJoined");

      const members = await circleVault.getCircleMembers(circleId);
      expect(members).to.include(member1.address);
    });

    it("Should fail if circle is full", async function () {
      const { circleVault, mockToken, creator, member1, member2, member3 } = await loadFixture(deployFixture);
      
      const contributionAmount = ethers.parseEther("100");
      const contributionFrequency = 30 * 24 * 60 * 60;
      const maxMembers = 3n;
      const totalCycles = 3n;

      await circleVault.connect(creator).createCircle(
        "Test Circle",
        0,
        await mockToken.getAddress(),
        contributionAmount,
        contributionFrequency,
        maxMembers,
        totalCycles
      );

      const circleId = 1n;
      await circleVault.connect(member1).joinCircle(circleId);
      await circleVault.connect(member2).joinCircle(circleId);

      await expect(
        circleVault.connect(member3).joinCircle(circleId)
      ).to.be.revertedWith("CircleVault: circle full");
    });
  });

  describe("Contributions", function () {
    it("Should allow members to contribute", async function () {
      const { circleVault, mockToken, creator, member1 } = await loadFixture(deployFixture);
      
      const contributionAmount = ethers.parseEther("100");
      const contributionFrequency = 30 * 24 * 60 * 60;
      const maxMembers = 3n;
      const totalCycles = 3n;

      await circleVault.connect(creator).createCircle(
        "Test Circle",
        0,
        await mockToken.getAddress(),
        contributionAmount,
        contributionFrequency,
        maxMembers,
        totalCycles
      );

      const circleId = 1n;
      await mockToken.connect(creator).approve(await circleVault.getAddress(), contributionAmount);

      await expect(
        circleVault.connect(creator).contribute(circleId)
      ).to.emit(circleVault, "ContributionMade");

      const member = await circleVault.getCircleMember(circleId, creator.address);
      expect(member.status).to.equal(1); // Paid
    });

    it("Should fail if not a member", async function () {
      const { circleVault, mockToken, creator, member1 } = await loadFixture(deployFixture);
      
      const contributionAmount = ethers.parseEther("100");
      const contributionFrequency = 30 * 24 * 60 * 60;
      const maxMembers = 3n;
      const totalCycles = 3n;

      await circleVault.connect(creator).createCircle(
        "Test Circle",
        0,
        await mockToken.getAddress(),
        contributionAmount,
        contributionFrequency,
        maxMembers,
        totalCycles
      );

      const circleId = 1n;
      await mockToken.connect(member1).approve(await circleVault.getAddress(), contributionAmount);

      await expect(
        circleVault.connect(member1).contribute(circleId)
      ).to.be.revertedWith("CircleVault: not a member");
    });
  });
});

