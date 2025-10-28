// Type definitions

export type ContractType = "simple" | "fhe";

export type GatewayStatus = "up" | "down" | "checking";

export interface BoxSeries {
  id: number;
  name: string;
  price: string; // in ETH
  totalBoxes: number;
  remainingBoxes: number;
  creator: string;
  isActive: boolean;
}

export interface UserBox {
  boxId: number;
  seriesId: number;
  owner: string;
  prizeAmount?: string; // Simple mode
  revealedPrizeAmount?: string; // FHE mode
  isOpened: boolean;
  isDecrypting?: boolean; // FHE mode only
  purchaseTime: number;
}

export interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
}

export interface ContractState {
  contractType: ContractType;
  gatewayStatus: GatewayStatus;
  isAutoMode: boolean;
}


