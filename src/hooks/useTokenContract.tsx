import { useState, useEffect } from "react";
import { ethers, Contract, Network } from "ethers";
import { useWeb3 } from "./useWeb3";

const CONTRACT_ADDRESS = "0x9F62d8Eaf274dba756C8189AeA325704Dc8BeE5a";
const CONTRACT_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

export const useTokenContract = () => {
  const { account, signer, isConnected } = useWeb3();
  const [balance, setBalance] = useState<string>("0");
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [decimals, setDecimals] = useState<number>(18);
  const [symbol, setSymbol] = useState<string>("SMOOTH");
  const [loading, setLoading] = useState(false);

  const getContract = (withSigner = false): Contract | null => {
    if (!window.ethereum) return null;
    
    // Create network without ENS support for Polygon
    const polygonNetwork = Network.from({
      chainId: 137,
      name: 'polygon',
      ensAddress: null
    });
    
    const provider = new ethers.BrowserProvider(window.ethereum, polygonNetwork);
    
    if (withSigner && signer) {
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
    
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  };

  const fetchTokenData = async () => {
    try {
      const contract = getContract();
      if (!contract) return;

      const [totalSupplyBN, decimalsBN, symbolStr] = await Promise.all([
        contract.totalSupply(),
        contract.decimals(),
        contract.symbol(),
      ]);

      const decimalsNum = Number(decimalsBN);
      setDecimals(decimalsNum);
      setTotalSupply(ethers.formatUnits(totalSupplyBN, decimalsNum));
      setSymbol(symbolStr);
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  const fetchBalance = async () => {
    if (!account || !isConnected) {
      setBalance("0");
      return;
    }

    try {
      const contract = getContract();
      if (!contract) return;

      const balanceBN = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(balanceBN, decimals));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0");
    }
  };

  const transferTokens = async (recipient: string, amount: string) => {
    if (!signer) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      const contract = getContract(true);
      if (!contract) throw new Error("Contract not available");

      const amountBN = ethers.parseUnits(amount, decimals);
      const tx = await contract.transfer(recipient, amountBN);
      await tx.wait();
      
      // Refresh balance after transfer
      await fetchBalance();
      
      return tx;
    } catch (error) {
      console.error("Error transferring tokens:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveTokens = async (spender: string, amount: string) => {
    if (!signer) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      const contract = getContract(true);
      if (!contract) throw new Error("Contract not available");

      const amountBN = ethers.parseUnits(amount, decimals);
      const tx = await contract.approve(spender, amountBN);
      await tx.wait();
      
      return tx;
    } catch (error) {
      console.error("Error approving tokens:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, []);

  useEffect(() => {
    if (isConnected && account) {
      fetchBalance();
    }
  }, [account, isConnected, decimals]);

  return {
    balance,
    totalSupply,
    decimals,
    symbol,
    loading,
    transferTokens,
    approveTokens,
    fetchBalance,
    contractAddress: CONTRACT_ADDRESS,
  };
};
