// app/providers/WagmiPrivyProvider.tsx
'use client';

import { createConfig, http, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
// const privyAppId = "cmcovi3wm01u3l40mcf17b1ic";

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function WagmiPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId= {privyAppId}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
