import NewsDetailView from "../../../components/public/NewsDetailView";

import { getNewsBySlug } from "../../../lib/news";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: "News update" };
  }

  return {
    title: `${article.titleEn} | Ward Updates`,
    description: article.summaryEn,
    alternates: { canonical: `/news/${article.slug}` },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <NewsDetailView article={await getNewsBySlug(slug)} />;
}
