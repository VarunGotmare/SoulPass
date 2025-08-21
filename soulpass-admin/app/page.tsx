"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  claimCode: string;
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events
  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  }, []);

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎟️ SoulPass Admin Panel</h1>
        <Link
          href="/create-event"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create Event
        </Link>
      </div>

      {/* Event List */}
      <h2 className="text-2xl font-semibold mb-4">Existing Events</h2>
      <ul className="space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <li
              key={event._id}
              className="p-4 border rounded bg-gray-50 shadow-sm"
            >
              <h3 className="font-bold">{event.name}</h3>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">
                📅 {new Date(event.date).toDateString()}
              </p>
              <p className="text-sm text-green-600">
                Claim Code: {event.claimCode}
              </p>
            </li>
          ))
        ) : (
          <p>No events created yet.</p>
        )}
      </ul>
    </main>
  );
}
