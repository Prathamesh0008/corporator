import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/adminContent";
import { getDatabase } from "../../../../lib/mongodb";
import {
  realContentQuery,
  testContentQuery,
  complaintStatuses,
} from "../../../../lib/adminQueries";

export async function GET(request) {
  if (!isAdmin(request))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let operation = "connect";
  try {
    const db = await getDatabase();
    operation = "counts";
    const counts = {};
    const definitions = [
      ["complaints", "complaints", {}],
      ...complaintStatuses.map((status) => [status, "complaints", { status }]),
      ["publishedWorks", "works", { published: true }],
      ["hiddenWorks", "works", { published: false }],
      ["gallery", "gallery", {}],
      ["news", "news", {}],
      ["contacts", "contact_messages", {}],
    ];
    await Promise.all(
      definitions.map(async ([key, collection, filter]) => {
        counts[key] = await db
          .collection(collection)
          .countDocuments({ ...realContentQuery, ...filter });
      }),
    );
    operation = "recent-complaints";
    const recent = await db
      .collection("complaints")
      .find(realContentQuery, {
        projection: {
          _id: 0,
          complaintId: 1,
          complaintType: 1,
          location: 1,
          createdAt: 1,
          status: 1,
        },
      })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();
    operation = "excluded-counts";
    const excluded = {};
    await Promise.all(
      ["complaints", "contact_messages", "works", "news", "gallery"].map(
        async (name) => {
          excluded[name] = await db
            .collection(name)
            .countDocuments(testContentQuery);
        },
      ),
    );
    return NextResponse.json({ success: true, counts, recent, excluded });
  } catch (error) {
    // Deliberately omit provider messages/URIs so diagnostics cannot log credentials.
    console.error(
      "[admin/overview] " +
        JSON.stringify({
          operation,
          name: error?.name,
          code: error?.code || error?.cause?.code || "UNKNOWN",
          syscall: error?.syscall || error?.cause?.syscall,
        }),
    );
    return NextResponse.json(
      {
        error:
          "Dashboard could not be loaded. Retry to fetch current database counts.",
      },
      { status: 503 },
    );
  }
}
