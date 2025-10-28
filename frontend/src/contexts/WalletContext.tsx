import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { NETWORK_CONFIG } from '../config/constants';
import { WalletState } from '../types';

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  getProvider: () => ethers.BrowserProvider | null;
  getSigner: () => Promise<ethers.Signer | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: '0',
    isConnected: false,
    isCorrectNetwork: false,
  });

  /**
   * Get provider instance
   */
  const getProvider = (): ethers.BrowserProvider | null => {
    if (typeof window.ethereum === 'undefined') {
      console.error('❌ MetaMask 未安装');
      return null;
    }
    return new ethers.BrowserProvider(window.ethereum);
  };

  /**
   * Get signer instance
   */
  const getSigner = async (): Promise<ethers.Signer | null> => {
    const provider = getProvider();
    if (!provider) return null;
    
    try {
      return await provider.getSigner();
    } catch (error) {
      console.error('❌ 获取 Signer 失败:', error);
      return null;
    }
  };

  /**
   * Check if on correct network
   */
  const checkNetwork = async (): Promise<boolean> => {
    const provider = getProvider();
    if (!provider) return false;

    try {
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      return chainId === NETWORK_CONFIG.chainId;
    } catch (error) {
      console.error('❌ 检查网络失败:', error);
      return false;
    }
  };

  /**
   * Connect wallet
   */
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('请安装 MetaMask!');
      return;
    }

    try {
      const provider = getProvider();
      if (!provider) return;

      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      // Get balance
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);

      // Check network
      const isCorrectNetwork = await checkNetwork();

      setWalletState({
        address,
        balance: balanceInEth,
        isConnected: true,
        isCorrectNetwork,
      });

      console.log('✅ 钱包已连接:', address);
      
      if (!isCorrectNetwork) {
        console.warn('⚠️ 请切换到 Sepolia 网络');
      }
    } catch (error: any) {
      console.error('❌ 连接钱包失败:', error);
      alert('连接钱包失败: ' + error.message);
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    setWalletState({
      address: null,
      balance: '0',
      isConnected: false,
      isCorrectNetwork: false,
    });
    console.log('🔌 钱包已断开');
  };

  /**
   * Switch to Sepolia network
   */
  const switchNetwork = async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + NETWORK_CONFIG.chainId.toString(16) }],
      });
      
      // Re-check network status
      const isCorrectNetwork = await checkNetwork();
      setWalletState(prev => ({ ...prev, isCorrectNetwork }));
      
      console.log('✅ 已切换到 Sepolia 网络');
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x' + NETWORK_CONFIG.chainId.toString(16),
              chainName: NETWORK_CONFIG.chainName,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            }],
          });
          
          const isCorrectNetwork = await checkNetwork();
          setWalletState(prev => ({ ...prev, isCorrectNetwork }));
        } catch (addError) {
          console.error('❌ 添加网络失败:', addError);
        }
      } else {
        console.error('❌ 切换网络失败:', error);
      }
    }
  };

  /**
   * Listen for account and network changes
   */
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.address) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletState.address]);

  /**
   * Auto-connect if previously connected
   */
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window.ethereum === 'undefined') return;
      
      const provider = getProvider();
      if (!provider) return;

      try {
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          connectWallet();
        }
      } catch (error) {
        console.error('❌ 自动连接失败:', error);
      }
    };

    autoConnect();
  }, []);

  const value: WalletContextType = {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getProvider,
    getSigner,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Extend Window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}


