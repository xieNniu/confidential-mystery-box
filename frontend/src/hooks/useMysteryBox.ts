import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContractInteraction } from './useContract';
import { encryptNumber } from '../utils/fhevm';
import { formatEth, parseEth, generatePrizePool, getRandomPrizeAmount, waitForTransaction } from '../utils/helpers';
import { BoxSeries, UserBox } from '../types';

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
          // FHE mode
          boxes.push({
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
   * Open box
   */
  const openBox = useCallback(
    async (boxId: number): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getContractInstance();
        const tx = await contract.openBox(boxId);
        await waitForTransaction(tx);

        if (contractType === 'fhe') {
          console.log('✅ 开盒请求已发送，等待 Gateway 解密...');
        } else {
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
    [getContractInstance, contractType]
  );

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

