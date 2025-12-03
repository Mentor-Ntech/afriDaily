// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title CreditProfile
 * @notice On-chain credit profiling system for AfriDaily users
 * @dev Tracks repayment history, loan completion, and calculates credit scores
 * @author AfriDaily Team
 */
contract CreditProfile is AccessControl {
    using EnumerableSet for EnumerableSet.UintSet;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AUTHORIZED_CONTRACT = keccak256("AUTHORIZED_CONTRACT");

    struct RepaymentRecord {
        uint256 amount;
        uint256 timestamp;
        bool onTime;
    }

    struct LoanRecord {
        uint256 loanId;
        uint256 principal;
        uint256 timestamp;
        bool completed;
        bool defaulted;
    }

    struct UserProfile {
        address user;
        uint256 creditScore; // 0-10000 (10000 = perfect)
        uint256 totalLoans;
        uint256 completedLoans;
        uint256 defaultedLoans;
        uint256 totalRepaid;
        uint256 onTimeRepayments;
        uint256 lateRepayments;
        uint256 lastActivityTime;
        EnumerableSet.UintSet loanIds;
        RepaymentRecord[] repaymentHistory;
    }

    // Events
    event CreditScoreUpdated(address indexed user, uint256 newScore, uint256 previousScore);
    event RepaymentRecorded(address indexed user, uint256 amount, uint256 timestamp, bool onTime);
    event LoanRecorded(address indexed user, uint256 loanId, uint256 principal);
    event LoanCompleted(address indexed user, uint256 loanId, bool success);

    // State variables
    mapping(address => UserProfile) private profiles;
    mapping(address => bool) public authorizedContracts;

    // Constants
    uint256 public constant MAX_CREDIT_SCORE = 10000;
    uint256 public constant MIN_CREDIT_SCORE = 0;
    uint256 public constant INITIAL_CREDIT_SCORE = 5000; // Start at 50%
    uint256 public constant ON_TIME_BONUS = 50; // Points for on-time payment
    uint256 public constant LATE_PENALTY = 100; // Points for late payment
    uint256 public constant COMPLETION_BONUS = 200; // Points for completing loan
    uint256 public constant DEFAULT_PENALTY = 1000; // Points for defaulting

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Record a repayment
     * @param user Address of the user
     * @param amount Amount repaid
     * @param timestamp Timestamp of repayment
     */
    function recordRepayment(
        address user,
        uint256 amount,
        uint256 timestamp
    ) external onlyRole(AUTHORIZED_CONTRACT) {
        require(user != address(0), "CreditProfile: invalid user");
        require(amount > 0, "CreditProfile: invalid amount");

        UserProfile storage profile = profiles[user];
        if (profile.user == address(0)) {
            // Initialize profile
            profile.user = user;
            profile.creditScore = INITIAL_CREDIT_SCORE;
        }

        // Determine if payment is on time (within 7 days of due date)
        // This is simplified - in production, would check against loan due date
        bool onTime = true; // Simplified for now

        profile.repaymentHistory.push(RepaymentRecord({
            amount: amount,
            timestamp: timestamp,
            onTime: onTime
        }));

        profile.totalRepaid += amount;
        profile.lastActivityTime = timestamp;

        if (onTime) {
            profile.onTimeRepayments++;
        } else {
            profile.lateRepayments++;
        }

        // Update credit score
        _updateCreditScore(user);

        emit RepaymentRecorded(user, amount, timestamp, onTime);
    }

    /**
     * @notice Record a new loan
     * @param user Address of the user
     * @param loanId ID of the loan
     * @param principal Principal amount
     */
    function recordLoan(
        address user,
        uint256 loanId,
        uint256 principal
    ) external onlyRole(AUTHORIZED_CONTRACT) {
        require(user != address(0), "CreditProfile: invalid user");
        require(principal > 0, "CreditProfile: invalid principal");

        UserProfile storage profile = profiles[user];
        if (profile.user == address(0)) {
            profile.user = user;
            profile.creditScore = INITIAL_CREDIT_SCORE;
        }

        profile.loanIds.add(loanId);
        profile.totalLoans++;
        profile.lastActivityTime = block.timestamp;

        emit LoanRecorded(user, loanId, principal);
    }

    /**
     * @notice Record loan completion
     * @param user Address of the user
     * @param loanId ID of the loan
     * @param success Whether loan was completed successfully
     */
    function recordLoanCompletion(
        address user,
        uint256 loanId,
        bool success
    ) external onlyRole(AUTHORIZED_CONTRACT) {
        require(user != address(0), "CreditProfile: invalid user");

        UserProfile storage profile = profiles[user];
        require(profile.loanIds.contains(loanId), "CreditProfile: loan not found");

        if (success) {
            profile.completedLoans++;
        } else {
            profile.defaultedLoans++;
        }

        _updateCreditScore(user);

        emit LoanCompleted(user, loanId, success);
    }

    /**
     * @notice Get credit score for a user
     * @param user Address of the user
     */
    function getCreditScore(address user) external view returns (uint256) {
        UserProfile storage profile = profiles[user];
        if (profile.user == address(0)) {
            return INITIAL_CREDIT_SCORE;
        }
        return profile.creditScore;
    }

    /**
     * @notice Get user profile
     * @param user Address of the user
     */
    function getUserProfile(address user) external view returns (
        uint256 creditScore,
        uint256 totalLoans,
        uint256 completedLoans,
        uint256 defaultedLoans,
        uint256 totalRepaid,
        uint256 onTimeRepayments,
        uint256 lateRepayments
    ) {
        UserProfile storage profile = profiles[user];
        if (profile.user == address(0)) {
            return (
                INITIAL_CREDIT_SCORE,
                0, 0, 0, 0, 0, 0
            );
        }
        return (
            profile.creditScore,
            profile.totalLoans,
            profile.completedLoans,
            profile.defaultedLoans,
            profile.totalRepaid,
            profile.onTimeRepayments,
            profile.lateRepayments
        );
    }

    /**
     * @notice Get repayment history
     * @param user Address of the user
     * @param limit Maximum number of records to return
     */
    function getRepaymentHistory(
        address user,
        uint256 limit
    ) external view returns (RepaymentRecord[] memory) {
        UserProfile storage profile = profiles[user];
        if (profile.user == address(0)) {
            return new RepaymentRecord[](0);
        }

        uint256 totalLength = profile.repaymentHistory.length;
        if (totalLength == 0) {
            return new RepaymentRecord[](0);
        }

        uint256 length = totalLength > limit ? limit : totalLength;
        RepaymentRecord[] memory history = new RepaymentRecord[](length);
        uint256 start = totalLength - length;
        
        for (uint256 i = 0; i < length; i++) {
            history[i] = profile.repaymentHistory[start + i];
        }

        return history;
    }

    /**
     * @notice Internal function to update credit score
     */
    function _updateCreditScore(address user) internal {
        UserProfile storage profile = profiles[user];
        uint256 previousScore = profile.creditScore;
        uint256 newScore = INITIAL_CREDIT_SCORE;

        // Base score adjustments
        if (profile.totalLoans > 0) {
            // Completion rate bonus
            uint256 completionRate = (profile.completedLoans * 10000) / profile.totalLoans;
            newScore += (completionRate * 20) / 100; // Up to 2000 points

            // On-time payment bonus
            uint256 totalPayments = profile.onTimeRepayments + profile.lateRepayments;
            if (totalPayments > 0) {
                uint256 onTimeRate = (profile.onTimeRepayments * 10000) / totalPayments;
                newScore += (onTimeRate * 15) / 100; // Up to 1500 points
            }

            // Default penalty
            if (profile.defaultedLoans > 0) {
                uint256 defaultRate = (profile.defaultedLoans * 10000) / profile.totalLoans;
                newScore -= (defaultRate * 30) / 100; // Up to -3000 points
            }
        }

        // Activity bonus (recent activity)
        if (profile.lastActivityTime > 0 && block.timestamp >= profile.lastActivityTime) {
            uint256 daysSinceActivity = (block.timestamp - profile.lastActivityTime) / 1 days;
            if (daysSinceActivity < 30) {
                newScore += 500; // Active user bonus
            }
        }

        // Clamp to valid range
        if (newScore > MAX_CREDIT_SCORE) {
            newScore = MAX_CREDIT_SCORE;
        }
        if (newScore < MIN_CREDIT_SCORE) {
            newScore = MIN_CREDIT_SCORE;
        }

        profile.creditScore = newScore;

        if (newScore != previousScore) {
            emit CreditScoreUpdated(user, newScore, previousScore);
        }
    }

    // Admin functions
    function authorizeContract(address contractAddress) external onlyRole(ADMIN_ROLE) {
        require(contractAddress != address(0), "CreditProfile: invalid address");
        authorizedContracts[contractAddress] = true;
        _grantRole(AUTHORIZED_CONTRACT, contractAddress);
    }

    function revokeContract(address contractAddress) external onlyRole(ADMIN_ROLE) {
        authorizedContracts[contractAddress] = false;
        _revokeRole(AUTHORIZED_CONTRACT, contractAddress);
    }
}

