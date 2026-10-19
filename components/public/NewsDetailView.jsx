"use client";
import Link from "next/link";
import Image from "next/image";
import Bilingual from "../Common/Bilingual";
export default function NewsDetailView({ article }) {
  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-900">
          <Bilingual en="Article not found" mr="बातमी सापडली नाही" />
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#082f49] px-4 py-14 text-white">
        <div className="container-responsive">
          <Link href="/news" className="text-sm font-semibold text-orange-300">
            ← Back to news
          </Link>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            <Bilingual en={article.titleEn} mr={article.titleMr} />
          </h1>
          <p className="mt-3 text-lg text-blue-100">
            <Bilingual en={article.summaryEn} mr={article.summaryMr} />
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-responsive grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="relative h-72">
              {article.image && (
                <Image
                  src={article.image}
                  alt={article.titleEn}
                  fill
                  unoptimized={String(article.image).startsWith("http")}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              )}
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold text-orange-600">
                <Bilingual en={article.categoryEn} mr={article.categoryMr} />
              </p>
              <p className="mt-3 text-lg leading-8 text-slate-700">
                <Bilingual en={article.summaryEn} mr={article.summaryMr} />
              </p>
              {article.contentEn || article.contentMr ? (
                <div className="mt-6 whitespace-pre-line border-t border-slate-200 pt-6 text-base leading-8 text-slate-700">
                  <Bilingual en={article.contentEn} mr={article.contentMr} />
                </div>
              ) : null}
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-600">
              <Bilingual en="Quick details" mr="संक्षिप्त माहिती" />
            </p>
            <div className="mt-4 space-y-3 text-slate-700">
              <div>
                <span className="font-black text-slate-900">
                  <Bilingual en="Date:" mr="दिनांक:" />
                </span>{" "}
                {article.date}
              </div>
              <div>
                <span className="font-black text-slate-900">
                  <Bilingual en="Category:" mr="वर्ग:" />
                </span>{" "}
                <Bilingual en={article.categoryEn} mr={article.categoryMr} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
