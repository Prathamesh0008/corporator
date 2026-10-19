import WorkDetailView from "../../../components/public/WorkDetailView";
import { ObjectId } from "mongodb";
import { getDatabase } from "../../../lib/mongodb";
import { approvedStatic, publicContentQuery } from "../../../lib/publicContent";
import { workItems } from "../../../components/workData";

export const dynamic = "force-dynamic";
async function findWork(slug) {
  try {
    const db = await getDatabase();
    const identity = /^[a-f\d]{24}$/i.test(slug)
      ? { $or: [{ slug }, { _id: new ObjectId(slug) }] }
      : { slug };
    const item = await db
      .collection("works")
      .findOne(
        { ...publicContentQuery, ...identity },
        { projection: { draft: 0 } },
      );
    if (item) return { ...item, _id: undefined };
  } catch {
    /* Never expose unverified examples when the database is unavailable. */
  }
  return approvedStatic(workItems, "works").find(
    (entry) => entry.slug === slug,
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await findWork(slug);

  if (!item) {
    return {
      title: "Work Not Found",
    };
  }

  return {
    title: `${item.titleEn} | Ward Works`,
    description: item.detailEn,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <WorkDetailView item={await findWork(slug)} />;
}
