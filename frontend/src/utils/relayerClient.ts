/**
 * Relayer Client for Gateway Decryption Polling
 * Follows FHEVM Development Standards Section 3.3
 */

const RELAYER_CONFIG = {
  sepolia: {
    url: 'https://gateway.sepolia.zama.ai/v1/public-decrypt',
    chainId: 11155111,
  },
  local: {
    url: 'http://localhost:8545',
    chainId: 31337,
  },
};

interface PollingOptions {
  maxAttempts?: number;      // 5分钟（60次 * 5秒）
  interval?: number;          // 5秒一次
  onProgress?: (progress: { current: number; total: number; percentage: number }) => void;
}

interface PollingResult {
  success: boolean;
  data?: any;
  attempts: number;
  error?: string;
}

export class RelayerClient {
  private config: typeof RELAYER_CONFIG.sepolia;

  constructor(network: 'sepolia' | 'local' = 'sepolia') {
    this.config = RELAYER_CONFIG[network];
  }

  /**
   * ✅ 核心功能：轮询 Gateway 解密结果
   * @param requestId Gateway request ID
   * @param contractAddress Contract address
   * @param options Polling options
   * @returns Polling result
   */
  async pollDecryption(
    requestId: string | bigint,
    contractAddress: string,
    options: PollingOptions = {}
  ): Promise<PollingResult> {
    const {
      maxAttempts = 60,      // 5分钟（60次 * 5秒）
      interval = 5000,       // 5秒一次
      onProgress = null,
    } = options;

    console.log('🔐 开始轮询 Gateway 解密...', {
      requestId: requestId.toString(),
      contractAddress,
      estimatedTime: `${(maxAttempts * interval) / 1000}秒`,
    });

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // 调用进度回调
        if (onProgress) {
          onProgress({
            current: attempt,
            total: maxAttempts,
            percentage: Math.round((attempt / maxAttempts) * 100),
          });
        }

        // 请求 Gateway
        const response = await fetch(this.config.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            handle: this.formatRequestId(requestId),
            contractAddress: contractAddress,
            chainId: this.config.chainId,
          }),
        });

        // 成功
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Gateway 解密完成（第 ${attempt} 次尝试）`);
          return { success: true, data, attempts: attempt };
        }

        // 404 表示还未准备好
        if (response.status === 404) {
          console.log(`⏳ 尝试 ${attempt}/${maxAttempts}...`);
        } else {
          console.warn(`⚠️ Gateway 返回异常: ${response.status}`);
        }
      } catch (error: any) {
        console.warn(`⚠️ 轮询尝试 ${attempt} 失败:`, error.message);
      }

      // 等待下一次尝试
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }

    const error = `Gateway 解密超时（${maxAttempts} 次，共 ${(maxAttempts * interval) / 1000}秒）`;
    console.error(`❌ ${error}`);
    return { success: false, attempts: maxAttempts, error };
  }

  /**
   * 检查 Gateway 健康状态
   */
  async checkHealth(): Promise<boolean> {
    try {
      const baseUrl = this.config.url.replace('/v1/public-decrypt', '');
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      console.warn('⚠️ Gateway 健康检查失败:', error);
      return false;
    }
  }

  /**
   * 格式化 requestId
   */
  private formatRequestId(requestId: string | bigint): string {
    if (typeof requestId === 'bigint') {
      return '0x' + requestId.toString(16).padStart(64, '0');
    }
    if (requestId.startsWith('0x')) {
      return requestId;
    }
    return '0x' + requestId;
  }
}

export default RelayerClient;

