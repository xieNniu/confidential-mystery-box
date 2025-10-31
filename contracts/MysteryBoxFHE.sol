// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

/**
 * @title MysteryBoxFHE
 * @notice FHE-encrypted Mystery Box using Zama Protocol
 * @dev Prize amounts are fully encrypted using TFHE
 */
contract MysteryBoxFHE is GatewayCaller {
    
    // ===== Enums =====
    
    /**
     * @notice Box status enumeration
     * @dev Follows FHEVM development standards (Section 2.1)
     */
    enum BoxStatus {
        PURCHASED,        // 0 - Box purchased, not opened yet
        PENDING_DECRYPT, // 1 - Waiting for decryption request
        DECRYPTING,       // 2 - Decryption in progress (Gateway processing)
        OPENED,           // 3 - Box opened, prize revealed
        PRIZE_WITHDRAWN,  // 4 - Prize already withdrawn
        EXPIRED           // 5 - Box expired (timeout)
    }
    
    // ===== Constants =====
    
    /**
     * @notice Callback gas limit for Gateway decryption
     * @dev MUST be >= 500000 (Section 2.1 - Critical)
     */
    uint256 public constant CALLBACK_GAS_LIMIT = 500000;
    
    /**
     * @notice Request timeout duration
     * @dev Standard timeout: 30 minutes
     */
    uint256 public constant REQUEST_TIMEOUT = 30 minutes;
    
    /**
     * @notice Maximum retry attempts for decryption
     */
    uint8 public constant MAX_RETRIES = 3;
    
    // ===== Structs =====
    
    struct BoxSeries {
        uint256 id;
        string name;
        uint256 price;
        uint256 totalBoxes;
        uint256 remainingBoxes;
        address creator;
        bool isActive;
    }
    
    struct UserBox {
        uint256 boxId;
        uint256 seriesId;
        address owner;
        euint32 encryptedPrizeAmount;  // Encrypted prize amount
        BoxStatus status;               // Status using enum
        uint256 revealedPrizeAmount;    // Revealed after decryption
        uint256 purchaseTime;
        uint256 expiresAt;              // Expiration timestamp
    }
    
    /**
     * @notice Decryption request tracking structure
     * @dev Follows FHEVM development standards (Section 2.1)
     */
    struct DecryptionRequest {
        uint256 boxId;
        address requester;
        uint256 timestamp;
        uint8 retryCount;
        bool processed;
    }
    
    // ===== State Variables =====
    
    uint256 public seriesCounter;
    uint256 public boxCounter;
    
    mapping(uint256 => BoxSeries) public boxSeries;
    mapping(uint256 => UserBox) public userBoxes;
    mapping(address => uint256[]) public userBoxIds;
    
    // Decryption request tracking (Section 2.1 - Required)
    mapping(uint256 => DecryptionRequest) public decryptionRequests;
    mapping(uint256 => uint256) public requestIdToBoxId;      // requestId -> boxId
    mapping(uint256 => uint256) public boxIdToRequestId;      // boxId -> requestId (bidirectional)
    
    address public owner;
    
    // ===== Events =====
    
    event SeriesCreated(
        uint256 indexed seriesId,
        string name,
        uint256 price,
        uint256 totalBoxes
    );
    
    event BoxPurchased(
        uint256 indexed boxId,
        uint256 indexed seriesId,
        address indexed buyer
    );
    
    event BoxOpenRequested(
        uint256 indexed boxId,
        address indexed owner,
        uint256 requestId
    );
    
    event BoxOpened(
        uint256 indexed boxId,
        address indexed owner,
        uint256 prizeAmount
    );
    
    event PrizeWithdrawn(
        uint256 indexed boxId,
        address indexed owner,
        uint256 amount
    );
    
    // ===== Decryption Events (Section 2.1 - Required) =====
    
    event DecryptionRequested(
        uint256 indexed requestId,
        uint256 indexed boxId,
        uint256 timestamp
    );
    
    event DecryptionCompleted(
        uint256 indexed requestId,
        uint256 indexed boxId,
        uint256 decryptedAmount
    );
    
    event DecryptionFailed(
        uint256 indexed requestId,
        uint256 indexed boxId,
        string reason
    );
    
    event DecryptionRetrying(
        uint256 indexed requestId,
        uint256 indexed boxId,
        uint8 retryCount
    );
    
    event BoxExpired(
        uint256 indexed boxId,
        uint256 timestamp
    );
    
    // ===== Modifiers =====
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyBoxOwner(uint256 _boxId) {
        require(userBoxes[_boxId].owner == msg.sender, "Not box owner");
        _;
    }
    
    // ===== Constructor =====
    
    constructor() {
        owner = msg.sender;
    }
    
    // ===== Admin Functions =====
    
    /**
     * @notice Create a new mystery box series
     * @param _name Name of the series
     * @param _price Price per box in wei
     * @param _totalBoxes Total number of boxes
     */
    function createSeries(
        string memory _name,
        uint256 _price,
        uint256 _totalBoxes
    ) external onlyOwner {
        require(_totalBoxes > 0, "Total boxes must be > 0");
        
        seriesCounter++;
        
        boxSeries[seriesCounter] = BoxSeries({
            id: seriesCounter,
            name: _name,
            price: _price,
            totalBoxes: _totalBoxes,
            remainingBoxes: _totalBoxes,
            creator: msg.sender,
            isActive: true
        });
        
        emit SeriesCreated(seriesCounter, _name, _price, _totalBoxes);
    }
    
    /**
     * @notice Toggle series active status
     */
    function toggleSeriesActive(uint256 _seriesId) external onlyOwner {
        require(boxSeries[_seriesId].id != 0, "Series does not exist");
        boxSeries[_seriesId].isActive = !boxSeries[_seriesId].isActive;
    }
    
    // ===== User Functions =====
    
    /**
     * @notice Purchase a mystery box with encrypted prize
     * @param _seriesId The series ID to purchase from
     * @param _encryptedPrizeAmount Encrypted prize amount (from frontend)
     * @param _inputProof Proof of encryption
     */
    function purchaseBox(
        uint256 _seriesId,
        einput _encryptedPrizeAmount,
        bytes calldata _inputProof
    ) external payable {
        BoxSeries storage series = boxSeries[_seriesId];
        
        require(series.id != 0, "Series does not exist");
        require(series.isActive, "Series not active");
        require(series.remainingBoxes > 0, "No boxes remaining");
        require(msg.value == series.price, "Incorrect payment");
        
        // Convert external encrypted input to internal euint32
        euint32 prizeAmount = TFHE.asEuint32(_encryptedPrizeAmount, _inputProof);
        
        // Allow this contract to access the encrypted value
        TFHE.allow(prizeAmount, address(this));
        TFHE.allow(prizeAmount, msg.sender);
        
        boxCounter++;
        series.remainingBoxes--;
        
        userBoxes[boxCounter] = UserBox({
            boxId: boxCounter,
            seriesId: _seriesId,
            owner: msg.sender,
            encryptedPrizeAmount: prizeAmount,
            status: BoxStatus.PURCHASED,
            revealedPrizeAmount: 0,
            purchaseTime: block.timestamp,
            expiresAt: block.timestamp + REQUEST_TIMEOUT * 2  // Expires after 2x timeout
        });
        
        userBoxIds[msg.sender].push(boxCounter);
        
        emit BoxPurchased(boxCounter, _seriesId, msg.sender);
    }
    
    /**
     * @notice Open a mystery box and request decryption
     * @param _boxId The box ID to open
     * @dev Follows FHEVM development standards (Section 2.2)
     */
    function openBox(uint256 _boxId) external onlyBoxOwner(_boxId) returns (uint256 requestId) {
        UserBox storage box = userBoxes[_boxId];
        
        // 1. Verify box status (Section 2.2 - Step 1)
        require(box.status == BoxStatus.PURCHASED, "Box not in valid state");
        require(block.timestamp < box.expiresAt, "Box expired");
        require(box.owner == msg.sender, "Not your box");
        
        // Update status
        box.status = BoxStatus.PENDING_DECRYPT;
        
        // 2. Prepare encrypted value (Section 2.2 - Step 2)
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(box.encryptedPrizeAmount);
        
        // 3. Authorize Gateway (Section 2.2 - Step 3)
        TFHE.allow(box.encryptedPrizeAmount, Gateway.GatewayContractAddress());
        
        // 4. Convert to uint256 array (already done above)
        
        // 5. Request decryption (Section 2.2 - Step 5)
        requestId = Gateway.requestDecryption(
            cts,
            this.callbackOpenBox.selector,
            CALLBACK_GAS_LIMIT,  // ✅ Fixed: Use constant instead of 0
            block.timestamp + REQUEST_TIMEOUT,  // ✅ Use constant
            false
        );
        
        // 6. Record request mapping (Section 2.2 - Step 6)
        decryptionRequests[requestId] = DecryptionRequest({
            boxId: _boxId,
            requester: msg.sender,
            timestamp: block.timestamp,
            retryCount: 0,
            processed: false
        });
        
        requestIdToBoxId[requestId] = _boxId;
        boxIdToRequestId[_boxId] = requestId;
        
        // 7. Update status and emit event (Section 2.2 - Step 7)
        box.status = BoxStatus.DECRYPTING;
        
        emit BoxOpenRequested(_boxId, msg.sender, requestId);
        emit DecryptionRequested(requestId, _boxId, block.timestamp);
        
        return requestId;
    }
    
    /**
     * @notice Gateway callback after decryption
     * @param _requestId The request ID from Gateway
     * @param _decryptedPrizeAmount The decrypted prize amount
     * @dev Follows FHEVM development standards (Section 2.3)
     */
    function callbackOpenBox(
        uint256 _requestId,
        uint256 _decryptedPrizeAmount
    ) public onlyGateway {
        DecryptionRequest storage request = decryptionRequests[_requestId];
        
        // ✅ Complete verification (Section 2.3 - Required)
        require(request.timestamp > 0, "Invalid request ID");
        require(!request.processed, "Request already processed");
        require(
            block.timestamp <= request.timestamp + REQUEST_TIMEOUT,
            "Request expired"
        );
        
        uint256 boxId = request.boxId;
        UserBox storage box = userBoxes[boxId];
        
        require(
            box.status == BoxStatus.DECRYPTING || 
            box.status == BoxStatus.PENDING_DECRYPT,
            "Invalid box state"
        );
        
        // Update decryption result
        box.revealedPrizeAmount = _decryptedPrizeAmount;
        box.status = BoxStatus.OPENED;
        
        // ✅ Mark as processed (Section 2.3 - Required)
        request.processed = true;
        
        emit BoxOpened(boxId, box.owner, _decryptedPrizeAmount);
        emit DecryptionCompleted(_requestId, boxId, _decryptedPrizeAmount);
    }
    
    /**
     * @notice Withdraw prize from an opened box
     * @param _boxId The box ID to withdraw from
     */
    function withdrawPrize(uint256 _boxId) external onlyBoxOwner(_boxId) {
        UserBox storage box = userBoxes[_boxId];
        
        require(box.status == BoxStatus.OPENED, "Box not opened yet");
        require(box.revealedPrizeAmount > 0, "No prize to withdraw");
        
        uint256 amount = box.revealedPrizeAmount;
        box.revealedPrizeAmount = 0;
        box.status = BoxStatus.PRIZE_WITHDRAWN;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit PrizeWithdrawn(_boxId, msg.sender, amount);
    }
    
    // ===== View Functions =====
    
    /**
     * @notice Get series information
     */
    function getSeriesInfo(uint256 _seriesId) external view returns (
        uint256 id,
        string memory name,
        uint256 price,
        uint256 totalBoxes,
        uint256 remainingBoxes,
        address creator,
        bool isActive
    ) {
        BoxSeries memory series = boxSeries[_seriesId];
        return (
            series.id,
            series.name,
            series.price,
            series.totalBoxes,
            series.remainingBoxes,
            series.creator,
            series.isActive
        );
    }
    
    /**
     * @notice Get box information
     */
    function getBoxInfo(uint256 _boxId) external view returns (
        uint256 boxId,
        uint256 seriesId,
        address boxOwner,
        uint8 status,  // BoxStatus enum as uint8
        uint256 revealedPrizeAmount,
        uint256 purchaseTime,
        uint256 expiresAt
    ) {
        UserBox memory box = userBoxes[_boxId];
        return (
            box.boxId,
            box.seriesId,
            box.owner,
            uint8(box.status),  // Convert enum to uint8
            box.revealedPrizeAmount,
            box.purchaseTime,
            box.expiresAt
        );
    }
    
    /**
     * @notice Get all box IDs owned by a user
     */
    function getUserBoxIds(address _user) external view returns (uint256[] memory) {
        return userBoxIds[_user];
    }
    
    /**
     * @notice Get total series count
     */
    function getTotalSeries() external view returns (uint256) {
        return seriesCounter;
    }
    
    /**
     * @notice Get total box count
     */
    function getTotalBoxes() external view returns (uint256) {
        return boxCounter;
    }
    
    // ===== Owner Functions =====
    
    /**
     * @notice Deposit ETH to fund prizes
     */
    function depositPrizeFund() external payable onlyOwner {
        require(msg.value > 0, "Must deposit some ETH");
    }
    
    /**
     * @notice Withdraw remaining funds (emergency)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @notice Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // ===== Error Handling & Retry Mechanisms (Section 2.4 - Required) =====
    
    /**
     * @notice Retry decryption for a box that failed
     * @param _boxId The box ID to retry
     * @return newRequestId The new request ID for the retry
     * @dev Follows FHEVM development standards (Section 2.4)
     */
    function retryDecryption(uint256 _boxId) external returns (uint256 newRequestId) {
        uint256 oldRequestId = boxIdToRequestId[_boxId];
        DecryptionRequest storage request = decryptionRequests[oldRequestId];
        UserBox storage box = userBoxes[_boxId];
        
        require(box.owner == msg.sender, "Not box owner");
        require(
            box.status == BoxStatus.PENDING_DECRYPT || 
            box.status == BoxStatus.DECRYPTING,
            "Box not in retriable state"
        );
        require(!request.processed, "Request already processed");
        require(request.retryCount < MAX_RETRIES, "Max retries exceeded");
        require(
            block.timestamp > request.timestamp + 5 minutes,
            "Too soon to retry"
        );
        
        // Increment retry count
        request.retryCount++;
        emit DecryptionRetrying(oldRequestId, _boxId, request.retryCount);
        
        // Clear old mapping
        delete requestIdToBoxId[oldRequestId];
        delete boxIdToRequestId[_boxId];
        
        // Resubmit decryption request
        box.status = BoxStatus.PENDING_DECRYPT;
        
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(box.encryptedPrizeAmount);
        
        TFHE.allow(box.encryptedPrizeAmount, Gateway.GatewayContractAddress());
        
        newRequestId = Gateway.requestDecryption(
            cts,
            this.callbackOpenBox.selector,
            CALLBACK_GAS_LIMIT,
            block.timestamp + REQUEST_TIMEOUT,
            false
        );
        
        // Update with new request ID
        request.timestamp = block.timestamp;
        request.processed = false;
        
        decryptionRequests[newRequestId] = DecryptionRequest({
            boxId: _boxId,
            requester: msg.sender,
            timestamp: block.timestamp,
            retryCount: request.retryCount,
            processed: false
        });
        
        requestIdToBoxId[newRequestId] = _boxId;
        boxIdToRequestId[_boxId] = newRequestId;
        
        box.status = BoxStatus.DECRYPTING;
        
        emit DecryptionRequested(newRequestId, _boxId, block.timestamp);
        
        return newRequestId;
    }
    
    /**
     * @notice Cancel expired box and mark as expired
     * @param _boxId The box ID to cancel
     * @dev Follows FHEVM development standards (Section 2.4)
     */
    function cancelExpiredBox(uint256 _boxId) external {
        UserBox storage box = userBoxes[_boxId];
        
        require(
            box.status == BoxStatus.PENDING_DECRYPT || 
            box.status == BoxStatus.DECRYPTING ||
            box.status == BoxStatus.PURCHASED,
            "Cannot cancel"
        );
        
        require(
            block.timestamp > box.expiresAt,
            "Box not expired yet"
        );
        
        box.status = BoxStatus.EXPIRED;
        
        emit BoxExpired(_boxId, block.timestamp);
    }
    
    /**
     * @notice Emergency resolve - admin can manually resolve stuck boxes
     * @param _boxId The box ID to resolve
     * @param _prizeAmount The prize amount to set (admin verified)
     * @dev Only owner can use this in extreme cases (Section 2.4)
     */
    function emergencyResolve(
        uint256 _boxId,
        uint256 _prizeAmount
    ) external onlyOwner {
        UserBox storage box = userBoxes[_boxId];
        
        require(
            box.status == BoxStatus.PENDING_DECRYPT || 
            box.status == BoxStatus.DECRYPTING,
            "Box not in resolvable state"
        );
        
        require(
            block.timestamp > box.purchaseTime + 1 days,
            "Too early for emergency resolve"
        );
        
        // Mark request as processed if exists
        uint256 requestId = boxIdToRequestId[_boxId];
        if (requestId > 0) {
            DecryptionRequest storage request = decryptionRequests[requestId];
            request.processed = true;
        }
        
        // Set prize and update status
        box.revealedPrizeAmount = _prizeAmount;
        box.status = BoxStatus.OPENED;
        
        emit BoxOpened(_boxId, box.owner, _prizeAmount);
        
        if (requestId > 0) {
            emit DecryptionCompleted(requestId, _boxId, _prizeAmount);
        }
    }
    
    /**
     * @notice Get decryption request info
     * @param _requestId The request ID
     */
    function getDecryptionRequest(uint256 _requestId) external view returns (
        uint256 boxId,
        address requester,
        uint256 timestamp,
        uint8 retryCount,
        bool processed
    ) {
        DecryptionRequest memory request = decryptionRequests[_requestId];
        return (
            request.boxId,
            request.requester,
            request.timestamp,
            request.retryCount,
            request.processed
        );
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}

