import Link from "next/link";
import Image from "next/image";
import { newsData } from "../../../data/siteContent";

export async function generateStaticParams() {
  return newsData.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = newsData.find((item) => item.slug === slug);

  if (!article) {
    return { title: "News update" };
  }

  return {
    title: `${article.titleEn} | Ward Updates`,
    description: article.summaryEn,
    alternates: { canonical: `/news/${article.slug}` },
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const article = newsData.find((item) => item.slug === slug);

  if (!article) {
    return <div className="min-h-screen bg-slate-50 px-4 py-16 text-center"><h1 className="text-3xl font-black text-slate-900">Article not found</h1></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#082f49] px-4 py-14 text-white">
        <div className="container-responsive">
          <Link href="/news" className="text-sm font-semibold text-orange-300">← Back to news</Link>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">{article.titleEn}</h1>
          <p className="mt-3 text-lg text-blue-100">{article.summaryEn}</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-responsive grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="relative h-72">
              <Image src={article.image} alt={article.titleEn} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold text-orange-600">{article.categoryEn}</p>
              <p className="mt-3 text-lg leading-8 text-slate-700">{article.summaryEn}</p>
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-600">Quick details</p>
            <div className="mt-4 space-y-3 text-slate-700">
              <div><span className="font-black text-slate-900">Date:</span> {article.date}</div>
              <div><span className="font-black text-slate-900">Category:</span> {article.categoryEn}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
