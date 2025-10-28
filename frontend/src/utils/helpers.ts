import { ethers } from 'ethers';

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format ETH amount
 */
export function formatEth(wei: string | bigint, decimals: number = 4): string {
  try {
    const eth = ethers.formatEther(wei);
    return parseFloat(eth).toFixed(decimals);
  } catch {
    return '0.0000';
  }
}

/**
 * Parse ETH to Wei
 */
export function parseEth(eth: string): bigint {
  try {
    return ethers.parseEther(eth);
  } catch {
    return BigInt(0);
  }
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get random prize amount for Simple mode
 */
export function getRandomPrizeAmount(boxPrice: bigint): bigint {
  // Prize should be between 50% to 150% of box price
  const min = boxPrice * BigInt(50) / BigInt(100);
  const max = boxPrice * BigInt(150) / BigInt(100);
  const range = max - min;
  
  // Generate random number in range
  const randomPercent = Math.floor(Math.random() * 101); // 0-100
  const randomAmount = min + (range * BigInt(randomPercent) / BigInt(100));
  
  return randomAmount;
}

/**
 * Generate prize pool for multiple boxes
 */
export function generatePrizePool(totalBoxes: number, boxPrice: bigint): bigint[] {
  const prizes: bigint[] = [];
  
  for (let i = 0; i < totalBoxes; i++) {
    prizes.push(getRandomPrizeAmount(boxPrice));
  }
  
  return prizes;
}

/**
 * Delay helper for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Transaction helper - wait for confirmation
 */
export async function waitForTransaction(
  tx: any,
  confirmations: number = 1
): Promise<any> {
  console.log('⏳ 等待交易确认...', tx.hash);
  const receipt = await tx.wait(confirmations);
  console.log('✅ 交易已确认:', receipt.transactionHash);
  return receipt;
}

