import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { useContract as useContractContext } from '../contexts/ContractContext';
import {
  CONTRACT_ADDRESS_SIMPLE,
  CONTRACT_ADDRESS_FHE,
} from '../config/constants';
import {
  MYSTERY_BOX_SIMPLE_ABI,
  MYSTERY_BOX_FHE_ABI,
} from '../config/abis';

export function useContractInteraction() {
  const { getSigner, address } = useWallet();
  const { contractType } = useContractContext();

  /**
   * Get current contract instance
   */
  const getContractInstance = async () => {
    const signer = await getSigner();
    if (!signer) {
      throw new Error('请先连接钱包');
    }

    const contractAddress =
      contractType === 'fhe' ? CONTRACT_ADDRESS_FHE : CONTRACT_ADDRESS_SIMPLE;
    const abi =
      contractType === 'fhe' ? MYSTERY_BOX_FHE_ABI : MYSTERY_BOX_SIMPLE_ABI;

    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log('📍 使用合约:', contractAddress, '模式:', contractType);

    return contract;
  };

  /**
   * Get contract address
   */
  const getContractAddress = (): string => {
    return contractType === 'fhe' ? CONTRACT_ADDRESS_FHE : CONTRACT_ADDRESS_SIMPLE;
  };

  return {
    getContractInstance,
    getContractAddress,
    contractType,
    userAddress: address,
  };
}


