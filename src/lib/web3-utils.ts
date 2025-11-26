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
  // Create provider without automatic network detection
  const provider = new BrowserProvider(ethereum, 'any');
  return provider;
};
