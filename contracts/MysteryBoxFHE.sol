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
        bool isOpened;
        bool isDecrypting;
        uint256 revealedPrizeAmount;    // Revealed after decryption
        uint256 purchaseTime;
    }
    
    // ===== State Variables =====
    
    uint256 public seriesCounter;
    uint256 public boxCounter;
    
    mapping(uint256 => BoxSeries) public boxSeries;
    mapping(uint256 => UserBox) public userBoxes;
    mapping(address => uint256[]) public userBoxIds;
    mapping(uint256 => uint256) private requestIdToBoxId;
    
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
            isOpened: false,
            isDecrypting: false,
            revealedPrizeAmount: 0,
            purchaseTime: block.timestamp
        });
        
        userBoxIds[msg.sender].push(boxCounter);
        
        emit BoxPurchased(boxCounter, _seriesId, msg.sender);
    }
    
    /**
     * @notice Open a mystery box and request decryption
     * @param _boxId The box ID to open
     */
    function openBox(uint256 _boxId) external onlyBoxOwner(_boxId) {
        UserBox storage box = userBoxes[_boxId];
        
        require(!box.isOpened, "Box already opened");
        require(!box.isDecrypting, "Decryption in progress");
        require(box.owner == msg.sender, "Not your box");
        
        box.isDecrypting = true;
        
        // Prepare ciphertext for Gateway decryption
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(box.encryptedPrizeAmount);
        
        // Allow Gateway to decrypt
        TFHE.allow(box.encryptedPrizeAmount, Gateway.GatewayContractAddress());
        
        // Request decryption from Gateway
        uint256 requestId = Gateway.requestDecryption(
            cts,
            this.callbackOpenBox.selector,
            0,
            block.timestamp + 1 days,
            false
        );
        
        requestIdToBoxId[requestId] = _boxId;
        
        emit BoxOpenRequested(_boxId, msg.sender, requestId);
    }
    
    /**
     * @notice Gateway callback after decryption
     * @param _requestId The request ID from Gateway
     * @param _decryptedPrizeAmount The decrypted prize amount
     */
    function callbackOpenBox(
        uint256 _requestId,
        uint256 _decryptedPrizeAmount
    ) public onlyGateway {
        uint256 boxId = requestIdToBoxId[_requestId];
        UserBox storage box = userBoxes[boxId];
        
        box.isOpened = true;
        box.isDecrypting = false;
        box.revealedPrizeAmount = _decryptedPrizeAmount;
        
        emit BoxOpened(boxId, box.owner, _decryptedPrizeAmount);
    }
    
    /**
     * @notice Withdraw prize from an opened box
     * @param _boxId The box ID to withdraw from
     */
    function withdrawPrize(uint256 _boxId) external onlyBoxOwner(_boxId) {
        UserBox storage box = userBoxes[_boxId];
        
        require(box.isOpened, "Box not opened yet");
        require(!box.isDecrypting, "Decryption in progress");
        require(box.revealedPrizeAmount > 0, "No prize to withdraw");
        
        uint256 amount = box.revealedPrizeAmount;
        box.revealedPrizeAmount = 0;
        
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
        bool isOpened,
        bool isDecrypting,
        uint256 revealedPrizeAmount,
        uint256 purchaseTime
    ) {
        UserBox memory box = userBoxes[_boxId];
        return (
            box.boxId,
            box.seriesId,
            box.owner,
            box.isOpened,
            box.isDecrypting,
            box.revealedPrizeAmount,
            box.purchaseTime
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
    
    // Fallback function to receive ETH
    receive() external payable {}
}

