import { createInstance } from '@zama-fhe/relayer-sdk/web';
import { FHEVM_CONFIG } from '../config/constants';

let fhevmInstance: any = null;

/**
 * Initialize FHEVM instance
 */
export async function initFhevmInstance(): Promise<any> {
  if (fhevmInstance) {
    return fhevmInstance;
  }

  try {
    console.log('🔧 初始化 FHEVM SDK...');
    
    fhevmInstance = await createInstance({
      chainId: FHEVM_CONFIG.chainId,
      networkUrl: FHEVM_CONFIG.networkUrl,
      gatewayUrl: FHEVM_CONFIG.gatewayUrl,
      aclAddress: FHEVM_CONFIG.aclContractAddress,
    });

    console.log('✅ FHEVM SDK 初始化成功');
    return fhevmInstance;
  } catch (error) {
    console.error('❌ FHEVM SDK 初始化失败:', error);
    console.warn('💡 将回退到 Simple 模式');
    return null;
  }
}

/**
 * Get FHEVM instance
 */
export function getFhevmInstance(): any {
  if (!fhevmInstance) {
    throw new Error('FHEVM instance not initialized. Call initFhevmInstance() first.');
  }
  return fhevmInstance;
}

/**
 * Encrypt a number (euint32)
 */
export async function encryptNumber(
  value: number,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: string; proof: string }> {
  const instance = await initFhevmInstance();

  try {
    console.log('🔐 加密数值:', value);
    
    const encryptedInput = instance.createEncryptedInput(contractAddress, userAddress);
    encryptedInput.add32(value);
    
    const encrypted = await encryptedInput.encrypt();
    
    console.log('✅ 加密完成');
    return {
      handle: encrypted.handles[0],
      proof: encrypted.inputProof,
    };
  } catch (error) {
    console.error('❌ 加密失败:', error);
    throw error;
  }
}

/**
 * Reset FHEVM instance (for testing)
 */
export function resetFhevmInstance(): void {
  fhevmInstance = null;
  console.log('🔄 FHEVM instance 已重置');
}

