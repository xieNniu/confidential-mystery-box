import * as React from 'react';
import { ContractType, GatewayStatus } from '../types';
import { FHEVM_CONFIG, GATEWAY_CHECK_INTERVAL } from '../config/constants';

interface ContractContextType {
  contractType: ContractType;
  setContractType: (type: ContractType) => void;
  gatewayStatus: GatewayStatus;
  isAutoMode: boolean;
  setAutoMode: (auto: boolean) => void;
  checkGatewayHealth: () => Promise<boolean>;
}

const ContractContext = React.createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const [contractType, setContractTypeState] = React.useState<ContractType>('simple');
  const [gatewayStatus, setGatewayStatus] = React.useState<GatewayStatus>('checking');
  const [isAutoMode, setIsAutoMode] = React.useState<boolean>(true);

  /**
   * Check Gateway health
   */
  const checkGatewayHealth = async (): Promise<boolean> => {
    const url = `${FHEVM_CONFIG.gatewayUrl}/public_key`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const resp = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!resp.ok) {
        console.warn('⚠️ Gateway 不可用: HTTP', resp.status);
        return false;
      }
      
      const text = await resp.text();
      const isValid = text.startsWith('0x04') && text.length >= 66;
      
      if (!isValid) {
        console.warn('⚠️ Gateway 返回无效的公钥');
      }
      
      return isValid;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ Gateway 请求超时');
      } else {
        console.warn('⚠️ Gateway 不可用:', error.message);
      }
      return false;
    }
  };

  /**
   * Update contract type with auto mode consideration
   */
  const setContractType = (type: ContractType) => {
    console.log('📍 切换合约类型:', type);
    setContractTypeState(type);
    
    // Disable auto mode when manually switching
    if (!isAutoMode && type !== contractType) {
      setIsAutoMode(false);
    }
  };

  /**
   * Set auto mode
   */
  const setAutoMode = (auto: boolean) => {
    console.log('🔄 自动模式:', auto ? '开启' : '关闭');
    setIsAutoMode(auto);
  };

  /**
   * Initialize and poll Gateway status
   */
  React.useEffect(() => {
    const pollGateway = async () => {
      setGatewayStatus('checking');
      
      const isUp = await checkGatewayHealth();
      const newStatus: GatewayStatus = isUp ? 'up' : 'down';
      
      if (newStatus !== gatewayStatus) {
        console.log('📊 Gateway 状态变化:', newStatus);
        setGatewayStatus(newStatus);
        
        // Auto switch contract type if in auto mode
        if (isAutoMode) {
          const newType: ContractType = isUp ? 'fhe' : 'simple';
          if (newType !== contractType) {
            console.log('🔄 自动切换到:', newType);
            setContractTypeState(newType);
          }
        }
      } else {
        setGatewayStatus(newStatus);
      }
    };

    // Initial check
    pollGateway();

    // Poll every 60 seconds
    const interval = setInterval(pollGateway, GATEWAY_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [gatewayStatus, contractType, isAutoMode]);

  const value: ContractContextType = {
    contractType,
    setContractType,
    gatewayStatus,
    isAutoMode,
    setAutoMode,
    checkGatewayHealth,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = React.useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}


