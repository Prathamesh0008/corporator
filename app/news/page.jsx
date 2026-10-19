import { getAllNews } from "../../lib/news";
import NewsListingView from "../../components/public/NewsListingView";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ward News & Updates | Corporator Sachin Lavate",
  description:
    "Latest ward news, public service updates and civic announcements from Ward 24(D), Nerul.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage({ searchParams }) {
  return (
    <NewsListingView
      allNews={await getAllNews()}
      searchParams={await searchParams}
    />
  );
}
