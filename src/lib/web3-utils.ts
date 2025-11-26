import { BrowserProvider, Network } from 'ethers';

/**
 * Creates a Polygon network configuration without ENS support
 * This prevents "network does not support ENS" errors
 */
export const createPolygonNetwork = (): Network => {
  return new Network('polygon', 137);
};

/**
 * Creates a BrowserProvider configured for Polygon without ENS
 */
export const createPolygonProvider = (ethereum: any): BrowserProvider => {
  // Create a network object that explicitly disables ENS
  const network = new Network('polygon', 137);
  
  // Create provider with the network that has no ENS support
  const provider = new BrowserProvider(ethereum, network);
  
  // Override the network property to ensure ENS is never attempted
  Object.defineProperty(provider, '_network', {
    value: network,
    writable: false
  });
  
  return provider;
};
