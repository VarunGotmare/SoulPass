'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useWalletClient } from 'wagmi';
import QrScanner from 'qr-scanner';
import claimCodes from '@/data/claimCodes.json';
import { soulPassContract } from '@/lib/contract';
import Navbar from '@/Components/Navbar';

interface ClaimCode {
  code: string;
  eventId: string;
}

export default function ClaimPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { data: walletClient } = useWalletClient();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const [scanning, setScanning] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const scannedCodes = useRef<Set<string>>(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  const startScanner = () => {
    if (!videoRef.current || scannerRef.current) return;

    scannerRef.current = new QrScanner(
      videoRef.current,
      async (result) => {
        if (scannedCodes.current.has(result.data)) return;
        scannedCodes.current.add(result.data);
        setStatus('✅ QR code scanned. Claiming...');
        await handleClaim(result.data);
      },
      { returnDetailedScanResult: true }
    );

    scannerRef.current.start();
    setScanning(true);
  };

  const stopScanner = () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setScanning(false);
  };

  const toggleScanner = () => {
    if (scanning) stopScanner();
    else startScanner();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopScanner(); // stop live scan if active

    const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true }).catch(() => {
      setStatus('❌ Could not read QR from image.');
    });

    if (result?.data) {
      setImageUploaded(true);
      setStatus('✅ QR code scanned from image. Claiming...');
      await handleClaim(result.data);
    }
  };

  const handleRemoveImage = () => {
    setImageUploaded(false);
    setStatus(null);
    scannedCodes.current.clear();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClaim = async (rawCode: string) => {
    const code = rawCode.trim();
    const match = (claimCodes as ClaimCode[]).find((c) => c.code === code);

    if (!match) {
      setStatus('❌ Invalid claim code.');
      scannedCodes.current.delete(code);
      return;
    }

    if (!walletClient || !walletClient.account) {
      setStatus('❌ Wallet not connected. Please refresh or reconnect wallet.');
      scannedCodes.current.delete(code);
      return;
    }

    try {
      setStatus('🔄 Switching to Hardhat chain...');
      await walletClient.switchChain({ id: 31337 });

      setStatus('⏳ Claiming NFT...');

      const hash = await walletClient.writeContract({
        address: soulPassContract.address,
        abi: soulPassContract.abi,
        functionName: 'claimWithCode',
        args: [code],
        account: walletClient.account,
      });

      setStatus(`✅ NFT claimed for event "${match.eventId}"!\nTx Hash: ${hash}`);
    } catch (err: any) {
      setStatus(`❌ Error: ${err?.shortMessage || err?.message || 'Unknown error'}`);
      scannedCodes.current.delete(code);
    }
  };

  if (!ready || !authenticated) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-gray-100">
      <Navbar />

      <main className="flex-grow px-6 py-12 flex items-center justify-center">
        <div className="max-w-xl w-full bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-8 space-y-6">
          <h1 className="text-3xl font-bold text-fuchsia-400 text-center">
            🎟️ Claim Your Event NFT
          </h1>
          <p className="text-center text-gray-400">
            Scan using your camera or upload a QR image to claim instantly.
          </p>

          {/* Video feed */}
          <div className="flex flex-col items-center gap-4">
            <video
              ref={videoRef}
              className="w-full max-w-sm rounded-lg shadow border border-gray-700 bg-black"
            />

            {/* Hybrid scan toggle */}
            <button
              onClick={toggleScanner}
              className={`px-5 py-2 rounded font-medium transition text-white ${
                scanning
                  ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              }`}
            >
              {scanning ? '🛑 Stop Scanning' : '📷 Start Scanning'}
            </button>

            {/* Hybrid image upload toggle */}
            {!imageUploaded ? (
              <label className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-5 py-2 rounded cursor-pointer text-white font-medium transition">
                📁 Upload QR Image
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <button
                onClick={handleRemoveImage}
                className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 px-5 py-2 rounded text-white font-medium transition"
              >
                ❌ Remove Image
              </button>
            )}
          </div>

          {/* Status message */}
          {status && (
            <p
              className={`mt-4 text-center text-sm font-medium whitespace-pre-line ${
                status.startsWith('✅')
                  ? 'text-green-400'
                  : status.startsWith('❌')
                  ? 'text-red-400'
                  : 'text-yellow-300'
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        Made with ❤️ by <span className="text-purple-400">Team SoulPass</span>
      </footer>
    </div>
  );
}
