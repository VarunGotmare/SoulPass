"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
  _id: string;
  name: string;
  description: string;
  image?: string;       // ipfs://
  metadataUri?: string; // ipfs://
  claimCode?: string;   // optional
  createdAt: string;
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  // Convert ipfs://CID → gateway url
  const ipfsToGateway = (uri?: string) => {
    if (!uri) return "";
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  };

  return (
    <main className="p-8 max-w-7xl mx-auto text-gray-200 bg-neutral-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold">🎟️ SoulPass Admin</h1>
        <Link
          href="/create-event"
          className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-sm rounded-md hover:bg-neutral-700 transition"
        >
          + Create Event
        </Link>
      </div>

      {/* Event List */}
      <h2 className="text-xl font-semibold mb-6">Existing Events</h2>

      {events.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <li
              key={event._id}
              className="w-full max-w-xs p-5 border border-neutral-800 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition"
            >
              {/* Event Image */}
              {event.image && (
                <div className="w-full h-40 mb-4 overflow-hidden rounded-md bg-neutral-800">
                  <img
                    src={ipfsToGateway(event.image)}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Event Details */}
              <h3 className="text-lg font-medium mb-2">{event.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{event.description}</p>

              <p className="text-xs text-gray-500 mb-1">
                📅 {new Date(event.createdAt).toLocaleString()}
              </p>

              {event.claimCode && (
                <p className="text-xs text-gray-300 font-mono">
                  Claim Code: {event.claimCode}
                </p>
              )}

              {/* Metadata Link */}
              {event.metadataUri && (
                <a
                  href={ipfsToGateway(event.metadataUri)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline mt-2 inline-block"
                >
                  View Metadata ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No events created yet.</p>
      )}
    </main>
  );
}
