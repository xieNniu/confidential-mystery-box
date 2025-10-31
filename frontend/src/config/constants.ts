// Contract addresses (update after deployment)
export const CONTRACT_ADDRESS_SIMPLE = "0x6ca2b8Ba1219A75C75599d8298bb3EeC95b147A1";
export const CONTRACT_ADDRESS_FHE = "0x0F5866bE68a853720Fc05617547a5bBb722A7E19"; // ✅ Updated after fixes

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 11155111,
  chainName: "Sepolia",
  rpcUrl: "https://eth-sepolia.public.blastapi.io",
  blockExplorer: "https://sepolia.etherscan.io",
};

// FHE SDK Configuration
export const FHEVM_CONFIG = {
  chainId: 11155111,
  networkUrl: "https://eth-sepolia.public.blastapi.io",
  gatewayUrl: "https://gateway.sepolia.zama.ai",
  relayerUrl: "https://relayer.testnet.zama.cloud",
  aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
  kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
};

// Gateway health check settings
export const GATEWAY_CHECK_INTERVAL = 60000; // 60 seconds
export const GATEWAY_TIMEOUT = 5000; // 5 seconds

// UI Text (English)
export const UI_TEXT = {
  // Header
  appTitle: "🎁 Confidential Mystery Box",
  appSubtitle: "Fully Encrypted Mystery Box on Zama FHEVM",
  
  // Wallet
  connectWallet: "Connect Wallet",
  disconnect: "Disconnect",
  wrongNetwork: "Wrong Network",
  switchNetwork: "Switch to Sepolia",
  
  // Gateway Status
  gatewayOnline: "🟢 Gateway Online",
  gatewayOffline: "🔴 Gateway Offline",
  gatewayChecking: "🟡 Checking...",
  fheMode: "FHE Encrypted Mode",
  simpleMode: "Plaintext Mode (Fallback)",
  autoMode: "Auto Mode",
  manualMode: "Manual Mode",
  
  // Navigation
  navStore: "Mystery Box Store",
  navMyBoxes: "My Boxes",
  navAdmin: "Admin Panel",
  
  // Store
  storeTitle: "Mystery Box Store",
  storeEmpty: "No box series available",
  price: "Price",
  remaining: "Remaining",
  encrypted: "🔒 Encrypted",
  buyNow: "Buy Now",
  soldOut: "Sold Out",
  inactive: "Inactive",
  
  // My Boxes
  myBoxesTitle: "My Mystery Boxes",
  unopenedBoxes: "Unopened Boxes",
  openedBoxes: "Opened Boxes",
  noBoxes: "You don't have any boxes yet",
  goToStore: "Go to Store",
  openBox: "Open Box",
  opening: "Opening...",
  decrypting: "Decrypting...",
  withdraw: "Withdraw Prize",
  withdrawing: "Withdrawing...",
  withdrawn: "Withdrawn",
  prizeAmount: "Prize Amount",
  purchaseTime: "Purchase Time",
  
  // Admin
  adminTitle: "Admin Panel",
  createSeries: "Create Mystery Box Series",
  seriesName: "Series Name",
  boxPrice: "Box Price (ETH)",
  totalBoxes: "Total Boxes",
  prizePool: "Prize Pool (ETH)",
  creating: "Creating...",
  create: "Create Series",
  fundContract: "Fund Contract",
  contractBalance: "Contract Balance",
  deposit: "Deposit",
  depositing: "Depositing...",
  
  // Messages
  txPending: "Transaction pending...",
  txSuccess: "Transaction successful!",
  txFailed: "Transaction failed",
  purchaseSuccess: "Purchase successful! Box added to your account",
  openSuccess: "Box opened successfully!",
  withdrawSuccess: "Prize withdrawn successfully!",
  createSeriesSuccess: "Series created successfully!",
  
  // Errors
  errorConnectWallet: "Please connect wallet first",
  errorWrongNetwork: "Please switch to Sepolia testnet",
  errorInsufficientFunds: "Insufficient funds",
  errorGatewayOffline: "Gateway offline, please use plaintext mode or try again later",
  errorTransaction: "Transaction failed, please retry",
  
  // Common
  loading: "Loading...",
  cancel: "Cancel",
  confirm: "Confirm",
  close: "Close",
  back: "Back",
  next: "Next",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
};

