'use client';

import QrScanner from 'qr-scanner';
import { useEffect, useRef } from 'react';

interface QrScannerProps {
  onScan: (result: string) => void;
  active: boolean;
}

export default function QrScannerComponent({ onScan, active }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (!videoRef.current || !active) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => onScan(result.data),
      { returnDetailedScanResult: true }
    );
    scannerRef.current = scanner;

    scanner.start().catch(console.error);

    return () => {
      scanner.stop().catch(() => {});
      scanner.destroy();
    };
  }, [active, onScan]);

  return (
    <video ref={videoRef} className="w-full h-64 rounded shadow bg-black" />
  );
}
