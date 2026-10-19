import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";
import { isAdmin } from "../../../lib/adminContent";
import {
  uploadContentImage,
  validateContentImage,
} from "../../../lib/contentImages";

export async function GET(request) {
  const adminView =
    request && new URL(request.url).searchParams.get("admin") === "1";
  if (adminView && !isAdmin(request))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const db = await getDatabase();
    const content = await db
      .collection("siteContent")
      .findOne(
        { _id: "global" },
        {
          projection: {
            homeBanner: 1,
            announcementEnabled: 1,
            announcementEn: 1,
            announcementMr: 1,
            updatedAt: 1,
            _id: 0,
          },
        },
      );
    const draft = adminView
      ? await db
          .collection("siteContent")
          .findOne({ _id: "draft" }, { projection: { _id: 0 } })
      : null;
    return NextResponse.json({
      success: true,
      content: content || {},
      ...(adminView ? { draft } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Site content is temporarily unavailable.", content: {} },
      { status: 503 },
    );
  }
}

export async function PATCH(request) {
  if (!isAdmin(request))
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const update = { updatedAt: new Date() };
    if ("announcementEnabled" in body)
      update.announcementEnabled = Boolean(body.announcementEnabled);
    for (const key of ["announcementEn", "announcementMr"])
      if (key in body)
        update[key] = String(body[key] || "")
          .trim()
          .slice(0, 500);
    if (body.bannerImage) validateContentImage(body.bannerImage);
    const db = await getDatabase();
    if (body.bannerImage)
      update.homeBanner = await uploadContentImage(
        body.bannerImage,
        "site-content",
      );
    if (body.action === "publish" && !body.bannerImage && body.homeBanner) {
      const savedDraft = await db
        .collection("siteContent")
        .findOne({ _id: "draft" });
      if (savedDraft?.homeBanner === body.homeBanner)
        update.homeBanner = savedDraft.homeBanner;
    }
    const target = body.action === "save-draft" ? "draft" : "global";
    if (target === "draft") update.syncedToLive = false;
    await db
      .collection("siteContent")
      .updateOne({ _id: target }, { $set: update }, { upsert: true });
    if (target === "global" && body.action === "publish")
      await db
        .collection("siteContent")
        .updateOne(
          { _id: "draft" },
          { $set: { ...update, syncedToLive: true } },
        );
    return NextResponse.json({ success: true, content: update });
  } catch (error) {
    const invalid =
      error instanceof SyntaxError || /Select a|Image must/.test(error.message);
    return NextResponse.json(
      {
        error: invalid
          ? error.message
          : "Content could not be saved. Please try again.",
      },
      { status: invalid ? 400 : 500 },
    );
  }
}
