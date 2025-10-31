import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContractInteraction } from './useContract';
import { encryptNumber } from '../utils/fhevm';
import { formatEth, parseEth, generatePrizePool, getRandomPrizeAmount, waitForTransaction } from '../utils/helpers';
import { BoxSeries, UserBox } from '../types';
import RelayerClient from '../utils/relayerClient';

export function useMysteryBox() {
  const { getContractInstance, getContractAddress, contractType, userAddress } =
    useContractInteraction();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<BoxSeries[]>([]);
  const [boxes, setBoxes] = useState<UserBox[]>([]);

  /**
   * Get all series
   */
  const getAllSeries = useCallback(async (): Promise<BoxSeries[]> => {
    try {
      const contract = await getContractInstance();
      const totalSeries = await contract.getTotalSeries();
      const seriesCount = Number(totalSeries);

      const seriesList: BoxSeries[] = [];

      for (let i = 1; i <= seriesCount; i++) {
        const info = await contract.getSeriesInfo(i);
        seriesList.push({
          id: Number(info[0]),
          name: info[1],
          price: formatEth(info[2]),
          totalBoxes: Number(info[3]),
          remainingBoxes: Number(info[4]),
          creator: info[5],
          isActive: info[6],
        });
      }

      return seriesList;
    } catch (err: any) {
      console.error('❌ 获取系列失败:', err);
      throw err;
    }
  }, [getContractInstance]);

  /**
   * Get user's boxes
   */
  const getUserBoxes = useCallback(async (): Promise<UserBox[]> => {
    if (!userAddress) {
      throw new Error('请先连接钱包');
    }

    try {
      const contract = await getContractInstance();
      const boxIds = await contract.getUserBoxIds(userAddress);

      const boxes: UserBox[] = [];

      for (const boxId of boxIds) {
        const info = await contract.getBoxInfo(boxId);
        
        if (contractType === 'fhe') {
          // FHE mode - new format with status enum
          // Returns: boxId, seriesId, boxOwner, status, revealedPrizeAmount, purchaseTime, expiresAt
          const status = Number(info[3]); // BoxStatus enum: 0=PURCHASED, 1=PENDING_DECRYPT, 2=DECRYPTING, 3=OPENED, 4=PRIZE_WITHDRAWN, 5=EXPIRED
          
          boxes.push({
            boxId: Number(info[0]),
            seriesId: Number(info[1]),
            owner: info[2],
            isOpened: status === 3 || status === 4, // OPENED or PRIZE_WITHDRAWN
            isDecrypting: status === 1 || status === 2, // PENDING_DECRYPT or DECRYPTING
            revealedPrizeAmount: info[4] ? formatEth(info[4]) : undefined,
            purchaseTime: Number(info[5]),
          });
        } else {
          // Simple mode - old format (still compatible)
          boxes.push({
            boxId: Number(info[0]),
            seriesId: Number(info[1]),
            owner: info[2],
            prizeAmount: formatEth(info[3]),
            isOpened: info[4],
            purchaseTime: Number(info[5]),
          });
        }
      }

      return boxes;
    } catch (err: any) {
      console.error('❌ 获取用户盲盒失败:', err);
      throw err;
    }
  }, [getContractInstance, userAddress, contractType]);

  /**
   * Create series (Admin only)
   */
  const createSeries = useCallback(
    async (
      name: string,
      price: string,
      totalBoxes: number
    ): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getContractInstance();
        const priceWei = parseEth(price);

        if (contractType === 'fhe') {
          // FHE mode - no prize amounts needed upfront
          const tx = await contract.createSeries(name, priceWei, totalBoxes);
          await waitForTransaction(tx);
        } else {
          // Simple mode - generate prize amounts
          const prizeAmounts = generatePrizePool(totalBoxes, priceWei);
          const tx = await contract.createSeries(name, priceWei, totalBoxes, prizeAmounts);
          await waitForTransaction(tx);
        }

        console.log('✅ 系列创建成功');
      } catch (err: any) {
        console.error('❌ 创建系列失败:', err);
        setError(err.message || '创建失败');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getContractInstance, contractType]
  );

  /**
   * Purchase box
   */
  const purchaseBox = useCallback(
    async (seriesId: number, price: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getContractInstance();
        const priceWei = parseEth(price);

        if (contractType === 'fhe') {
          // FHE mode - encrypt prize amount
          if (!userAddress) throw new Error('请先连接钱包');
          
          const contractAddress = getContractAddress();
          const prizeAmount = getRandomPrizeAmount(priceWei);
          
          const { handle, proof } = await encryptNumber(
            Number(prizeAmount),
            contractAddress,
            userAddress
          );

          const tx = await contract.purchaseBox(seriesId, handle, proof, {
            value: priceWei,
          });
          await waitForTransaction(tx);
        } else {
          // Simple mode - pass prize amount
          const prizeAmount = getRandomPrizeAmount(priceWei);
          
          const tx = await contract.purchaseBox(seriesId, prizeAmount, {
            value: priceWei,
          });
          await waitForTransaction(tx);
        }

        console.log('✅ 购买成功');
      } catch (err: any) {
        console.error('❌ 购买失败:', err);
        setError(err.message || '购买失败');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getContractInstance, contractType, userAddress, getContractAddress]
  );

  /**
   * Open box - Complete decryption flow (5 steps)
   * Follows FHEVM Development Standards Section 3.4
   */
  const openBox = useCallback(
    async (
      boxId: number,
      onProgress?: (progress: number, message: string) => void
    ): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getContractInstance();
        const contractAddress = getContractAddress();

        if (contractType === 'fhe') {
          // ===== Step 1: Submit on-chain decryption request =====
          if (onProgress) onProgress(10, 'Submitting decryption request...');
          console.log('🎮 开始解密盲盒:', boxId);
          
          const tx = await contract.openBox(boxId);
          console.log('📝 交易已提交:', tx.hash);
          
          if (onProgress) onProgress(20, 'Waiting for transaction confirmation...');
          const receipt = await waitForTransaction(tx);
          console.log('✅ 交易已确认');

          // ===== Step 2: Get requestId from event =====
          if (onProgress) onProgress(30, 'Extracting request ID from event...');
          
          const event = receipt.logs.find((log: any) => {
            try {
              const parsed = contract.interface.parseLog({
                topics: log.topics || [],
                data: log.data || '',
              });
              return parsed && (parsed.name === 'DecryptionRequested' || parsed.name === 'BoxOpenRequested');
            } catch {
              return false;
            }
          });

          if (!event) {
            throw new Error('未找到 DecryptionRequested 事件');
          }

          const parsedEvent = contract.interface.parseLog({
            topics: event.topics || [],
            data: event.data || '',
          });

          const requestId = parsedEvent?.args?.requestId || parsedEvent?.args?.[2];
          if (!requestId) {
            throw new Error('未找到 requestId');
          }

          console.log('🔑 解密请求ID:', requestId.toString());

          // ===== Step 3: Poll Gateway (关键步骤) =====
          if (onProgress) onProgress(40, 'Polling Gateway for decryption...');
          console.log('⏳ 开始轮询 Gateway...');

          const relayerClient = new RelayerClient('sepolia');
          const pollResult = await relayerClient.pollDecryption(
            requestId,
            contractAddress,
            {
              onProgress: (pollProgress) => {
                const percentage = 40 + (pollProgress.percentage * 0.3);
                if (onProgress) {
                  onProgress(
                    Math.round(percentage),
                    `Polling Gateway... ${pollProgress.percentage}% (${pollProgress.current}/${pollProgress.total})`
                  );
                }
              },
            }
          );

          if (!pollResult.success) {
            throw new Error(pollResult.error || 'Gateway decryption timeout');
          }

          console.log('✅ Gateway 解密完成');

          // ===== Step 4: Wait for on-chain callback completion =====
          if (onProgress) onProgress(85, 'Waiting for on-chain callback...');
          console.log('⏳ 等待链上回调...');

          await waitForCallbackCompletion(boxId, contract, (waitProgress) => {
            const percentage = 85 + (waitProgress * 0.1);
            if (onProgress) {
              onProgress(Math.round(percentage), 'Waiting for callback...');
            }
          });

          // ===== Step 5: Get final result =====
          if (onProgress) onProgress(95, 'Getting final result...');
          const boxInfo = await contract.getBoxInfo(boxId);
          console.log('🎉 解密流程完成!', boxInfo);

          if (onProgress) onProgress(100, 'Decryption completed!');
        } else {
          // Simple mode - direct open
          const tx = await contract.openBox(boxId);
          await waitForTransaction(tx);
          console.log('✅ 盲盒已开启');
        }
      } catch (err: any) {
        console.error('❌ 开盒失败:', err);
        setError(err.message || '开盒失败');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getContractInstance, contractType, getContractAddress]
  );

  /**
   * Wait for on-chain callback completion
   */
  const waitForCallbackCompletion = async (
    boxId: number,
    contract: ethers.Contract,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    const MAX_WAIT = 120; // 2分钟
    const INTERVAL = 2000; // 2秒

    for (let i = 0; i < MAX_WAIT; i++) {
      onProgress(i / MAX_WAIT);

      try {
        const boxInfo = await contract.getBoxInfo(boxId);
        // status: 3 = OPENED (BoxStatus enum)
        if (boxInfo[3] === 3) {
          console.log('✅ 回调已在链上完成');
          return;
        }
      } catch (error) {
        console.warn('⏳ 等待回调中...', error);
      }

      await new Promise((resolve) => setTimeout(resolve, INTERVAL));
    }

    throw new Error('等待回调超时 - 请检查合约状态或重试');
  };

  /**
   * Withdraw prize
   */
  const withdrawPrize = useCallback(
    async (boxId: number): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getContractInstance();
        const tx = await contract.withdrawPrize(boxId);
        await waitForTransaction(tx);

        console.log('✅ 奖品已领取');
      } catch (err: any) {
        console.error('❌ 领取失败:', err);
        setError(err.message || '领取失败');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getContractInstance]
  );

  /**
   * Deposit prize fund (Admin only)
   */
  const depositPrizeFund = useCallback(
    async (amount: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getContractInstance();
        const amountWei = parseEth(amount);
        const tx = await contract.depositPrizeFund({ value: amountWei });
        await waitForTransaction(tx);

        console.log('✅ 充值成功');
      } catch (err: any) {
        console.error('❌ 充值失败:', err);
        setError(err.message || '充值失败');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getContractInstance]
  );

  /**
   * Get contract balance
   */
  const getContractBalance = useCallback(async (): Promise<string> => {
    try {
      const contract = await getContractInstance();
      const balance = await contract.getContractBalance();
      return formatEth(balance);
    } catch (err: any) {
      console.error('❌ 获取余额失败:', err);
      throw err;
    }
  }, [getContractInstance]);

  /**
   * Get contract owner
   */
  const getContractOwner = useCallback(async (): Promise<string> => {
    try {
      const contract = await getContractInstance();
      const ownerAddress = await contract.owner();
      return ownerAddress.toLowerCase();
    } catch (err: any) {
      console.error('❌ 获取 owner 失败:', err);
      throw err;
    }
  }, [getContractInstance]);

  /**
   * Refresh series data
   */
  const refreshSeries = useCallback(async () => {
    try {
      console.log('🔄 刷新系列数据...');
      setLoading(true);
      const data = await getAllSeries();
      setSeries(data);
      console.log('✅ 系列数据已更新:', data);
    } catch (err: any) {
      console.error('❌ 刷新失败:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAllSeries]);

  /**
   * Refresh user boxes
   */
  const refreshBoxes = useCallback(async () => {
    if (!userAddress) return;
    
    try {
      console.log('🔄 刷新用户盲盒...');
      const data = await getUserBoxes();
      setBoxes(data);
      console.log('✅ 用户盲盒已更新:', data);
    } catch (err: any) {
      console.error('❌ 刷新失败:', err);
    }
  }, [getUserBoxes, userAddress]);

  /**
   * Auto-load data on mount and when contract changes
   */
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        console.log('🔄 自动加载系列数据...');
        setLoading(true);
        const contract = await getContractInstance();
        const totalSeries = await contract.getTotalSeries();
        const seriesCount = Number(totalSeries);

        const seriesList: BoxSeries[] = [];

        for (let i = 1; i <= seriesCount; i++) {
          const info = await contract.getSeriesInfo(i);
          seriesList.push({
            id: Number(info[0]),
            name: info[1],
            price: formatEth(info[2]),
            totalBoxes: Number(info[3]),
            remainingBoxes: Number(info[4]),
            creator: info[5],
            isActive: info[6],
          });
        }

        if (mounted) {
          setSeries(seriesList);
          console.log('✅ 系列数据加载完成:', seriesList);
        }
      } catch (err: any) {
        console.error('❌ 自动加载失败:', err);
        if (mounted) {
          setError(err.message);
          setSeries([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [contractType]);

  useEffect(() => {
    let mounted = true;
    
    const loadBoxes = async () => {
      if (!userAddress) {
        if (mounted) {
          setBoxes([]);
        }
        return;
      }
      
      try {
        console.log('🔄 自动加载用户盲盒...');
        const contract = await getContractInstance();
        const boxIds = await contract.getUserBoxIds(userAddress);

        const boxesList: UserBox[] = [];

        for (const boxId of boxIds) {
          const info = await contract.getBoxInfo(boxId);
          
          if (contractType === 'fhe') {
            // FHE mode
            boxesList.push({
              boxId: Number(info[0]),
              seriesId: Number(info[1]),
              owner: info[2],
              isOpened: info[3],
              isDecrypting: info[4],
              revealedPrizeAmount: info[5] ? formatEth(info[5]) : undefined,
              purchaseTime: Number(info[6]),
            });
          } else {
            // Simple mode
            boxesList.push({
              boxId: Number(info[0]),
              seriesId: Number(info[1]),
              owner: info[2],
              prizeAmount: formatEth(info[3]),
              isOpened: info[4],
              purchaseTime: Number(info[5]),
            });
          }
        }

        if (mounted) {
          setBoxes(boxesList);
          console.log('✅ 用户盲盒加载完成:', boxesList);
        }
      } catch (err: any) {
        console.error('❌ 自动加载盲盒失败:', err);
        if (mounted) {
          setBoxes([]);
        }
      }
    };
    
    loadBoxes();
    
    return () => {
      mounted = false;
    };
  }, [userAddress, contractType]);

  return {
    loading,
    error,
    series,
    boxes,
    getAllSeries,
    getUserBoxes,
    createSeries,
    purchaseBox,
    openBox,
    withdrawPrize,
    depositPrizeFund,
    getContractBalance,
    getContractOwner,
    refreshSeries,
    refreshBoxes,
  };
}

