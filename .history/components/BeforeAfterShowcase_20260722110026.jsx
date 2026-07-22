"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiMapPin,
  FiSearch,
  FiTool,
} from "react-icons/fi";
import { workItems } from "./workData";

const PAGE_SIZE = 9;

export default function BeforeAfterShowcase({ mr = false }) {
  const [publishedWorks, setPublishedWorks] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;
    fetch("/api/works")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => { if (active && Array.isArray(data.works)) setPublishedWorks(data.works); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const visibleWorks = useMemo(() => [...publishedWorks, ...workItems], [publishedWorks]);
  const categories = useMemo(() => {
    const unique = new Map();
    visibleWorks.forEach((work) => {
      const value = work.categoryEn || "Other";
      if (!unique.has(value)) unique.set(value, mr ? (work.categoryMr || value) : value);
    });
    return [...unique.entries()];
  }, [visibleWorks, mr]);

  const filteredWorks = useMemo(() => {
    const term = query.trim().toLowerCase();
    return visibleWorks.filter((work) => {
      const matchesCategory = category === "all" || work.categoryEn === category;
      const searchable = [work.titleEn, work.titleMr, work.locationEn, work.locationMr, work.categoryEn, work.categoryMr]
        .filter(Boolean).join(" ").toLowerCase();
      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [visibleWorks, query, category]);

  if (visibleWorks.length === 0) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center font-bold text-slate-700">
      {mr ? "सध्या कोणतीही कामे उपलब्ध नाहीत." : "No works are currently available."}
    </div>;
  }

  return (
    <section className="mt-12">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-black text-orange-700">
            <FiTool /> {mr ? "पूर्ण झालेली विकासकामे" : "COMPLETED CIVIC WORKS"}
          </div>
          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
            {mr ? "कामापूर्वी आणि कामानंतर" : "Before & After Works"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            {mr ? "वॉर्डातील पूर्ण झालेल्या कामांचा संक्षिप्त आणि पारदर्शक आढावा." : "A clear, compact record of completed improvements across the ward."}
          </p>
        </div>

        <label className="relative block w-full lg:w-72">
          <span className="sr-only">{mr ? "काम शोधा" : "Search works"}</span>
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder={mr ? "काम किंवा ठिकाण शोधा..." : "Search work or location..."}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
        </label>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterButton active={category === "all"} onClick={() => { setCategory("all"); setVisibleCount(PAGE_SIZE); }}>
          {mr ? "सर्व कामे" : "All works"} <span className="opacity-60">{visibleWorks.length}</span>
        </FilterButton>
        {categories.map(([value, label]) => (
          <FilterButton key={value} active={category === value} onClick={() => { setCategory(value); setVisibleCount(PAGE_SIZE); }}>{label}</FilterButton>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <p className="font-bold text-slate-700">
          {mr ? `${filteredWorks.length} कामे` : `${filteredWorks.length} ${filteredWorks.length === 1 ? "work" : "works"}`}
        </p>
        <p className="text-slate-500">{mr ? "नवीन कामे प्रथम" : "Newest first"}</p>
      </div>

      {filteredWorks.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorks.slice(0, visibleCount).map((work, index) => (
            <WorkComparisonCard key={work.id || work.slug || `${work.titleEn}-${index}`} work={work} index={index} mr={mr} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <FiSearch className="mx-auto h-7 w-7 text-slate-400" />
          <p className="mt-3 font-bold text-slate-700">{mr ? "या शोधासाठी कोणतेही काम सापडले नाही." : "No works match your search."}</p>
        </div>
      )}

      {visibleCount < filteredWorks.length && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-6 text-sm font-black text-orange-700 shadow-sm transition hover:border-orange-400 hover:bg-orange-50">
            {mr ? "आणखी कामे पहा" : "Show more works"}
            <FiChevronDown />
          </button>
          <p className="mt-2 text-xs text-slate-500">
            {mr ? `${Math.min(visibleCount, filteredWorks.length)} पैकी ${filteredWorks.length} दाखवत आहे` : `Showing ${Math.min(visibleCount, filteredWorks.length)} of ${filteredWorks.length}`}
          </p>
        </div>
      )}
    </section>
  );
}

function FilterButton({ active, onClick, children }) {
  return <button type="button" onClick={onClick}
    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${active ? "border-orange-600 bg-orange-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"}`}>
    {children}
  </button>;
}

function WorkComparisonCard({ work, index, mr }) {
  const title = mr ? (work.titleMr || work.titleEn) : work.titleEn;
  const category = mr ? (work.categoryMr || work.categoryEn) : work.categoryEn;
  const location = mr ? (work.locationMr || work.locationEn) : work.locationEn;
  const status = mr ? (work.statusMr || work.statusEn) : work.statusEn;
  const description = mr ? (work.descriptionMr || work.descriptionEn) : work.descriptionEn;
  const highlights = (mr ? work.highlightsMr : work.highlightsEn) || [];

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
      <div className="grid grid-cols-2 bg-slate-100">
        <ComparisonImage image={work.beforeImage} alt={`${title} before`} label={mr ? "पूर्वी" : "Before"} labelClass="bg-slate-900/85" />
        <ComparisonImage image={work.afterImage} alt={`${title} after`} label={mr ? "नंतर" : "After"} labelClass="bg-green-600" />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-orange-700">{category}</span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-black text-green-700">
            <FiCheckCircle /> {status}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-snug text-slate-900">{title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <FiMapPin className="shrink-0 text-orange-600" /> <span className="truncate">{location}</span>
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p>

        {highlights.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{mr ? "काम पूर्ण" : "Completed"}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {highlights.slice(0, 2).map((highlight) => (
                <span key={highlight} className="flex min-w-0 items-start gap-1.5 text-xs font-semibold leading-5 text-slate-700">
                  <FiCheck className="mt-0.5 shrink-0 text-green-600" /> <span className="line-clamp-1">{highlight}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <span className="mt-4 block text-right text-[10px] font-black tracking-widest text-slate-300">#{String(index + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}

function ComparisonImage({ image, alt, label, labelClass }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden border-r border-white/70 last:border-r-0">
      <Image src={image} alt={alt} fill unoptimized={String(image || "").startsWith("http")}
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 17vw"
        className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
      <span className={`absolute bottom-2 left-2 rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow ${labelClass}`}>{label}</span>
    </div>
  );
}
