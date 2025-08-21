// /lib/db.ts
import { MongoClient, Db, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB_NAME ?? "soulpass";

if (!uri) {
  throw new Error("Missing MONGODB_URI. Add it to your .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Reuse connection in dev (HMR fix)
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(dbName);
}

/** Events collection */
export interface EventDoc {
  _id?: ObjectId;
  name: string;
  description: string;
  image: string;        // ipfs://<imageCID>
  createdAt: Date;
}

/** ClaimCodes collection */
export interface ClaimCodeDoc {
  _id?: ObjectId;
  eventId: ObjectId;    // ref -> events._id
  claimCode: string;    // unique
  metadataCID: string;  // ipfs://<metadataCID>
  used: boolean;
  createdAt: Date;
  usedAt?: Date | null;
}

export async function getCollections() {
  const db = await getDb();
  const events = db.collection<EventDoc>("events");
  const claimCodes = db.collection<ClaimCodeDoc>("claimCodes");
  return { db, events, claimCodes };
}

export async function ensureIndexes() {
  const { events, claimCodes } = await getCollections();
  await events.createIndex({ createdAt: -1 });
  await claimCodes.createIndex({ claimCode: 1 }, { unique: true });
  await claimCodes.createIndex({ eventId: 1 });
}
