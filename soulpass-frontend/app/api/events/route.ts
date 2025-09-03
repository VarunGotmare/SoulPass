// app/api/events/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("soulpass"); // use same DB name as admin panel
    const events = await db
      .collection("events")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, events });
  } catch (err: any) {
    console.error("❌ Failed to fetch events:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
