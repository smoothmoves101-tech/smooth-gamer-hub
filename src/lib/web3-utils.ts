import { BrowserProvider, JsonRpcSigner } from 'ethers';

/**
 * Creates a BrowserProvider that completely bypasses ENS resolution
 * This is critical for Polygon network which doesn't support ENS
 */
export const createPolygonProvider = (ethereum: any): BrowserProvider => {
  // Create provider without any network - this prevents automatic ENS lookups
  const provider = new BrowserProvider(ethereum, {
    chainId: 137,
    name: 'polygon',
  });
  
  // Override resolveName to prevent ENS lookups
  provider.resolveName = async (name: string) => {
    // If it's already an address, return it
    if (name.startsWith('0x')) {
      return name;
    }
    // Don't attempt ENS resolution
    return null;
  };
  
  return provider;
};

/**
 * Gets a signer that won't attempt ENS resolution
 */
export const getPolygonSigner = async (provider: BrowserProvider): Promise<JsonRpcSigner> => {
  const signer = await provider.getSigner();
  
  // Override resolveName on the signer as well
  (signer as any).resolveName = async (name: string) => {
    if (name.startsWith('0x')) {
      return name;
    }
    return null;
  };
  
  return signer;
};
