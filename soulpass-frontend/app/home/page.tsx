'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import events from '@/data/events.json';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  nft?: {
    name: string;
    description: string;
    image: string;
    attributes?: { trait_type: string; value: string }[];
  };
}

export default function HomePage() {
  const { ready, authenticated, user, logout } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) return <p>Loading...</p>;

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">👋 Hello, {user?.email?.address}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Wallet: {user?.wallet?.address}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/profile"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <section>
          <h2 className="text-xl font-semibold mb-6">📅 Upcoming Events</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {(events as Event[]).map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow p-4 border hover:border-blue-400 transition"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="rounded-md mb-3 w-full h-40 object-cover"
                  />
                )}
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-gray-500 text-sm">{event.date}</p>
                <p className="mt-2 text-sm">{event.description}</p>
                <button
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  disabled
                >
                  Attend Now!
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
