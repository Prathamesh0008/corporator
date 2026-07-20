import Link from "next/link";
import Image from "next/image";
import { newsData } from "../../data/siteContent";

export const metadata = {
  title: "Ward News & Updates | Corporator Sachin Lavate",
  description: "Latest ward news, public service updates and civic announcements from Ward 24(D), Nerul.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#082f49] px-4 py-14 text-white">
        <div className="container-responsive">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-300">News & Announcements</p>
          <h1 className="mt-3 text-4xl text-white font-black sm:text-5xl">Latest public updates</h1>
          <p className="mt-4 max-w-3xl text-lg text-white-100">Stay informed with ward announcements, public service notices and development progress.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-responsive grid gap-6 lg:grid-cols-3">
          {newsData.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="relative h-44">
                <Image src={item.image} alt={item.titleEn} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-orange-600">{item.categoryEn}</p>
                <h2 className="mt-2 text-xl font-black text-slate-900">{item.titleEn}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.summaryEn}</p>
                <Link href={`/news/${item.slug}`} className="mt-5 inline-flex font-semibold text-orange-600">Read More</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
