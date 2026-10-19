import { timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDatabase } from "./mongodb";
import { uploadContentImage, validateContentImage } from "./contentImages";

export function isAdmin(request) {
  const configured = Buffer.from(process.env.ADMIN_DASHBOARD_KEY || "");
  const supplied = Buffer.from(request.headers.get("x-admin-key") || "");
  return (
    configured.length > 0 &&
    configured.length === supplied.length &&
    timingSafeEqual(configured, supplied)
  );
}

export function validWebUrl(value) {
  if (!value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

const fields = {
  works: {
    titleEn: 160,
    titleMr: 160,
    categoryEn: 100,
    categoryMr: 100,
    locationEn: 200,
    locationMr: 200,
    descriptionEn: 3000,
    descriptionMr: 3000,
    statusEn: 50,
    statusMr: 50,
  },
  news: {
    titleEn: 180,
    titleMr: 180,
    categoryEn: 100,
    categoryMr: 100,
    summaryEn: 1000,
    summaryMr: 1000,
    contentEn: 12000,
    contentMr: 12000,
    externalUrl: 500,
    date: 10,
  },
  gallery: {
    type: 10,
    titleEn: 180,
    titleMr: 180,
    categoryEn: 100,
    categoryMr: 100,
    date: 10,
    href: 500,
  },
};
const images = {
  works: ["beforeImage", "afterImage"],
  news: ["image"],
  gallery: ["image"],
};

export function contentItemHandlers(collection) {
  return {
    async PATCH(request, { params }) {
      if (!isAdmin(request))
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      try {
        const { id } = await params;
        if (!/^[a-f\d]{24}$/i.test(id))
          return NextResponse.json(
            { error: "Invalid content ID." },
            { status: 400 },
          );
        const body = await request.json();
        const update = { updatedAt: new Date() };
        for (const [key, max] of Object.entries(fields[collection])) {
          if (key in body)
            update[key] = String(body[key] || "")
              .trim()
              .slice(0, max);
        }
        for (const key of ["highlightsEn", "highlightsMr"]) {
          if (collection === "works" && key in body)
            update[key] = (
              Array.isArray(body[key])
                ? body[key]
                : String(body[key] || "").split("\n")
            )
              .map((item) => String(item).trim().slice(0, 300))
              .filter(Boolean)
              .slice(0, 8);
        }
        if (typeof body.published === "boolean")
          update.published = body.published;
        if (body.action === "save-draft") update.published = false;
        if (body.action === "publish") update.published = true;
        for (const key of images[collection])
          if (String(body[key] || "").startsWith("data:"))
            validateContentImage(body[key]);
        const db = await getDatabase();
        const _id = new ObjectId(id);
        const current = await db.collection(collection).findOne({ _id });
        if (!current)
          return NextResponse.json(
            { error: "Content not found." },
            { status: 404 },
          );
        const next = { ...current, ...update };
        const required =
          body.action === "save-draft"
            ? ["titleEn"]
            : collection === "works"
              ? ["titleEn", "locationEn", "descriptionEn"]
              : collection === "news"
                ? ["titleEn", "summaryEn"]
                : ["titleEn"];
        if (required.some((key) => !String(next[key] || "").trim()))
          return NextResponse.json(
            { error: "Required English fields cannot be empty." },
            { status: 400 },
          );
        if (
          next.published &&
          (body.action === "publish" || update.published === true)
        ) {
          const complete =
            collection === "works"
              ? ["beforeImage", "afterImage"]
              : ["image", "date"];
          if (
            complete.some((key) => !String(body[key] || next[key] || "").trim())
          )
            return NextResponse.json(
              {
                error:
                  "Complete the images and publication date before publishing.",
              },
              { status: 400 },
            );
        }
        if (!validWebUrl(next.externalUrl) || !validWebUrl(next.href))
          return NextResponse.json(
            { error: "Links must use http or https." },
            { status: 400 },
          );
        if (
          collection === "gallery" &&
          (!["photo", "video"].includes(next.type) ||
            (body.action !== "save-draft" &&
              next.type === "video" &&
              !next.href))
        )
          return NextResponse.json(
            {
              error:
                "Choose a valid media type and provide a video link when needed.",
            },
            { status: 400 },
          );
        for (const key of images[collection]) {
          // URLs sent by an edit form mean 'keep existing'; only validated file data replaces an image.
          if (String(body[key] || "").startsWith("data:"))
            update[key] = await uploadContentImage(body[key], collection);
        }
        if (body.action === "save-draft" && current.published) {
          // Keep the current public version intact while saving unpublished revisions.
          await db
            .collection(collection)
            .updateOne(
              { _id },
              { $set: { draft: update, updatedAt: new Date() } },
            );
        } else {
          if (body.action === "publish" || body.action === "save-draft")
            update.draft = null;
          await db.collection(collection).updateOne({ _id }, { $set: update });
        }
        return NextResponse.json({ success: true });
      } catch (error) {
        const validation =
          error instanceof SyntaxError ||
          /Select a|Image must/.test(error.message);
        return NextResponse.json(
          {
            error: validation
              ? error.message
              : "Content could not be updated. Please try again.",
          },
          { status: validation ? 400 : 500 },
        );
      }
    },
    async DELETE(request, { params }) {
      if (!isAdmin(request))
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      try {
        const { id } = await params;
        if (!/^[a-f\d]{24}$/i.test(id))
          return NextResponse.json(
            { error: "Invalid content ID." },
            { status: 400 },
          );
        const db = await getDatabase();
        // Retain Cloudinary assets. Record removal never destroys uploaded originals.
        const result = await db
          .collection(collection)
          .deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount
          ? NextResponse.json({ success: true })
          : NextResponse.json({ error: "Content not found." }, { status: 404 });
      } catch {
        return NextResponse.json(
          { error: "Content could not be deleted." },
          { status: 500 },
        );
      }
    },
  };
}
