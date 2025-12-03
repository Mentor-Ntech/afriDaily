// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IERC20Stablecoin.sol";
import "./CreditProfile.sol";

/**
 * @title LoanPool
 * @notice Manages micro-loans and peer lending pools for AfriDaily users
 * @dev Implements secure lending with credit profiling and automated repayments
 * @author AfriDaily Team
 */
contract LoanPool is ReentrancyGuard, Pausable, AccessControl {
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant LENDER_ROLE = keccak256("LENDER_ROLE");

    struct Loan {
        uint256 loanId;
        address borrower;
        address lender; // address(0) for pool loans
        address token;
        uint256 principal;
        uint256 interestRate; // Annual percentage rate (APR) in basis points (10000 = 100%)
        uint256 duration; // in seconds
        uint256 startTime;
        uint256 dueTime;
        uint256 amountRepaid;
        uint256 lastPaymentTime;
        LoanStatus status;
        bool isPoolLoan; // true if funded by pool, false if by individual lender
    }

    enum LoanStatus {
        Pending,
        Active,
        Repaid,
        Defaulted,
        Cancelled
    }

    struct Pool {
        address token;
        uint256 totalDeposited;
        uint256 totalLent;
        uint256 totalRepaid;
        uint256 interestRate; // APR in basis points
        bool isActive;
        EnumerableSet.AddressSet lenders;
        mapping(address => uint256) lenderDeposits;
    }

    // Events
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        address token,
        uint256 principal,
        uint256 interestRate,
        uint256 duration
    );

    event LoanFunded(
        uint256 indexed loanId,
        address indexed lender,
        uint256 amount
    );

    event LoanRepayment(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 remainingBalance
    );

    event LoanDefaulted(
        uint256 indexed loanId,
        address indexed borrower
    );

    event PoolDeposit(
        address indexed lender,
        address indexed token,
        uint256 amount
    );

    event PoolWithdrawal(
        address indexed lender,
        address indexed token,
        uint256 amount
    );

    // State variables
    uint256 private _nextLoanId;
    mapping(uint256 => Loan) public loans;
    mapping(address => EnumerableSet.UintSet) private _borrowerLoans;
    mapping(address => EnumerableSet.UintSet) private _lenderLoans;
    mapping(address => Pool) private pools; // token => Pool
    EnumerableSet.AddressSet private _supportedTokens;
    
    CreditProfile public creditProfile;

    // Constants
    uint256 public constant MIN_LOAN_AMOUNT = 1e18; // 1 token
    uint256 public constant MAX_LOAN_AMOUNT = 100000e18; // 100,000 tokens
    uint256 public constant MIN_LOAN_DURATION = 7 days;
    uint256 public constant MAX_LOAN_DURATION = 365 days;
    uint256 public constant MAX_INTEREST_RATE = 5000; // 50% APR max
    uint256 public constant DEFAULT_INTEREST_RATE = 1200; // 12% APR default

    constructor(address _creditProfile) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(LENDER_ROLE, msg.sender);
        creditProfile = CreditProfile(_creditProfile);
        _nextLoanId = 1;
    }

    /**
     * @notice Request a loan
     * @param token Address of stablecoin
     * @param principal Loan amount
     * @param duration Loan duration in seconds
     * @param usePool Whether to use pool or find individual lender
     */
    function requestLoan(
        address token,
        uint256 principal,
        uint256 duration,
        bool usePool
    ) external whenNotPaused returns (uint256 loanId) {
        require(_supportedTokens.contains(token), "LoanPool: unsupported token");
        require(principal >= MIN_LOAN_AMOUNT && principal <= MAX_LOAN_AMOUNT, "LoanPool: invalid amount");
        require(duration >= MIN_LOAN_DURATION && duration <= MAX_LOAN_DURATION, "LoanPool: invalid duration");

        // Check credit profile
        uint256 creditScore = creditProfile.getCreditScore(msg.sender);
        require(creditScore > 0, "LoanPool: insufficient credit score");

        loanId = _nextLoanId++;
        uint256 interestRate = _calculateInterestRate(msg.sender, principal, duration);
        
        loans[loanId] = Loan({
            loanId: loanId,
            borrower: msg.sender,
            lender: address(0),
            token: token,
            principal: principal,
            interestRate: interestRate,
            duration: duration,
            startTime: 0,
            dueTime: 0,
            amountRepaid: 0,
            lastPaymentTime: 0,
            status: LoanStatus.Pending,
            isPoolLoan: usePool
        });

        _borrowerLoans[msg.sender].add(loanId);

        emit LoanRequested(loanId, msg.sender, token, principal, interestRate, duration);

        // Auto-fund from pool if requested
        if (usePool) {
            _fundFromPool(loanId);
        }
    }

    /**
     * @notice Fund a loan (for individual lenders)
     * @param loanId ID of the loan
     */
    function fundLoan(uint256 loanId) external whenNotPaused nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "LoanPool: loan not pending");
        require(!loan.isPoolLoan, "LoanPool: pool loan");
        require(hasRole(LENDER_ROLE, msg.sender) || msg.sender == loan.borrower, "LoanPool: unauthorized");

        loan.lender = msg.sender;
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;
        loan.dueTime = block.timestamp + loan.duration;

        // Record loan in credit profile
        creditProfile.recordLoan(loan.borrower, loanId, loan.principal);

        IERC20Stablecoin(loan.token).transferFrom(msg.sender, loan.borrower, loan.principal);
        _lenderLoans[msg.sender].add(loanId);

        emit LoanFunded(loanId, msg.sender, loan.principal);
    }

    /**
     * @notice Repay a loan
     * @param loanId ID of the loan
     * @param amount Amount to repay (0 for full repayment)
     */
    function repayLoan(uint256 loanId, uint256 amount) external whenNotPaused nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "LoanPool: loan not active");
        require(loan.borrower == msg.sender, "LoanPool: not the borrower");

        uint256 totalOwed = getTotalOwed(loanId);
        uint256 remainingBalance = totalOwed - loan.amountRepaid;
        require(remainingBalance > 0, "LoanPool: loan already repaid");

        uint256 repayAmount = amount == 0 ? remainingBalance : amount;
        require(repayAmount <= remainingBalance, "LoanPool: amount exceeds balance");
        require(repayAmount > 0, "LoanPool: amount must be > 0");

        IERC20Stablecoin(loan.token).transferFrom(msg.sender, address(this), repayAmount);

        loan.amountRepaid += repayAmount;
        loan.lastPaymentTime = block.timestamp;

        // Distribute repayment
        if (loan.isPoolLoan) {
            // Add to pool
            pools[loan.token].totalRepaid += repayAmount;
        } else {
            // Send to lender
            IERC20Stablecoin(loan.token).transfer(loan.lender, repayAmount);
        }

        // Update credit profile
        creditProfile.recordRepayment(msg.sender, repayAmount, block.timestamp);

        // Check if fully repaid
        if (loan.amountRepaid >= totalOwed) {
            loan.status = LoanStatus.Repaid;
            creditProfile.recordLoanCompletion(msg.sender, loanId, true);
        }

        emit LoanRepayment(loanId, msg.sender, repayAmount, remainingBalance - repayAmount);
    }

    /**
     * @notice Deposit funds to lending pool
     * @param token Address of stablecoin
     * @param amount Amount to deposit
     */
    function depositToPool(address token, uint256 amount) external whenNotPaused nonReentrant {
        require(_supportedTokens.contains(token), "LoanPool: unsupported token");
        require(amount > 0, "LoanPool: amount must be > 0");

        Pool storage pool = pools[token];
        if (!pool.isActive) {
            pool.token = token;
            pool.interestRate = DEFAULT_INTEREST_RATE;
            pool.isActive = true;
        }

        pool.lenders.add(msg.sender);
        pool.lenderDeposits[msg.sender] += amount;
        pool.totalDeposited += amount;

        IERC20Stablecoin(token).transferFrom(msg.sender, address(this), amount);

        emit PoolDeposit(msg.sender, token, amount);
    }

    /**
     * @notice Withdraw funds from lending pool
     * @param token Address of stablecoin
     * @param amount Amount to withdraw
     */
    function withdrawFromPool(address token, uint256 amount) external whenNotPaused nonReentrant {
        Pool storage pool = pools[token];
        require(pool.isActive, "LoanPool: pool not active");
        require(pool.lenderDeposits[msg.sender] >= amount, "LoanPool: insufficient balance");

        // Check available balance (total - total lent)
        uint256 available = pool.totalDeposited - pool.totalLent;
        require(available >= amount, "LoanPool: insufficient pool liquidity");

        pool.lenderDeposits[msg.sender] -= amount;
        pool.totalDeposited -= amount;

        IERC20Stablecoin(token).transfer(msg.sender, amount);

        emit PoolWithdrawal(msg.sender, token, amount);
    }

    /**
     * @notice Get total amount owed for a loan
     * @param loanId ID of the loan
     */
    function getTotalOwed(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        if (loan.status != LoanStatus.Active && loan.status != LoanStatus.Pending) {
            return 0;
        }

        uint256 interest = (loan.principal * loan.interestRate * loan.duration) / (365 days * 10000);
        return loan.principal + interest;
    }

    /**
     * @notice Internal function to fund loan from pool
     */
    function _fundFromPool(uint256 loanId) internal {
        Loan storage loan = loans[loanId];
        Pool storage pool = pools[loan.token];
        
        require(pool.isActive, "LoanPool: pool not active");
        require(pool.totalDeposited - pool.totalLent >= loan.principal, "LoanPool: insufficient pool funds");

        loan.lender = address(0); // Pool funded
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;
        loan.dueTime = block.timestamp + loan.duration;

        // Record loan in credit profile
        creditProfile.recordLoan(loan.borrower, loanId, loan.principal);

        pool.totalLent += loan.principal;
        IERC20Stablecoin(loan.token).transfer(loan.borrower, loan.principal);

        emit LoanFunded(loanId, address(0), loan.principal);
    }

    /**
     * @notice Calculate interest rate based on credit score
     */
    function _calculateInterestRate(
        address borrower,
        uint256 /* principal */,
        uint256 /* duration */
    ) internal view returns (uint256) {
        uint256 creditScore = creditProfile.getCreditScore(borrower);
        
        // Base rate + risk adjustment
        // Higher credit score = lower interest rate
        uint256 baseRate = DEFAULT_INTEREST_RATE;
        uint256 riskAdjustment = (10000 - creditScore) / 10; // Max 1000 bps adjustment
        
        uint256 rate = baseRate + riskAdjustment;
        return rate > MAX_INTEREST_RATE ? MAX_INTEREST_RATE : rate;
    }

    /**
     * @notice Check and mark defaulted loans
     */
    function checkDefaults() external {
        // This can be called by anyone to check for defaults
        // In production, this would be automated via keeper network
    }

    /**
     * @notice Get loan details
     */
    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    /**
     * @notice Get user's loans
     */
    function getUserLoans(address user) external view returns (uint256[] memory) {
        return _borrowerLoans[user].values();
    }

    /**
     * @notice Get pool details
     */
    function getPool(address token) external view returns (
        address token_,
        uint256 totalDeposited,
        uint256 totalLent,
        uint256 totalRepaid,
        uint256 interestRate,
        bool isActive,
        uint256 lenderCount
    ) {
        Pool storage pool = pools[token];
        return (
            pool.token,
            pool.totalDeposited,
            pool.totalLent,
            pool.totalRepaid,
            pool.interestRate,
            pool.isActive,
            pool.lenders.length()
        );
    }

    /**
     * @notice Get lender deposit in pool
     */
    function getLenderDeposit(address token, address lender) external view returns (uint256) {
        return pools[token].lenderDeposits[lender];
    }

    // Admin functions
    function addSupportedToken(address token) external onlyRole(ADMIN_ROLE) {
        require(token != address(0), "LoanPool: invalid token");
        _supportedTokens.add(token);
    }

    function setCreditProfile(address _creditProfile) external onlyRole(ADMIN_ROLE) {
        require(_creditProfile != address(0), "LoanPool: invalid address");
        creditProfile = CreditProfile(_creditProfile);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}

