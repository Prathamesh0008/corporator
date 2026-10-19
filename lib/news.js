import { getDatabase } from "./mongodb";
import { newsData } from "../data/siteContent";
import { approvedStatic, publicContentQuery } from "./publicContent";

function mapNews(doc) {
  return {
    ...doc,
    _id: undefined,
    id: doc._id?.toString() || doc.id,
    date:
      doc.date instanceof Date ? doc.date.toISOString().slice(0, 10) : doc.date,
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
  };
}

export async function getAllNews() {
  try {
    const db = await getDatabase();
    const published = await db
      .collection("news")
      .find(publicContentQuery, { projection: { draft: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return [...published.map(mapNews), ...approvedStatic(newsData, "news")];
  } catch (error) {
    console.error("News loading failed", error?.message);
    return approvedStatic(newsData, "news");
  }
}

export async function getNewsBySlug(slug) {
  try {
    const db = await getDatabase();
    const article = await db
      .collection("news")
      .findOne({ ...publicContentQuery, slug }, { projection: { draft: 0 } });
    if (article) return mapNews(article);
  } catch (error) {
    console.error("News article loading failed", error?.message);
  }
  return (
    approvedStatic(newsData, "news").find((item) => item.slug === slug) || null
  );
}
