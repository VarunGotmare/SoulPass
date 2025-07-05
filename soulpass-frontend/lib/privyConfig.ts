// lib/privyConfig.ts
import type { PrivyClientConfig } from '@privy-io/react-auth';

const hardhatChain = {
  id: 31337, // Hardhat local chain ID
  name: 'Hardhat Local',
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
  },
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
};

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ['email'],
  appearance: {
    showWalletLoginFirst: true,
  },
  defaultChain: hardhatChain,
  supportedChains: [hardhatChain],
};
