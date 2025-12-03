// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IERC20Stablecoin.sol";

/**
 * @title Treasury
 * @notice Manages protocol treasury with multi-signature and time-locked controls
 * @dev Implements secure treasury management for AfriDaily protocol funds
 * @author AfriDaily Team
 */
contract Treasury is ReentrancyGuard, Pausable, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct WithdrawalProposal {
        uint256 proposalId;
        address token;
        address recipient;
        uint256 amount;
        string reason;
        uint256 proposedAt;
        uint256 executeAfter;
        bool executed;
        bool cancelled;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    // Events
    event FundsDeposited(
        address indexed token,
        address indexed from,
        uint256 amount,
        uint256 newBalance
    );

    event WithdrawalProposed(
        uint256 indexed proposalId,
        address indexed proposer,
        address token,
        address recipient,
        uint256 amount,
        string reason,
        uint256 executeAfter
    );

    event WithdrawalApproved(
        uint256 indexed proposalId,
        address indexed approver
    );

    event WithdrawalExecuted(
        uint256 indexed proposalId,
        address indexed recipient,
        uint256 amount
    );

    event WithdrawalCancelled(uint256 indexed proposalId);

    // State variables
    mapping(address => uint256) public balances; // token => balance
    mapping(uint256 => WithdrawalProposal) public proposals;
    uint256 private _nextProposalId;
    
    // Configuration
    uint256 public minApprovals = 2; // Minimum approvals required
    uint256 public timelockDuration = 2 days; // Time lock duration
    uint256 public maxWithdrawalAmount = 100000e18; // Max single withdrawal

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(TREASURER_ROLE, msg.sender);
        _nextProposalId = 1;
    }

    /**
     * @notice Deposit funds to treasury
     * @param token Address of token
     * @param amount Amount to deposit
     */
    function deposit(address token, uint256 amount) external whenNotPaused nonReentrant {
        require(token != address(0), "Treasury: invalid token");
        require(amount > 0, "Treasury: amount must be > 0");

        balances[token] += amount;
        IERC20Stablecoin(token).transferFrom(msg.sender, address(this), amount);

        emit FundsDeposited(token, msg.sender, amount, balances[token]);
    }

    /**
     * @notice Propose a withdrawal
     * @param token Address of token
     * @param recipient Address to receive funds
     * @param amount Amount to withdraw
     * @param reason Reason for withdrawal
     */
    function proposeWithdrawal(
        address token,
        address recipient,
        uint256 amount,
        string memory reason
    ) external onlyRole(TREASURER_ROLE) whenNotPaused returns (uint256 proposalId) {
        require(token != address(0), "Treasury: invalid token");
        require(recipient != address(0), "Treasury: invalid recipient");
        require(amount > 0, "Treasury: amount must be > 0");
        require(amount <= maxWithdrawalAmount, "Treasury: amount exceeds limit");
        require(balances[token] >= amount, "Treasury: insufficient balance");
        require(bytes(reason).length > 0, "Treasury: reason required");

        proposalId = _nextProposalId++;
        WithdrawalProposal storage proposal = proposals[proposalId];

        proposal.proposalId = proposalId;
        proposal.token = token;
        proposal.recipient = recipient;
        proposal.amount = amount;
        proposal.reason = reason;
        proposal.proposedAt = block.timestamp;
        proposal.executeAfter = block.timestamp + timelockDuration;
        proposal.executed = false;
        proposal.cancelled = false;
        proposal.approvals[msg.sender] = true;
        proposal.approvalCount = 1;

        emit WithdrawalProposed(proposalId, msg.sender, token, recipient, amount, reason, proposal.executeAfter);
        emit WithdrawalApproved(proposalId, msg.sender);
    }

    /**
     * @notice Approve a withdrawal proposal
     * @param proposalId ID of the proposal
     */
    function approveWithdrawal(uint256 proposalId) external onlyRole(TREASURER_ROLE) {
        WithdrawalProposal storage proposal = proposals[proposalId];
        require(proposal.proposalId > 0, "Treasury: proposal not found");
        require(!proposal.executed, "Treasury: already executed");
        require(!proposal.cancelled, "Treasury: proposal cancelled");
        require(!proposal.approvals[msg.sender], "Treasury: already approved");

        proposal.approvals[msg.sender] = true;
        proposal.approvalCount++;

        emit WithdrawalApproved(proposalId, msg.sender);
    }

    /**
     * @notice Execute a withdrawal proposal
     * @param proposalId ID of the proposal
     */
    function executeWithdrawal(uint256 proposalId) external onlyRole(TREASURER_ROLE) nonReentrant {
        WithdrawalProposal storage proposal = proposals[proposalId];
        require(proposal.proposalId > 0, "Treasury: proposal not found");
        require(!proposal.executed, "Treasury: already executed");
        require(!proposal.cancelled, "Treasury: proposal cancelled");
        require(block.timestamp >= proposal.executeAfter, "Treasury: timelock not expired");
        require(proposal.approvalCount >= minApprovals, "Treasury: insufficient approvals");
        require(balances[proposal.token] >= proposal.amount, "Treasury: insufficient balance");

        proposal.executed = true;
        balances[proposal.token] -= proposal.amount;

        IERC20Stablecoin(proposal.token).transfer(proposal.recipient, proposal.amount);

        emit WithdrawalExecuted(proposalId, proposal.recipient, proposal.amount);
    }

    /**
     * @notice Cancel a withdrawal proposal
     * @param proposalId ID of the proposal
     */
    function cancelWithdrawal(uint256 proposalId) external onlyRole(ADMIN_ROLE) {
        WithdrawalProposal storage proposal = proposals[proposalId];
        require(proposal.proposalId > 0, "Treasury: proposal not found");
        require(!proposal.executed, "Treasury: already executed");
        require(!proposal.cancelled, "Treasury: already cancelled");

        proposal.cancelled = true;

        emit WithdrawalCancelled(proposalId);
    }

    /**
     * @notice Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        uint256 proposalId_,
        address token,
        address recipient,
        uint256 amount,
        string memory reason,
        uint256 proposedAt,
        uint256 executeAfter,
        bool executed,
        bool cancelled,
        uint256 approvalCount
    ) {
        WithdrawalProposal storage proposal = proposals[proposalId];
        return (
            proposal.proposalId,
            proposal.token,
            proposal.recipient,
            proposal.amount,
            proposal.reason,
            proposal.proposedAt,
            proposal.executeAfter,
            proposal.executed,
            proposal.cancelled,
            proposal.approvalCount
        );
    }

    /**
     * @notice Check if address approved a proposal
     */
    function hasApproved(uint256 proposalId, address approver) external view returns (bool) {
        return proposals[proposalId].approvals[approver];
    }

    // Admin functions
    function setMinApprovals(uint256 _minApprovals) external onlyRole(ADMIN_ROLE) {
        require(_minApprovals > 0, "Treasury: invalid approvals");
        minApprovals = _minApprovals;
    }

    function setTimelockDuration(uint256 _duration) external onlyRole(ADMIN_ROLE) {
        require(_duration >= 1 days, "Treasury: duration too short");
        timelockDuration = _duration;
    }

    function setMaxWithdrawalAmount(uint256 _amount) external onlyRole(ADMIN_ROLE) {
        require(_amount > 0, "Treasury: invalid amount");
        maxWithdrawalAmount = _amount;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}

