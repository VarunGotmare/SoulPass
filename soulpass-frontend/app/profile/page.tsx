'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { soulPassContract, publicClient } from '@/lib/contract';

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

          console.log('Fetched TokenURI:', tokenId.toString(), tokenURI);

          const metadataURL = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

          const metadata = await fetch(metadataURL)
            .then(res => res.json())
            .then((data) => ({
              ...data,
              image: data.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
            }))
            .catch(() => null); // skip if metadata is broken

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

  if (!ready || !authenticated) return <p>Loading profile...</p>;

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">👤 Your Profile</h1>
          <p className="text-sm text-gray-600">Email: {user.email?.address}</p>
          <p className="text-sm text-gray-600 mb-4">Wallet: {user.wallet?.address}</p>
        </header>

        <section>
          <h2 className="text-xl font-semibold mb-4">🎟️ Your Event NFTs</h2>

          {loading ? (
            <p>Loading NFTs...</p>
          ) : nfts.length === 0 ? (
            <p>No NFTs found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {nfts.map((nft, index) => (
                <div key={index} className="bg-white border shadow p-4 rounded-xl">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold">{nft.name}</h3>
                  <p className="text-gray-600 text-sm">{nft.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
