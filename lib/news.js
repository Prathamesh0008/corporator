import { getDatabase } from "./mongodb";
import { newsData } from "../data/siteContent";

function mapNews(doc) {
  return {
    ...doc,
    _id: undefined,
    id: doc._id?.toString() || doc.id,
    date: doc.date instanceof Date ? doc.date.toISOString().slice(0, 10) : doc.date,
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
  };
}

export async function getAllNews() {
  try {
    const db = await getDatabase();
    const published = await db.collection("news").find({ published: true }).sort({ createdAt: -1 }).toArray();
    return [...published.map(mapNews), ...newsData];
  } catch (error) {
    console.error("News loading failed", error?.message);
    return newsData;
  }
}

export async function getNewsBySlug(slug) {
  try {
    const db = await getDatabase();
    const article = await db.collection("news").findOne({ slug, published: true });
    if (article) return mapNews(article);
  } catch (error) {
    console.error("News article loading failed", error?.message);
  }
  return newsData.find((item) => item.slug === slug) || null;
}
