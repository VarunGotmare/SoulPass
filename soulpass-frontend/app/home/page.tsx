'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../Components/Navbar'; // ✅ Shared Navbar

interface Event {
  _id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
}

export default function HomePage() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (ready && authenticated) {
      fetch('/api/events')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setEvents(data.events);
        })
        .catch((err) => console.error('❌ Error fetching events:', err))
        .finally(() => setLoading(false));
    }
  }, [ready, authenticated]);

  if (!ready || !authenticated) {
    return <p className="text-center mt-20 text-lg">Loading your dashboard...</p>;
  }

  const ipfsToGateway = (uri?: string) =>
    uri ? uri.replace('ipfs://', 'https://ipfs.io/ipfs/') : '';

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

          {loading ? (
            <p className="text-gray-500">⏳ Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500 italic">No events available yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:border-blue-400 transition p-4 flex flex-col justify-between"
                >
                  {event.image && (
                    <img
                      src={ipfsToGateway(event.image)}
                      alt={event.name}
                      className="rounded-lg mb-3 w-full h-40 object-cover"
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-blue-800">{event.name}</h4>
                    <span className="inline-block mt-1 text-sm text-white bg-blue-600 px-2 py-0.5 rounded">
                      {new Date(event.createdAt).toLocaleDateString()}
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
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-600 bg-transparent">
        Made with ❤️ by Team SoulPass — Secure Your Credentials on Chain 🛡️
      </footer>
    </div>
  );
}
