import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

const DB_NAME = process.env.MONGODB_DB || "app";
const COLLECTION = "counters";
const DOC_ID = "site-visits";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID });
    const count = doc?.count || 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0, error: "Failed to fetch count" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: DOC_ID },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" }
    );
    return NextResponse.json({ count: result.value?.count || 1 });
  } catch {
    return NextResponse.json({ count: 0, error: "Failed to update count" }, { status: 500 });
  }
}
