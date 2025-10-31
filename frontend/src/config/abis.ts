// Contract ABIs
// These will be populated after contract compilation

export const MYSTERY_BOX_SIMPLE_ABI = [
  "function owner() external view returns (address)",
  "function createSeries(string memory _name, uint256 _price, uint256 _totalBoxes, uint256[] memory _prizeAmounts) external",
  "function purchaseBox(uint256 _seriesId, uint256 _prizeAmount) external payable",
  "function openBox(uint256 _boxId) external",
  "function withdrawPrize(uint256 _boxId) external",
  "function getSeriesInfo(uint256 _seriesId) external view returns (uint256 id, string memory name, uint256 price, uint256 totalBoxes, uint256 remainingBoxes, address creator, bool isActive)",
  "function getBoxInfo(uint256 _boxId) external view returns (uint256 boxId, uint256 seriesId, address boxOwner, uint256 prizeAmount, bool isOpened, uint256 purchaseTime)",
  "function getUserBoxIds(address _user) external view returns (uint256[] memory)",
  "function getTotalSeries() external view returns (uint256)",
  "function getTotalBoxes() external view returns (uint256)",
  "function depositPrizeFund() external payable",
  "function getContractBalance() external view returns (uint256)",
  "event SeriesCreated(uint256 indexed seriesId, string name, uint256 price, uint256 totalBoxes)",
  "event BoxPurchased(uint256 indexed boxId, uint256 indexed seriesId, address indexed buyer, uint256 prizeAmount)",
  "event BoxOpened(uint256 indexed boxId, address indexed owner, uint256 prizeAmount)",
  "event PrizeWithdrawn(uint256 indexed boxId, address indexed owner, uint256 amount)",
];

export const MYSTERY_BOX_FHE_ABI = [
  "function owner() external view returns (address)",
  "function createSeries(string memory _name, uint256 _price, uint256 _totalBoxes) external",
  "function purchaseBox(uint256 _seriesId, einput _encryptedPrizeAmount, bytes calldata _inputProof) external payable",
  "function openBox(uint256 _boxId) external returns (uint256 requestId)",
  "function withdrawPrize(uint256 _boxId) external",
  "function getSeriesInfo(uint256 _seriesId) external view returns (uint256 id, string memory name, uint256 price, uint256 totalBoxes, uint256 remainingBoxes, address creator, bool isActive)",
  "function getBoxInfo(uint256 _boxId) external view returns (uint256 boxId, uint256 seriesId, address boxOwner, uint8 status, uint256 revealedPrizeAmount, uint256 purchaseTime, uint256 expiresAt)",
  "function getUserBoxIds(address _user) external view returns (uint256[] memory)",
  "function getTotalSeries() external view returns (uint256)",
  "function getTotalBoxes() external view returns (uint256)",
  "function depositPrizeFund() external payable",
  "function getContractBalance() external view returns (uint256)",
  // Error handling functions
  "function retryDecryption(uint256 _boxId) external returns (uint256 newRequestId)",
  "function cancelExpiredBox(uint256 _boxId) external",
  "function emergencyResolve(uint256 _boxId, uint256 _prizeAmount) external",
  "function getDecryptionRequest(uint256 _requestId) external view returns (uint256 boxId, address requester, uint256 timestamp, uint8 retryCount, bool processed)",
  // Constants
  "function CALLBACK_GAS_LIMIT() external view returns (uint256)",
  "function REQUEST_TIMEOUT() external view returns (uint256)",
  "function MAX_RETRIES() external view returns (uint8)",
  // Events
  "event SeriesCreated(uint256 indexed seriesId, string name, uint256 price, uint256 totalBoxes)",
  "event BoxPurchased(uint256 indexed boxId, uint256 indexed seriesId, address indexed buyer)",
  "event BoxOpenRequested(uint256 indexed boxId, address indexed owner, uint256 requestId)",
  "event BoxOpened(uint256 indexed boxId, address indexed owner, uint256 prizeAmount)",
  "event PrizeWithdrawn(uint256 indexed boxId, address indexed owner, uint256 amount)",
  // New decryption events
  "event DecryptionRequested(uint256 indexed requestId, uint256 indexed boxId, uint256 timestamp)",
  "event DecryptionCompleted(uint256 indexed requestId, uint256 indexed boxId, uint256 decryptedAmount)",
  "event DecryptionFailed(uint256 indexed requestId, uint256 indexed boxId, string reason)",
  "event DecryptionRetrying(uint256 indexed requestId, uint256 indexed boxId, uint8 retryCount)",
  "event BoxExpired(uint256 indexed boxId, uint256 timestamp)",
];

