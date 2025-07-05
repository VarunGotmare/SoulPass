'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readContracts } from '@wagmi/core';
import { soulPassContract } from '@/lib/contract';
import { baseSepolia } from 'viem/chains';
import { publicClient } from '@/lib/contract';

export default function ProfilePage() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [tokenURIs, setTokenURIs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !authenticated) router.replace('/');
  }, [ready, authenticated, router]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!user?.wallet?.address) return;

      try {
        const balance = await publicClient.readContract({
          ...soulPassContract,
          functionName: 'balanceOf',
          args: [user.wallet.address],
        });

        const promises = [];
        for (let i = 0; i < Number(balance); i++) {
          const tokenId = await publicClient.readContract({
            ...soulPassContract,
            functionName: 'tokenOfOwnerByIndex',
            args: [user.wallet.address, BigInt(i)],
          });

          promises.push(
            publicClient.readContract({
              ...soulPassContract,
              functionName: 'tokenURI',
              args: [tokenId],
            })
          );
        }

        const uris = await Promise.all(promises);
        setTokenURIs(uris);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authenticated && user?.wallet?.address) fetchNFTs();
  }, [authenticated, user]);

  if (!ready || !authenticated) return <p>Loading...</p>;

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">👤 Your Profile</h1>
        <p className="text-sm text-gray-600 mb-4">Email: {user.email?.address}</p>
        <p className="text-sm text-gray-600 mb-8">Wallet: {user.wallet?.address}</p>

        <h2 className="text-xl font-semibold mb-4">🎟️ Your Event NFTs</h2>
        {loading ? (
          <p>Loading NFTs...</p>
        ) : tokenURIs.length === 0 ? (
          <p>No NFTs found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {tokenURIs.map((uri, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow border">
                <img
                  src={uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                  alt={`NFT ${index}`}
                  className="rounded-md mb-3 w-full h-40 object-cover"
                />
                <p className="text-sm break-words text-gray-700">{uri}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
