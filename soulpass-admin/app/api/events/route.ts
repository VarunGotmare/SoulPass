// app/api/events/route.ts
import { NextResponse } from "next/server";
import { getCollections, ensureIndexes } from "@/lib/db";

/**
 * Fetch all events (for Admin Panel / Home Page)
 */
export async function GET() {
  try {
    await ensureIndexes();
    const { events, claimCodes } = await getCollections();

    // Get latest events
    const allEvents = await events.find({}).sort({ createdAt: -1 }).toArray();

    // Attach claimCode from claimCodes collection
    const eventsWithCodes = await Promise.all(
      allEvents.map(async (ev) => {
        const claim = await claimCodes.findOne({ eventId: ev._id });
        return {
          ...ev,
          _id: ev._id.toString(),
          claimCode: claim?.claimCode || null,
        };
      })
    );

    return NextResponse.json({ success: true, events: eventsWithCodes });
  } catch (err: any) {
    console.error("❌ Failed to fetch events:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
