import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";
import { rateLimit } from "../../../lib/rateLimit";

const COLLECTION = "counters";
const DOC_ID = "site-visits";

export async function GET() {
  try { const db = await getDatabase(); const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID }); return NextResponse.json({ count: doc?.count || 0 }); }
  catch { return NextResponse.json({ count: 0, error: "Failed to fetch count" }, { status: 503 }); }
}

export async function POST(request) {
  try {
    if (rateLimit(request, "visit-post", 3, 24 * 60 * 60_000)) return NextResponse.json({ count: 0 }, { status: 429 });
    const db = await getDatabase();
    const result = await db.collection(COLLECTION).findOneAndUpdate({ _id: DOC_ID }, { $inc: { count: 1 } }, { upsert: true, returnDocument: "after" });
    return NextResponse.json({ count: result?.count || result?.value?.count || 1 });
  } catch { return NextResponse.json({ count: 0, error: "Failed to update count" }, { status: 503 }); }
}
