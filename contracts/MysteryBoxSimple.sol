// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MysteryBoxSimple
 * @notice Simple version of Mystery Box (Fallback mode when Gateway is offline)
 * @dev This contract uses plaintext values for testing and fallback scenarios
 */
contract MysteryBoxSimple {
    
    // ===== Structs =====
    
    struct BoxSeries {
        uint256 id;
        string name;
        uint256 price;              // Price in wei
        uint256 totalBoxes;         // Total number of boxes
        uint256 remainingBoxes;     // Boxes not yet purchased
        address creator;
        bool isActive;
    }
    
    struct UserBox {
        uint256 boxId;
        uint256 seriesId;
        address owner;
        uint256 prizeAmount;        // ETH amount (plaintext in Simple version)
        bool isOpened;
        uint256 purchaseTime;
    }
    
    // ===== State Variables =====
    
    uint256 public seriesCounter;
    uint256 public boxCounter;
    
    mapping(uint256 => BoxSeries) public boxSeries;
    mapping(uint256 => UserBox) public userBoxes;
    mapping(address => uint256[]) public userBoxIds;
    
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
        address indexed buyer,
        uint256 prizeAmount
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
     * @param _prizeAmounts Array of prize amounts (one per box)
     */
    function createSeries(
        string memory _name,
        uint256 _price,
        uint256 _totalBoxes,
        uint256[] memory _prizeAmounts
    ) external onlyOwner {
        require(_totalBoxes > 0, "Total boxes must be > 0");
        require(_prizeAmounts.length == _totalBoxes, "Prize amounts mismatch");
        
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
     * @notice Purchase a mystery box
     * @param _seriesId The series ID to purchase from
     * @param _prizeAmount The prize amount for this box (passed from frontend)
     */
    function purchaseBox(uint256 _seriesId, uint256 _prizeAmount) external payable {
        BoxSeries storage series = boxSeries[_seriesId];
        
        require(series.id != 0, "Series does not exist");
        require(series.isActive, "Series not active");
        require(series.remainingBoxes > 0, "No boxes remaining");
        require(msg.value == series.price, "Incorrect payment");
        
        boxCounter++;
        series.remainingBoxes--;
        
        userBoxes[boxCounter] = UserBox({
            boxId: boxCounter,
            seriesId: _seriesId,
            owner: msg.sender,
            prizeAmount: _prizeAmount,
            isOpened: false,
            purchaseTime: block.timestamp
        });
        
        userBoxIds[msg.sender].push(boxCounter);
        
        emit BoxPurchased(boxCounter, _seriesId, msg.sender, _prizeAmount);
    }
    
    /**
     * @notice Open a mystery box and reveal the prize
     * @param _boxId The box ID to open
     */
    function openBox(uint256 _boxId) external onlyBoxOwner(_boxId) {
        UserBox storage box = userBoxes[_boxId];
        
        require(!box.isOpened, "Box already opened");
        require(box.owner == msg.sender, "Not your box");
        
        box.isOpened = true;
        
        emit BoxOpened(_boxId, msg.sender, box.prizeAmount);
    }
    
    /**
     * @notice Withdraw prize from an opened box
     * @param _boxId The box ID to withdraw from
     */
    function withdrawPrize(uint256 _boxId) external onlyBoxOwner(_boxId) {
        UserBox storage box = userBoxes[_boxId];
        
        require(box.isOpened, "Box not opened yet");
        require(box.prizeAmount > 0, "No prize to withdraw");
        
        uint256 amount = box.prizeAmount;
        box.prizeAmount = 0;
        
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
        uint256 prizeAmount,
        bool isOpened,
        uint256 purchaseTime
    ) {
        UserBox memory box = userBoxes[_boxId];
        return (
            box.boxId,
            box.seriesId,
            box.owner,
            box.prizeAmount,
            box.isOpened,
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


