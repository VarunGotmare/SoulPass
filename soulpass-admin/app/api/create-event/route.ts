// app/api/events/route.ts
import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { getSoulPassContract } from "@/lib/contracts";
import { getCollections, ensureIndexes } from "@/lib/db";

/**
 * Background worker to process event creation
 */
async function processEventCreation({
  name,
  description,
  claimCode,
  file,
}: {
  name: string;
  description: string;
  claimCode: string;
  file: File;
}) {
  try {
    await ensureIndexes();
    const { events, claimCodes } = await getCollections();

    // 1. Upload image to Pinata
    const imageUpload = await pinata.upload.public.file(file);
    const imageUri = `ipfs://${imageUpload.cid}`;

    // 2. Upload metadata JSON to Pinata
    const metadata = {
      name,
      description,
      image: imageUri,
      createdAt: new Date().toISOString(),
    };
    const upload = await pinata.upload.public.json(metadata);
    const metadataUri = `ipfs://${upload.cid}`;

    // 3. Insert into events collection
    const eventDoc = {
      name,
      description,
      image: imageUri,
      metadataUri,
      createdAt: new Date(),
    };
    const result = await events.insertOne(eventDoc);

    // 4. Insert into claimCodes collection
    const claimCodeDoc = {
      eventId: result.insertedId,
      claimCode,
      name,
      description,
      image: imageUri,
      metadataCID: upload.IpfsHash,
      used: false,
      createdAt: new Date(),
    };
    await claimCodes.insertOne(claimCodeDoc);

    // 5. Call contract
    const contract = await getSoulPassContract();
    const tx = await contract.setClaimCode(claimCode, metadataUri);
    await tx.wait();

    console.log("✅ Event + ClaimCode processed:", {
      eventId: result.insertedId,
      txHash: tx.hash,
    });
  } catch (err: any) {
    console.error("❌ Background job failed:", err.message);
  }
}

/**
 * API route
 */
export async function POST(req: Request) {
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

    // quick duplicate check
    await ensureIndexes();
    const { claimCodes } = await getCollections();
    const existing = await claimCodes.findOne({ claimCode });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Claim code already exists" },
        { status: 400 }
      );
    }

    // ✅ Kick off background job without blocking
    queueMicrotask(() =>
      processEventCreation({ name, description, claimCode, file })
    );

    return NextResponse.json({
      success: true,
      message:
        "Event creation started. It will be processed in the background.",
    });
  } catch (err: any) {
    console.error("Error starting event creation:", err);
    return NextResponse.json(
      { success: false, error: "Failed to start event creation: " + err.message },
      { status: 500 }
    );
  }
}
