import { createPublicClient, http, defineChain } from 'viem';
import SoulPassNFT from '../abi/SoulPassNFT.json';

//  Define Hardhat local chain manually
export const hardhatLocal = defineChain({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'], // your local node
    },
  },
});

export const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // from your Hardhat deploy log

export const soulPassContract = {
  address: contractAddress as `0x${string}`,
  abi: SoulPassNFT.abi,
} as const;

export const publicClient = createPublicClient({
  chain: hardhatLocal,
  transport: http('http://localhost:8545'),
});
