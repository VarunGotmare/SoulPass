'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { ready, authenticated, user, logout } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/'); // Redirect to landing if not logged in
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) return <p>Loading...</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Hello, {user?.email?.address}</h1>
      <p>Your wallet: {user?.wallet?.address}</p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </main>
  );
}
