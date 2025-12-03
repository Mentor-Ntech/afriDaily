// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IERC20Stablecoin.sol";

/**
 * @title CircleVault
 * @notice Manages savings circles (Ajo/Esusu) for peer savings groups
 * @dev Implements rotating and fixed savings circle patterns common in African communities
 * @author AfriDaily Team
 */
contract CircleVault is ReentrancyGuard, Pausable, AccessControl {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum CircleType {
        Ajo,    // Rotating savings - members take turns receiving the pot
        Esusu   // Fixed monthly - all members contribute, payout at end
    }

    enum ContributionStatus {
        Pending,
        Paid,
        Late,
        Defaulted
    }

    struct Member {
        address memberAddress;
        uint256 totalContributed;
        uint256 lastContributionTime;
        ContributionStatus status;
        bool hasReceivedPayout; // For Ajo circles
        uint256 payoutOrder; // For Ajo circles
    }

    struct Circle {
        uint256 circleId;
        string name;
        CircleType circleType;
        address creator;
        address token; // cUSD or cNGN
        uint256 contributionAmount;
        uint256 contributionFrequency; // in seconds
        uint256 maxMembers;
        uint256 totalSaved;
        uint256 cycleNumber;
        uint256 totalCycles;
        uint256 nextContributionDeadline;
        bool isActive;
        bool isLocked; // Locked when cycle is complete
        EnumerableSet.AddressSet members;
        mapping(address => Member) memberData;
        address[] payoutOrder; // For Ajo circles
    }

    // Events
    event CircleCreated(
        uint256 indexed circleId,
        address indexed creator,
        string name,
        CircleType circleType,
        address token,
        uint256 contributionAmount
    );

    event MemberJoined(
        uint256 indexed circleId,
        address indexed member,
        uint256 memberCount
    );

    event ContributionMade(
        uint256 indexed circleId,
        address indexed member,
        uint256 amount,
        uint256 cycleNumber
    );

    event PayoutDistributed(
        uint256 indexed circleId,
        address indexed recipient,
        uint256 amount,
        uint256 cycleNumber
    );

    event CircleCompleted(uint256 indexed circleId, uint256 totalCycles);
    event CircleLocked(uint256 indexed circleId);
    event CircleUnlocked(uint256 indexed circleId);

    // State variables
    uint256 private _nextCircleId;
    mapping(uint256 => Circle) private circles;
    mapping(address => EnumerableSet.UintSet) private _userCircles;
    
    // Constants
    uint256 public constant MIN_CONTRIBUTION = 1e18; // 1 token minimum
    uint256 public constant MAX_MEMBERS = 50;
    uint256 public constant MIN_MEMBERS = 2;
    uint256 public constant MAX_CYCLE_DURATION = 365 days;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _nextCircleId = 1;
    }

    /**
     * @notice Create a new savings circle
     * @param name Name of the circle
     * @param circleType Type: Ajo (rotating) or Esusu (fixed)
     * @param token Address of stablecoin (cUSD or cNGN)
     * @param contributionAmount Amount each member contributes per cycle
     * @param contributionFrequency Frequency in seconds (e.g., 30 days = 2592000)
     * @param maxMembers Maximum number of members
     * @param totalCycles Total number of cycles
     */
    function createCircle(
        string memory name,
        CircleType circleType,
        address token,
        uint256 contributionAmount,
        uint256 contributionFrequency,
        uint256 maxMembers,
        uint256 totalCycles
    ) external whenNotPaused returns (uint256 circleId) {
        require(bytes(name).length > 0, "CircleVault: name required");
        require(token != address(0), "CircleVault: invalid token");
        require(contributionAmount >= MIN_CONTRIBUTION, "CircleVault: contribution too low");
        require(contributionFrequency > 0, "CircleVault: invalid frequency");
        require(contributionFrequency <= MAX_CYCLE_DURATION, "CircleVault: frequency too long");
        require(maxMembers >= MIN_MEMBERS && maxMembers <= MAX_MEMBERS, "CircleVault: invalid member count");
        require(totalCycles > 0, "CircleVault: cycles must be > 0");

        circleId = _nextCircleId++;
        Circle storage circle = circles[circleId];

        circle.circleId = circleId;
        circle.name = name;
        circle.circleType = circleType;
        circle.creator = msg.sender;
        circle.token = token;
        circle.contributionAmount = contributionAmount;
        circle.contributionFrequency = contributionFrequency;
        circle.maxMembers = maxMembers;
        circle.totalCycles = totalCycles;
        circle.cycleNumber = 1;
        circle.nextContributionDeadline = block.timestamp + contributionFrequency;
        circle.isActive = true;
        circle.isLocked = false;

        // Creator is first member
        circle.members.add(msg.sender);
        circle.memberData[msg.sender] = Member({
            memberAddress: msg.sender,
            totalContributed: 0,
            lastContributionTime: 0,
            status: ContributionStatus.Pending,
            hasReceivedPayout: false,
            payoutOrder: 0
        });

        if (circleType == CircleType.Ajo) {
            circle.payoutOrder.push(msg.sender);
        }

        _userCircles[msg.sender].add(circleId);

        emit CircleCreated(circleId, msg.sender, name, circleType, token, contributionAmount);
        emit MemberJoined(circleId, msg.sender, 1);
    }

    /**
     * @notice Join an existing circle
     * @param circleId ID of the circle
     */
    function joinCircle(uint256 circleId) external whenNotPaused {
        Circle storage circle = circles[circleId];
        require(circle.isActive, "CircleVault: circle not active");
        require(!circle.isLocked, "CircleVault: circle is locked");
        require(circle.members.length() < circle.maxMembers, "CircleVault: circle full");
        require(!circle.members.contains(msg.sender), "CircleVault: already a member");

        circle.members.add(msg.sender);
        circle.memberData[msg.sender] = Member({
            memberAddress: msg.sender,
            totalContributed: 0,
            lastContributionTime: 0,
            status: ContributionStatus.Pending,
            hasReceivedPayout: false,
            payoutOrder: 0
        });

        if (circle.circleType == CircleType.Ajo) {
            circle.payoutOrder.push(msg.sender);
        }

        _userCircles[msg.sender].add(circleId);

        emit MemberJoined(circleId, msg.sender, circle.members.length());
    }

    /**
     * @notice Make a contribution to the circle
     * @param circleId ID of the circle
     */
    function contribute(uint256 circleId) external whenNotPaused nonReentrant {
        Circle storage circle = circles[circleId];
        require(circle.isActive, "CircleVault: circle not active");
        require(!circle.isLocked, "CircleVault: circle is locked");
        require(circle.members.contains(msg.sender), "CircleVault: not a member");
        
        Member storage member = circle.memberData[msg.sender];
        require(
            member.status == ContributionStatus.Pending || 
            member.status == ContributionStatus.Late,
            "CircleVault: already contributed this cycle"
        );

        // Transfer contribution
        IERC20Stablecoin(circle.token).transferFrom(
            msg.sender,
            address(this),
            circle.contributionAmount
        );

        member.totalContributed += circle.contributionAmount;
        member.lastContributionTime = block.timestamp;
        member.status = ContributionStatus.Paid;
        circle.totalSaved += circle.contributionAmount;

        emit ContributionMade(circleId, msg.sender, circle.contributionAmount, circle.cycleNumber);

        // Check if all members have contributed
        _checkCycleCompletion(circleId);
    }

    /**
     * @notice Distribute payout for Ajo circle (rotating)
     * @param circleId ID of the circle
     */
    function distributeAjoPayout(uint256 circleId) external whenNotPaused nonReentrant {
        Circle storage circle = circles[circleId];
        require(circle.isActive, "CircleVault: circle not active");
        require(circle.circleType == CircleType.Ajo, "CircleVault: not an Ajo circle");
        require(circle.members.length() == circle.maxMembers, "CircleVault: circle not full");
        
        // Check if all members have contributed
        bool allContributed = true;
        for (uint256 i = 0; i < circle.payoutOrder.length; i++) {
            address memberAddr = circle.payoutOrder[i];
            if (circle.memberData[memberAddr].status != ContributionStatus.Paid) {
                allContributed = false;
                break;
            }
        }
        require(allContributed, "CircleVault: not all members contributed");

        // Determine who gets the payout this cycle
        uint256 payoutIndex = (circle.cycleNumber - 1) % circle.payoutOrder.length;
        address recipient = circle.payoutOrder[payoutIndex];
        Member storage recipientMember = circle.memberData[recipient];

        require(!recipientMember.hasReceivedPayout, "CircleVault: already received payout");

        uint256 payoutAmount = circle.totalSaved;
        require(payoutAmount > 0, "CircleVault: no funds to distribute");

        // Reset for next cycle
        circle.totalSaved = 0;
        for (uint256 i = 0; i < circle.payoutOrder.length; i++) {
            circle.memberData[circle.payoutOrder[i]].status = ContributionStatus.Pending;
        }
        recipientMember.hasReceivedPayout = true;

        // Transfer payout
        IERC20Stablecoin(circle.token).transfer(recipient, payoutAmount);

        emit PayoutDistributed(circleId, recipient, payoutAmount, circle.cycleNumber);

        // Move to next cycle
        circle.cycleNumber++;
        if (circle.cycleNumber > circle.totalCycles) {
            circle.isActive = false;
            emit CircleCompleted(circleId, circle.totalCycles);
        } else {
            circle.nextContributionDeadline = block.timestamp + circle.contributionFrequency;
        }
    }

    /**
     * @notice Distribute payout for Esusu circle (fixed monthly)
     * @param circleId ID of the circle
     */
    function distributeEsusuPayout(uint256 circleId) external whenNotPaused nonReentrant {
        Circle storage circle = circles[circleId];
        require(circle.isActive, "CircleVault: circle not active");
        require(circle.circleType == CircleType.Esusu, "CircleVault: not an Esusu circle");
        require(circle.cycleNumber > circle.totalCycles, "CircleVault: cycles not complete");
        require(!circle.isLocked, "CircleVault: already distributed");

        uint256 totalPayout = circle.totalSaved;
        require(totalPayout > 0, "CircleVault: no funds to distribute");

        uint256 payoutPerMember = totalPayout / circle.members.length();
        circle.isLocked = true;

        // Distribute to all members equally
        address[] memory members = circle.members.values();
        for (uint256 i = 0; i < members.length; i++) {
            IERC20Stablecoin(circle.token).transfer(members[i], payoutPerMember);
            emit PayoutDistributed(circleId, members[i], payoutPerMember, circle.cycleNumber);
        }

        circle.totalSaved = 0;
        circle.isActive = false;
        emit CircleCompleted(circleId, circle.totalCycles);
    }

    /**
     * @notice Internal function to check cycle completion
     */
    function _checkCycleCompletion(uint256 circleId) internal {
        Circle storage circle = circles[circleId];
        
        bool allContributed = true;
        address[] memory members = circle.members.values();
        for (uint256 i = 0; i < members.length; i++) {
            if (circle.memberData[members[i]].status != ContributionStatus.Paid) {
                allContributed = false;
                break;
            }
        }

        if (allContributed && circle.circleType == CircleType.Ajo) {
            // For Ajo, payout can be distributed
            // This is handled by distributeAjoPayout
        } else if (allContributed && circle.circleType == CircleType.Esusu) {
            // For Esusu, move to next cycle
            circle.cycleNumber++;
            if (circle.cycleNumber > circle.totalCycles) {
                // Ready for final payout
            } else {
                // Reset for next cycle
                for (uint256 i = 0; i < members.length; i++) {
                    circle.memberData[members[i]].status = ContributionStatus.Pending;
                }
                circle.nextContributionDeadline = block.timestamp + circle.contributionFrequency;
            }
        }
    }

    /**
     * @notice Get circle details
     */
    function getCircle(uint256 circleId) external view returns (
        uint256 circleId_,
        string memory name,
        CircleType circleType,
        address creator,
        address token,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint256 totalSaved,
        uint256 cycleNumber,
        uint256 totalCycles,
        bool isActive,
        bool isLocked,
        uint256 memberCount
    ) {
        Circle storage circle = circles[circleId];
        return (
            circle.circleId,
            circle.name,
            circle.circleType,
            circle.creator,
            circle.token,
            circle.contributionAmount,
            circle.maxMembers,
            circle.totalSaved,
            circle.cycleNumber,
            circle.totalCycles,
            circle.isActive,
            circle.isLocked,
            circle.members.length()
        );
    }

    /**
     * @notice Get member details for a circle
     */
    function getCircleMember(uint256 circleId, address member) external view returns (
        address memberAddress,
        uint256 totalContributed,
        uint256 lastContributionTime,
        ContributionStatus status,
        bool hasReceivedPayout
    ) {
        Member memory memberData = circles[circleId].memberData[member];
        return (
            memberData.memberAddress,
            memberData.totalContributed,
            memberData.lastContributionTime,
            memberData.status,
            memberData.hasReceivedPayout
        );
    }

    /**
     * @notice Get all circles for a user
     */
    function getUserCircles(address user) external view returns (uint256[] memory) {
        return _userCircles[user].values();
    }

    /**
     * @notice Get all members of a circle
     */
    function getCircleMembers(uint256 circleId) external view returns (address[] memory) {
        return circles[circleId].members.values();
    }

    // Admin functions
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}

