'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletClient } from 'wagmi';
import claimCodes from '@/data/claimCodes.json';
import { soulPassContract } from '@/lib/contract';

interface ClaimCode {
  code: string;
  eventId: string;
}

export default function ClaimPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const [codeInput, setCodeInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  const handleClaim = async () => {
  const code = codeInput.trim();
  const match = (claimCodes as ClaimCode[]).find((c) => c.code === code);

  if (!match) {
    setStatus('❌ Invalid claim code.');
    return;
  }

  if (!walletClient || !walletClient.account) {
    setStatus('❌ Wallet not connected. Please refresh.');
    return;
  }

  try {
    setStatus('🔄 Switching to Hardhat chain...');
    await walletClient.switchChain({ id: 31337 }); // ✅ this is the fix

    setStatus('⏳ Claiming NFT...');

    const hash = await walletClient.writeContract({
      address: soulPassContract.address,
      abi: soulPassContract.abi,
      functionName: 'claimWithCode',
      args: [code],
      account: walletClient.account,
    });

    setStatus(`✅ NFT claimed for event "${match.eventId}"!\nTx Hash: ${hash}`);
  } catch (error: any) {
    console.error(error);
    setStatus(`❌ Error: ${error?.shortMessage || error?.message || 'Unknown error'}`);
  }
};


  if (!ready || !authenticated) return <p>Loading...</p>;

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">🎟️ Claim Your Event NFT</h1>

        <p className="mb-4 text-gray-700">
          Enter the claim code you received from an event to mint your NFT.
        </p>

        <input
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="Enter claim code..."
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleClaim}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Claim NFT
        </button>

        {status && (
          <p className="mt-4 text-center text-sm font-medium text-gray-800 whitespace-pre-line">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}
