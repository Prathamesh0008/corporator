import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/adminContent";

// Authorization gate only. Draft values remain in the editor; no preview is stored or indexed.
export async function POST(request) {
  if (!isAdmin(request))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json({ authorized: true });
}
