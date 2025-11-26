import { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { useWeb3 } from './useWeb3';
import { useTokenContract } from './useTokenContract';

// QuickSwap Router (Uniswap V2 fork on Polygon)
const ROUTER_ADDRESS = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';
const WMATIC_ADDRESS = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';

const ROUTER_ABI = [
  'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)'
];

export const useUniswapLiquidity = () => {
  const [loading, setLoading] = useState(false);
  const { signer, account } = useWeb3();
  const { contractAddress, approveTokens } = useTokenContract();

  const addLiquidity = async (tokenAmount: string, maticAmount: string) => {
    if (!signer || !account) {
      toast.error('Please connect your wallet');
      return { success: false };
    }

    setLoading(true);
    try {
      const routerContract = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

      // Convert amounts to Wei
      const tokenAmountWei = ethers.parseEther(tokenAmount);
      const maticAmountWei = ethers.parseEther(maticAmount);

      // First approve the router to spend tokens
      toast.info('Approving tokens...');
      await approveTokens(ROUTER_ADDRESS, tokenAmount);

      // Add some buffer time for approval to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Set deadline to 20 minutes from now
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Add liquidity with MATIC (ETH equivalent on Polygon)
      toast.info('Adding liquidity to Uniswap pool...');
      const tx = await routerContract.addLiquidityETH(
        contractAddress,
        tokenAmountWei,
        ethers.parseEther((parseFloat(tokenAmount) * 0.95).toString()), // 5% slippage
        ethers.parseEther((parseFloat(maticAmount) * 0.95).toString()), // 5% slippage
        account,
        deadline,
        { value: maticAmountWei }
      );

      toast.info('Waiting for confirmation...');
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success('Liquidity added successfully!');
        return { success: true, txHash: receipt.hash };
      } else {
        toast.error('Transaction failed');
        return { success: false };
      }
    } catch (error: any) {
      console.error('Error adding liquidity:', error);
      toast.error(error.message || 'Failed to add liquidity');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    addLiquidity,
    loading
  };
};