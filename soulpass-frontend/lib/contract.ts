// lib/contract.ts
import { baseSepolia } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';
import SoulPassNFT from '../abi/SoulPassNFT.json';

export const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Local or Sepolia

export const soulPassContract = {
  address: contractAddress as `0x${string}`,
  abi: SoulPassNFT.abi,
} as const;

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
