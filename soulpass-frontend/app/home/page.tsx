'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import events from '@/data/events.json';
import Navbar from '../../Components/Navbar'; // ✅ Import your shared Navbar component

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
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return <p className="text-center mt-20 text-lg">Loading your dashboard...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 text-gray-800">
      {/* ✅ Shared Navbar */}
      <Navbar showProfile={true} />

      {/* Main content */}
      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold mb-2">👋 Welcome, {user?.email?.address}</h2>
          <p className="text-gray-600">
            Your wallet: <span className="font-mono text-sm">{user?.wallet?.address}</span>
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-6">📅 Upcoming Events</h3>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {(events as Event[]).map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:border-blue-400 transition p-4 flex flex-col justify-between"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="rounded-lg mb-3 w-full h-40 object-cover"
                  />
                )}
                <div>
                  <h4 className="text-lg font-bold text-blue-800">{event.title}</h4>
                  <span className="inline-block mt-1 text-sm text-white bg-blue-600 px-2 py-0.5 rounded">
                    {event.date}
                  </span>
                  <p className="mt-2 text-sm text-gray-700">{event.description}</p>
                </div>
                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
                  disabled
                >
                  🎟️ Attend Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-600 bg-transparent">
        Made with ❤️ by Team SoulPass — Secure Your Credentials on Chain 🛡️
      </footer>
    </div>
  );
}
