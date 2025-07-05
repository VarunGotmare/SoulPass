import { defineChain } from 'viem';
import { http } from 'wagmi';
import { createConfig } from '@privy-io/wagmi';

const hardhat = defineChain({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
});
