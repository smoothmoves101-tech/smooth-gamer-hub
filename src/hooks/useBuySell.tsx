import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "./useWeb3";
import { useTokenContract } from "./useTokenContract";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

// Presale wallet address - replace with your actual wallet
const PRESALE_WALLET = "0x0000000000000000000000000000000000000000"; // TODO: Replace with your wallet address

export const useBuySell = () => {
  const [loading, setLoading] = useState(false);
  const { account, signer, isConnected, chainId } = useWeb3();
  const { balance, symbol, fetchBalance } = useTokenContract();
  const { toast } = useToast();

  const TOKEN_PRICE_USD = 0.005;
  const MATIC_PRICE_USD = 0.80; // Approximate, should be fetched from oracle in production
  const TOKEN_PRICE_MATIC = TOKEN_PRICE_USD / MATIC_PRICE_USD;

  const buyTokens = async (tokenAmount: number) => {
    if (!isConnected || !account || !signer) {
      throw new Error("Wallet not connected");
    }

    if (chainId !== 137) {
      throw new Error("Please switch to Polygon network");
    }

    if (tokenAmount <= 0) {
      throw new Error("Invalid token amount");
    }

    setLoading(true);
    try {
      // Calculate MATIC payment amount
      const maticAmount = tokenAmount * TOKEN_PRICE_MATIC;
      const maticAmountWei = ethers.parseEther(maticAmount.toFixed(18));

      console.log(`Buying ${tokenAmount} tokens for ${maticAmount} MATIC`);

      // Send MATIC to presale wallet
      const tx = await signer.sendTransaction({
        to: PRESALE_WALLET,
        value: maticAmountWei,
      });

      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction failed");
      }

      console.log("Transaction confirmed:", receipt.hash);

      // Record the purchase in database
      const { data, error } = await supabase.functions.invoke('process-token-purchase', {
        body: {
          walletAddress: account,
          tokenAmount: tokenAmount,
          paymentAmount: maticAmount,
          transactionHash: receipt.hash,
          orderType: 'buy'
        }
      });

      if (error) {
        console.error("Error recording purchase:", error);
        toast({
          title: "Purchase Sent",
          description: `Transaction successful! Hash: ${receipt.hash.substring(0, 10)}... Your tokens will be sent shortly.`,
        });
      } else {
        toast({
          title: "Purchase Complete!",
          description: `Successfully purchased ${tokenAmount} ${symbol}! Transaction: ${receipt.hash.substring(0, 10)}...`,
        });
      }

      // Refresh balance
      await fetchBalance();

      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      console.error("Buy error:", error);
      
      let errorMessage = "Failed to complete purchase";
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = "Transaction rejected by user";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sellTokens = async (tokenAmount: number) => {
    if (!isConnected || !account) {
      throw new Error("Wallet not connected");
    }

    if (chainId !== 137) {
      throw new Error("Please switch to Polygon network");
    }

    if (tokenAmount <= 0) {
      throw new Error("Invalid token amount");
    }

    const balanceNum = parseFloat(balance);
    if (tokenAmount > balanceNum) {
      throw new Error(`Insufficient balance. You have ${balanceNum.toFixed(2)} ${symbol}`);
    }

    setLoading(true);
    try {
      toast({
        title: "Sell Feature",
        description: `To sell ${tokenAmount} ${symbol}, please use a DEX like QuickSwap or contact support for OTC sales.`,
      });

      return { success: false, message: "Use DEX for selling" };
    } catch (error: any) {
      console.error("Sell error:", error);
      
      toast({
        title: "Sale Failed",
        description: error.message || "Failed to complete sale",
        variant: "destructive",
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    buyTokens,
    sellTokens,
    loading,
    balance,
    symbol,
    tokenPriceUsd: TOKEN_PRICE_USD,
    tokenPriceMatic: TOKEN_PRICE_MATIC,
  };
};
