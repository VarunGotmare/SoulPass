'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { soulPassContract, publicClient } from '@/lib/contract';
import Navbar from '../../Components/Navbar'; // ✅ Shared Navbar

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

export default function ProfilePage() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
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

        const nftResults: NFTMetadata[] = [];

        for (let i = 0; i < Number(balance); i++) {
          const tokenId = await publicClient.readContract({
            ...soulPassContract,
            functionName: 'tokenOfOwnerByIndex',
            args: [user.wallet.address, BigInt(i)],
          });

          const tokenURI: string = await publicClient.readContract({
            ...soulPassContract,
            functionName: 'tokenURI',
            args: [tokenId],
          });

          const metadataURL = tokenURI.replace(
            'ipfs://',
            'https://gateway.pinata.cloud/ipfs/'
          );

          const metadata = await fetch(metadataURL)
            .then((res) => res.json())
            .then((data) => ({
              ...data,
              image: data.image.replace(
                'ipfs://',
                'https://gateway.pinata.cloud/ipfs/'
              ),
            }))
            .catch(() => null);

          if (metadata) nftResults.push(metadata);
        }

        setNfts(nftResults);
      } catch (err) {
        console.error('Error fetching NFTs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authenticated && user?.wallet?.address) fetchNFTs();
  }, [authenticated, user]);

  if (!ready || !authenticated)
    return (
      <p className="text-center mt-20 text-lg text-gray-400">
        Loading profile...
      </p>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-950 text-gray-100">
      {/* ✅ Navbar */}
      <Navbar showProfile={true} />

      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto w-full">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-fuchsia-400">
            👤 My Profile
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Email: <span className="text-blue-300">{user.email?.address}</span>
          </p>
          <p className="text-sm text-gray-400">
            Wallet:{' '}
            <span className="font-mono text-xs text-green-400">
              {user.wallet?.address}
            </span>
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-purple-300">
            🎟️ Your Event NFTs
          </h2>

          {loading ? (
            <p className="text-gray-400">⏳ Fetching your NFTs...</p>
          ) : nfts.length === 0 ? (
            <p className="text-gray-500 italic">
              No NFTs found. Attend an event to start your collection!
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {nfts.map((nft, index) => (
                <div
                  key={index}
                  className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition p-4 flex flex-col"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-700"
                  />
                  <h3 className="text-lg font-bold text-fuchsia-300">
                    {nft.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{nft.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        Powered by{' '}
        <span className="text-purple-400 font-semibold">SoulPass 🛡️</span>
      </footer>
    </div>
  );
}
