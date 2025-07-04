'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/home'); // Redirect if logged in
    }
  }, [ready, authenticated, router]);

  if (!ready) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Welcome to SoulPass</h1>
      <p className="text-gray-600">Proof of Attendance using NFTs</p>
      <button
        onClick={login}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Login to Get Started
      </button>
    </div>
  );
}
