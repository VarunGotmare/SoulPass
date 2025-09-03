// app/api/create-event/route.ts
import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { getSoulPassContract } from "@/lib/contracts";
import { getCollections, ensureIndexes } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const sessionIds: { eventId?: ObjectId; claimCodeId?: ObjectId } = {};

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const claimCode = formData.get("claimCode") as string;
    const file = formData.get("image") as File | null;

    if (!name || !description || !claimCode || !file) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await ensureIndexes();
    const { events, claimCodes } = await getCollections();

    // prevent duplicate claim code
    const existing = await claimCodes.findOne({ claimCode });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Claim code already exists" },
        { status: 400 }
      );
    }

    // 1. Upload image to Pinata
    const imageUpload = await pinata.upload.public.file(file);
    const imageUri = `ipfs://${imageUpload.cid}`;

    // 2. Upload metadata JSON
    const metadata = {
      name,
      description,
      image: imageUri,
      createdAt: new Date().toISOString(),
    };
    const upload = await pinata.upload.public.json(metadata);
    const metadataUri = `ipfs://${upload.cid}`;

    // 3. Insert event
    const eventDoc = {
      name,
      description,
      image: imageUri,
      createdAt: new Date(),
    };
    const eventRes = await events.insertOne(eventDoc);
    sessionIds.eventId = eventRes.insertedId;

    // 4. Insert claimCode
    const claimCodeDoc = {
      eventId: eventRes.insertedId,
      claimCode,
      metadataCID: metadataUri,
      used: false,
      createdAt: new Date(),
      usedAt: null,
    };
    const claimRes = await claimCodes.insertOne(claimCodeDoc);
    sessionIds.claimCodeId = claimRes.insertedId;

    // 5. Call contract (if fails → rollback DB + throw)
    const contract = await getSoulPassContract();
    const tx = await contract.setClaimCode(claimCode, metadataUri);
    const receipt = await tx.wait();

    return NextResponse.json({
      success: true,
      txHash: receipt.transactionHash,
      claimCode,
    });
  } catch (err: any) {
    console.error("❌ Event creation failed:", err.message);

    // rollback inserted docs
    const { events, claimCodes } = await getCollections();
    if (sessionIds.claimCodeId) {
      await claimCodes.deleteOne({ _id: sessionIds.claimCodeId });
    }
    if (sessionIds.eventId) {
      await events.deleteOne({ _id: sessionIds.eventId });
    }

    return NextResponse.json(
      { success: false, error: "Failed to create event: " + err.message },
      { status: 500 }
    );
  }
}
