import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiChevronLeft, FiChevronRight, FiExternalLink } from "react-icons/fi";
import { getAllNews } from "../../lib/news";
import Bilingual from "../../components/Common/Bilingual";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ward News & Updates | Corporator Sachin Lavate",
  description: "Latest ward news, public service updates and civic announcements from Ward 24(D), Nerul.",
  alternates: { canonical: "/news" },
};

const PAGE_SIZE = 6;

export default async function NewsPage({ searchParams }) {
  const params = await searchParams;
  const selectedYear = String(params?.year || "all");
  const selectedCategory = String(params?.category || "all");
  const requestedPage = Math.max(1, Number.parseInt(params?.page || "1", 10) || 1);
  const allNews = await getAllNews();

  const years = [...new Set(allNews.map((item) => String(item.date || "").slice(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const filteredNews = allNews.filter((item) => {
    const matchesYear = selectedYear === "all" || String(item.date || "").startsWith(selectedYear);
    const matchesCategory = selectedCategory === "all" || item.categoryEn === selectedCategory;
    return matchesYear && matchesCategory;
  });
  const pageCount = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, pageCount);
  const pageItems = filteredNews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hrefFor = (updates = {}) => {
    const next = { year: selectedYear, category: selectedCategory, page: currentPage, ...updates };
    const query = new URLSearchParams();
    if (next.year !== "all") query.set("year", next.year);
    if (next.category !== "all") query.set("category", next.category);
    if (next.page > 1) query.set("page", String(next.page));
    return query.size ? `/news?${query}` : "/news";
  };

  return (
    <div className="min-h-screen bg-[#fffdf9]">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-responsive px-4 py-9 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[.2em] text-orange-600"><Bilingual en="NEWS & ARTICLES" mr="बातम्या आणि लेख" /></p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl"><Bilingual en="Latest News & Updates" mr="ताज्या बातम्या आणि अपडेट्स" /></h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600"><Bilingual en="Ward announcements, development updates, public service news and media coverage." mr="वॉर्डमधील घोषणा, विकासकामे, सार्वजनिक सेवा आणि माध्यमांतील बातम्या." /></p>
        </div>
      </header>

      <main className="container-responsive px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section>
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div><h2 className="text-xl font-black text-slate-900"><Bilingual en="Recent updates" mr="अलीकडील अपडेट्स" /></h2><p className="mt-1 text-sm text-slate-500">{filteredNews.length} <Bilingual en={filteredNews.length === 1 ? "article" : "articles"} mr="बातम्या" /></p></div>
              {(selectedYear !== "all" || selectedCategory !== "all") && <Link href="/news" className="text-sm font-black text-orange-600"><Bilingual en="Clear filters" mr="फिल्टर काढा" /></Link>}
            </div>

            {pageItems.length ? <div className="grid gap-5 md:grid-cols-2">
              {pageItems.map((item) => <NewsCard key={item.id || item.slug} item={item} />)}
            </div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center font-bold text-slate-600">No news found for these filters.</div>}

            {pageCount > 1 && <nav className="mt-8 flex items-center justify-center gap-2" aria-label="News pagination">
              <PageLink href={hrefFor({ page: Math.max(1, currentPage - 1) })} disabled={currentPage === 1} label="Previous"><FiChevronLeft /></PageLink>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <Link key={page} href={hrefFor({ page })} aria-current={page === currentPage ? "page" : undefined} className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black ${page === currentPage ? "bg-orange-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"}`}>{page}</Link>)}
              <PageLink href={hrefFor({ page: Math.min(pageCount, currentPage + 1) })} disabled={currentPage === pageCount} label="Next"><FiChevronRight /></PageLink>
            </nav>}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <FilterPanel title={<Bilingual en="Archives" mr="संग्रह" />}>
              <FilterLink href={hrefFor({ year: "all", page: 1 })} active={selectedYear === "all"} label={<Bilingual en="All years" mr="सर्व वर्षे" />} count={allNews.length} />
              {years.map((year) => <FilterLink key={year} href={hrefFor({ year, page: 1 })} active={selectedYear === year} label={year} count={allNews.filter((item) => String(item.date || "").startsWith(year)).length} />)}
            </FilterPanel>
          </aside>
        </div>
      </main>
    </div>
  );
}

function NewsCard({ item }) {
  const href = item.externalUrl || `/news/${item.slug}`;
  const external = Boolean(item.externalUrl);
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg">
    <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="block">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100"><Image src={item.image} alt={item.titleEn} fill unoptimized={String(item.image).startsWith("http")} className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 40vw" /></div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs"><span className="font-black uppercase tracking-wider text-orange-600"><Bilingual en={item.categoryEn} mr={item.categoryMr} /></span><span className="inline-flex items-center gap-1 text-slate-500"><FiCalendar />{formatDate(item.date)}</span></div>
        <h2 className="mt-3 line-clamp-2 text-xl font-black leading-snug text-slate-900"><Bilingual en={item.titleEn} mr={item.titleMr} /></h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600"><Bilingual en={item.summaryEn} mr={item.summaryMr} /></p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-orange-600"><Bilingual en="Read more" mr="अधिक वाचा" /> {external ? <FiExternalLink /> : <FiArrowRight />}</span>
      </div>
    </Link>
  </article>;
}

function FilterPanel({ title, children }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="border-b border-slate-100 pb-3 text-lg font-black text-slate-900">{title}</h2><div className="mt-3 space-y-1">{children}</div></section>; }
function FilterLink({ href, active, label, count }) { return <Link href={href} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold transition ${active ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><span>{label}</span>{count !== undefined && <span className="text-xs opacity-60">{count}</span>}</Link>; }
function PageLink({ href, disabled, label, children }) { return disabled ? <span aria-disabled="true" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 text-slate-300" title={label}>{children}</span> : <Link href={href} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700">{children}</Link>; }
function formatDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
