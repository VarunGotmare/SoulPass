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
  const { data: walletClient } = useWalletClient(); // ✅ correct hook usage

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
    if (scanning) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopScanner(); // stop live scan if active

    const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true }).catch((err) => {
      console.error(err);
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
      console.error(err);
      setStatus(`❌ Error: ${err?.shortMessage || err?.message || 'Unknown error'}`);
      scannedCodes.current.delete(code);
    }
  };

  if (!ready || !authenticated) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-10 bg-gray-50">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold">🎟️ Claim Your Event NFT</h1>
          <p className="text-gray-700">Scan using your camera or upload a QR image to claim instantly.</p>

          <div className="flex flex-col items-center gap-4">
            {/* Video feed */}
            <video ref={videoRef} className="w-full max-w-sm rounded shadow bg-white" />

            {/* Hybrid scan toggle */}
            <button
              onClick={toggleScanner}
              className={`px-4 py-2 rounded text-white ${scanning ? 'bg-red-500' : 'bg-green-600'}`}
            >
              {scanning ? '🛑 Stop Scanning' : '📷 Start Scanning'}
            </button>

            {/* Hybrid image upload toggle */}
            {!imageUploaded ? (
              <label className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded cursor-pointer">
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
                className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded"
              >
                ❌ Remove Image
              </button>
            )}
          </div>

          {/* Status message */}
          {status && (
            <p className="mt-4 text-center text-sm font-medium text-gray-800 whitespace-pre-line">
              {status}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
