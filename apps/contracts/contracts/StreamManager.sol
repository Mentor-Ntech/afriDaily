// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./interfaces/IERC20Stablecoin.sol";

/**
 * @title StreamManager
 * @notice Manages salary streaming for crypto earners on Celo
 * @dev Implements secure streaming with configurable pay cadence and withdrawal limits
 * @author AfriDaily Team
 */
contract StreamManager is ReentrancyGuard, Pausable, AccessControl {
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // Stream structure
    struct Stream {
        uint256 streamId;
        address recipient;
        address token; // cUSD or cNGN address
        uint256 ratePerSecond; // Amount per second
        uint256 startTime;
        uint256 stopTime;
        uint256 lastWithdrawTime;
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        address payer;
        bool isActive;
        bool isPaused;
    }

    // Events
    event StreamCreated(
        uint256 indexed streamId,
        address indexed payer,
        address indexed recipient,
        address token,
        uint256 ratePerSecond,
        uint256 startTime,
        uint256 stopTime
    );
    
    event StreamDeposited(
        uint256 indexed streamId,
        address indexed payer,
        uint256 amount,
        uint256 newBalance
    );
    
    event StreamWithdrawn(
        uint256 indexed streamId,
        address indexed recipient,
        uint256 amount,
        uint256 remainingBalance
    );
    
    event StreamPaused(uint256 indexed streamId, address indexed by);
    event StreamResumed(uint256 indexed streamId, address indexed by);
    event StreamCancelled(uint256 indexed streamId, address indexed by, uint256 refundAmount);
    event StreamUpdated(uint256 indexed streamId, uint256 newRatePerSecond);

    // State variables
    uint256 private _nextStreamId;
    mapping(uint256 => Stream) public streams;
    mapping(address => EnumerableSet.UintSet) private _userStreams;
    EnumerableSet.AddressSet private _supportedTokens;
    
    // Minimum and maximum values
    uint256 public constant MIN_STREAM_DURATION = 1 days;
    uint256 public constant MAX_STREAM_DURATION = 365 days;
    uint256 public constant MIN_RATE_PER_SECOND = 1; // Minimum 1 wei per second

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _nextStreamId = 1;
    }

    /**
     * @notice Create a new salary stream
     * @param recipient Address that will receive the streamed funds
     * @param token Address of the stablecoin token (cUSD or cNGN)
     * @param ratePerSecond Amount of tokens to stream per second
     * @param duration Duration of the stream in seconds
     * @param initialDeposit Initial deposit amount
     */
    function createStream(
        address recipient,
        address token,
        uint256 ratePerSecond,
        uint256 duration,
        uint256 initialDeposit
    ) external whenNotPaused nonReentrant returns (uint256 streamId) {
        require(recipient != address(0), "StreamManager: invalid recipient");
        require(recipient != msg.sender, "StreamManager: cannot stream to self");
        require(token != address(0), "StreamManager: invalid token");
        require(_supportedTokens.contains(token), "StreamManager: unsupported token");
        require(ratePerSecond >= MIN_RATE_PER_SECOND, "StreamManager: rate too low");
        require(duration >= MIN_STREAM_DURATION, "StreamManager: duration too short");
        require(duration <= MAX_STREAM_DURATION, "StreamManager: duration too long");
        require(initialDeposit > 0, "StreamManager: initial deposit required");

        uint256 requiredDeposit = ratePerSecond * duration;
        require(initialDeposit >= requiredDeposit, "StreamManager: insufficient deposit");

        streamId = _nextStreamId++;
        uint256 startTime = block.timestamp;
        uint256 stopTime = startTime + duration;

        streams[streamId] = Stream({
            streamId: streamId,
            recipient: recipient,
            token: token,
            ratePerSecond: ratePerSecond,
            startTime: startTime,
            stopTime: stopTime,
            lastWithdrawTime: startTime,
            totalDeposited: initialDeposit,
            totalWithdrawn: 0,
            payer: msg.sender,
            isActive: true,
            isPaused: false
        });

        _userStreams[msg.sender].add(streamId);
        _userStreams[recipient].add(streamId);

        // Transfer initial deposit
        IERC20Stablecoin(token).transferFrom(msg.sender, address(this), initialDeposit);

        emit StreamCreated(streamId, msg.sender, recipient, token, ratePerSecond, startTime, stopTime);
        emit StreamDeposited(streamId, msg.sender, initialDeposit, initialDeposit);
    }

    /**
     * @notice Add additional funds to an existing stream
     * @param streamId ID of the stream
     * @param amount Amount to deposit
     */
    function depositToStream(uint256 streamId, uint256 amount) external whenNotPaused nonReentrant {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "StreamManager: stream not active");
        require(stream.payer == msg.sender, "StreamManager: not the payer");
        require(amount > 0, "StreamManager: amount must be > 0");
        require(!stream.isPaused, "StreamManager: stream is paused");

        stream.totalDeposited += amount;
        IERC20Stablecoin(stream.token).transferFrom(msg.sender, address(this), amount);

        emit StreamDeposited(streamId, msg.sender, amount, stream.totalDeposited);
    }

    /**
     * @notice Withdraw available funds from a stream
     * @param streamId ID of the stream
     * @param amount Amount to withdraw (0 for maximum available)
     */
    function withdrawFromStream(uint256 streamId, uint256 amount) external whenNotPaused nonReentrant {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "StreamManager: stream not active");
        require(stream.recipient == msg.sender, "StreamManager: not the recipient");
        require(!stream.isPaused, "StreamManager: stream is paused");

        uint256 availableBalance = getAvailableBalance(streamId);
        require(availableBalance > 0, "StreamManager: no funds available");

        uint256 withdrawAmount = amount == 0 ? availableBalance : amount;
        require(withdrawAmount <= availableBalance, "StreamManager: insufficient balance");
        require(withdrawAmount > 0, "StreamManager: amount must be > 0");

        stream.lastWithdrawTime = block.timestamp;
        stream.totalWithdrawn += withdrawAmount;

        IERC20Stablecoin(stream.token).transfer(stream.recipient, withdrawAmount);

        emit StreamWithdrawn(streamId, stream.recipient, withdrawAmount, availableBalance - withdrawAmount);
    }

    /**
     * @notice Get available balance for withdrawal from a stream
     * @param streamId ID of the stream
     * @return Available balance
     */
    function getAvailableBalance(uint256 streamId) public view returns (uint256) {
        Stream memory stream = streams[streamId];
        if (!stream.isActive || stream.isPaused) {
            return 0;
        }

        uint256 currentTime = block.timestamp < stream.stopTime ? block.timestamp : stream.stopTime;
        uint256 elapsedTime = currentTime > stream.lastWithdrawTime 
            ? currentTime - stream.lastWithdrawTime 
            : 0;
        
        uint256 accrued = elapsedTime * stream.ratePerSecond;
        uint256 totalAvailable = stream.totalDeposited - stream.totalWithdrawn;
        
        return accrued < totalAvailable ? accrued : totalAvailable;
    }

    /**
     * @notice Pause a specific stream
     * @param streamId ID of the stream
     */
    function pauseStream(uint256 streamId) external {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "StreamManager: stream not active");
        require(
            stream.payer == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "StreamManager: unauthorized"
        );
        require(!stream.isPaused, "StreamManager: already paused");

        stream.isPaused = true;
        emit StreamPaused(streamId, msg.sender);
    }

    /**
     * @notice Resume a paused stream
     * @param streamId ID of the stream
     */
    function resumeStream(uint256 streamId) external {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "StreamManager: stream not active");
        require(
            stream.payer == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "StreamManager: unauthorized"
        );
        require(stream.isPaused, "StreamManager: not paused");

        stream.isPaused = false;
        emit StreamResumed(streamId, msg.sender);
    }

    /**
     * @notice Cancel a stream and refund remaining balance to payer
     * @param streamId ID of the stream
     */
    function cancelStream(uint256 streamId) external nonReentrant {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "StreamManager: stream not active");
        require(
            stream.payer == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "StreamManager: unauthorized"
        );

        uint256 availableBalance = getAvailableBalance(streamId);
        uint256 refundAmount = stream.totalDeposited - stream.totalWithdrawn - availableBalance;

        stream.isActive = false;

        if (refundAmount > 0) {
            IERC20Stablecoin(stream.token).transfer(stream.payer, refundAmount);
        }

        emit StreamCancelled(streamId, msg.sender, refundAmount);
    }

    /**
     * @notice Update stream rate (only payer or admin)
     * @param streamId ID of the stream
     * @param newRatePerSecond New rate per second
     */
    function updateStreamRate(uint256 streamId, uint256 newRatePerSecond) external {
        Stream storage stream = streams[streamId];
        require(stream.isActive, "StreamManager: stream not active");
        require(
            stream.payer == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "StreamManager: unauthorized"
        );
        require(newRatePerSecond >= MIN_RATE_PER_SECOND, "StreamManager: rate too low");

        stream.ratePerSecond = newRatePerSecond;
        emit StreamUpdated(streamId, newRatePerSecond);
    }

    /**
     * @notice Get stream details
     * @param streamId ID of the stream
     */
    function getStream(uint256 streamId) external view returns (Stream memory) {
        return streams[streamId];
    }

    /**
     * @notice Get all stream IDs for a user
     * @param user Address of the user
     */
    function getUserStreams(address user) external view returns (uint256[] memory) {
        return _userStreams[user].values();
    }

    // Admin functions

    /**
     * @notice Add supported token
     * @param token Address of the token
     */
    function addSupportedToken(address token) external onlyRole(ADMIN_ROLE) {
        require(token != address(0), "StreamManager: invalid token");
        _supportedTokens.add(token);
    }

    /**
     * @notice Remove supported token
     * @param token Address of the token
     */
    function removeSupportedToken(address token) external onlyRole(ADMIN_ROLE) {
        _supportedTokens.remove(token);
    }

    /**
     * @notice Pause all streams (emergency only)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause all streams
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Get list of supported tokens
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return _supportedTokens.values();
    }
}

