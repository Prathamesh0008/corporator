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
  FiX,
} from "react-icons/fi";
import { workItems } from "./workData";

const PAGE_SIZE = 9;

export default function BeforeAfterShowcase({ mr = false }) {
  const [publishedWorks, setPublishedWorks] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedWork, setSelectedWork] = useState(null);

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

  useEffect(() => {
    if (!selectedWork) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedWork(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedWork]);

  if (visibleWorks.length === 0) {
    return <div className="border-y border-slate-200 bg-white p-10 text-center font-bold text-slate-700">
      {mr ? "सध्या कोणतीही कामे उपलब्ध नाहीत." : "No works are currently available."}
    </div>;
  }

  return (
    <section>
      <header className="relative left-1/2 w-screen -translate-x-1/2 bg-[#082f49] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-orange-300">
            <FiTool /> {mr ? "वॉर्ड विकास नोंद" : "Ward development register"}
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            {mr ? "वॉर्डातील विकासकामे" : "Ward Development Works"}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
            {mr ? "वॉर्डातील पूर्ण झालेल्या आणि सुरू असलेल्या विकासकामांची पारदर्शक नोंद." : "A transparent record of completed and ongoing development projects across the ward."}
          </p>
        </div>

        <label className="relative block w-full lg:w-80">
          <span className="sr-only">{mr ? "काम शोधा" : "Search works"}</span>
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder={mr ? "काम किंवा ठिकाण शोधा..." : "Search work or location..."}
            className="h-13 w-full border border-white/20 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-orange-400" />
        </label>
      </div>
      </header>

      <div className="mt-8 flex gap-6 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterButton active={category === "all"} onClick={() => { setCategory("all"); setVisibleCount(PAGE_SIZE); }}>
          {mr ? "सर्व कामे" : "All works"} <span className="opacity-60">{visibleWorks.length}</span>
        </FilterButton>
        {categories.map(([value, label]) => (
          <FilterButton key={value} active={category === value} onClick={() => { setCategory(value); setVisibleCount(PAGE_SIZE); }}>{label}</FilterButton>
        ))}
      </div>

      <div className="my-6 flex items-center justify-between text-sm">
        <p className="font-bold text-slate-700">
          {mr ? `${filteredWorks.length} कामे` : `${filteredWorks.length} ${filteredWorks.length === 1 ? "work" : "works"}`}
        </p>
        <p className="text-slate-500">{mr ? "नवीन कामे प्रथम" : "Newest first"}</p>
      </div>

      {filteredWorks.length ? (
        <div>
          {filteredWorks.slice(0, visibleCount).map((work, index) => (
            <WorkComparisonCard
              key={work.id || work.slug || `${work.titleEn}-${index}`}
              work={work}
              index={index}
              mr={mr}
              onSelect={() => setSelectedWork(work)}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <FiSearch className="mx-auto h-7 w-7 text-slate-400" />
          <p className="mt-3 font-bold text-slate-700">{mr ? "या शोधासाठी कोणतेही काम सापडले नाही." : "No works match your search."}</p>
        </div>
      )}

      {visibleCount < filteredWorks.length && (
        <div className="mt-8 text-center">
          <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex h-12 items-center justify-center gap-2 border border-orange-300 bg-white px-6 text-sm font-black text-orange-700 transition hover:bg-orange-50">
            {mr ? "आणखी कामे पहा" : "Show more works"}
            <FiChevronDown />
          </button>
          <p className="mt-2 text-xs text-slate-500">
            {mr ? `${Math.min(visibleCount, filteredWorks.length)} पैकी ${filteredWorks.length} दाखवत आहे` : `Showing ${Math.min(visibleCount, filteredWorks.length)} of ${filteredWorks.length}`}
          </p>
        </div>
      )}

      {selectedWork && (
        <WorkDetailModal work={selectedWork} mr={mr} onClose={() => setSelectedWork(null)} />
      )}
    </section>
  );
}

function FilterButton({ active, onClick, children }) {
  return <button type="button" onClick={onClick}
    className={`shrink-0 border-b-2 px-1 pb-3 text-xs font-black transition ${active ? "border-orange-600 text-orange-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}>
    {children}
  </button>;
}

function WorkComparisonCard({ work, index, mr, onSelect }) {
  const title = mr ? (work.titleMr || work.titleEn) : work.titleEn;
  const category = mr ? (work.categoryMr || work.categoryEn) : work.categoryEn;
  const location = mr ? (work.locationMr || work.locationEn) : work.locationEn;
  const status = mr ? (work.statusMr || work.statusEn) : work.statusEn;
  const description = mr ? (work.descriptionMr || work.descriptionEn) : work.descriptionEn;
  const highlights = (mr ? work.highlightsMr : work.highlightsEn) || [];

  return (
    <button type="button" onClick={onSelect} className="group grid w-full gap-5 border-t border-slate-200 py-7 text-left last:border-b md:grid-cols-[56px_280px_minmax(0,1fr)] lg:grid-cols-[56px_340px_minmax(0,1fr)_120px] lg:items-center">
      <div className="hidden self-stretch border-r border-slate-200 md:flex md:items-start md:pt-1">
        <span className="text-sm font-black tracking-widest text-slate-400">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <ComparisonImage image={work.beforeImage} alt={`${title} before`} label={mr ? "पूर्वी" : "Before"} labelClass="bg-slate-900/85" />
        <ComparisonImage image={work.afterImage} alt={`${title} after`} label={mr ? "नंतर" : "After"} labelClass="bg-green-600" />
      </div>

      <div className="min-w-0 md:px-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-widest text-slate-400 md:hidden">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-orange-700">{category}</span>
        </div>
        <h3 className="mt-2 text-xl font-black leading-snug text-slate-900">{title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <FiMapPin className="shrink-0 text-orange-600" /> <span>{location}</span>
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{description}</p>
        {highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {highlights.slice(0, 2).map((highlight) => (
              <span key={highlight} className="flex min-w-0 items-start gap-1.5 text-xs font-semibold leading-5 text-slate-700">
                <FiCheck className="mt-0.5 shrink-0 text-green-600" /> <span className="line-clamp-1">{highlight}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-start-3 lg:col-start-auto lg:self-start lg:pt-1">
        <span className="inline-flex shrink-0 items-center gap-1 border border-green-200 bg-green-50 px-3 py-1.5 text-[10px] font-black text-green-700">
          <FiCheckCircle /> {status}
        </span>
      </div>
    </button>
  );
}

function WorkDetailModal({ work, mr, onClose }) {
  const title = mr ? (work.titleMr || work.titleEn) : work.titleEn;
  const category = mr ? (work.categoryMr || work.categoryEn) : work.categoryEn;
  const location = mr ? (work.locationMr || work.locationEn) : work.locationEn;
  const status = mr ? (work.statusMr || work.statusEn) : work.statusEn;
  const description = mr ? (work.descriptionMr || work.descriptionEn) : work.descriptionEn;
  const highlights = (mr ? work.highlightsMr : work.highlightsEn) || [];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-2 sm:p-4 lg:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button type="button" onClick={onClose} aria-label={mr ? "बंद करा" : "Close"} className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-lg text-white transition hover:bg-slate-900 sm:right-3 sm:top-3">
          <FiX />
        </button>

        <div className="max-h-[92vh] overflow-y-auto">
          <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[1.05fr_0.95fr] lg:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="relative aspect-[4/3]">
                  <Image src={work.beforeImage} alt={`${title} ${mr ? "पूर्वी" : "Before"}`} fill unoptimized={String(work.beforeImage || "").startsWith("http")} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {mr ? "पूर्वी" : "Before"}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="relative aspect-[4/3]">
                  <Image src={work.afterImage} alt={`${title} ${mr ? "नंतर" : "After"}`} fill unoptimized={String(work.afterImage || "").startsWith("http")} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-700/80 to-transparent px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {mr ? "नंतर" : "After"}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-700">{category}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-black text-green-700">
                  <FiCheckCircle /> {status}
                </span>
              </div>

              <h3 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">{title}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                <FiMapPin className="shrink-0 text-orange-600" /> {location}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

              {highlights.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{mr ? "मुख्य मुद्दे" : "Highlights"}</h4>
                  <ul className="mt-2 space-y-1.5">
                    {highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-slate-600">
                        <FiCheck className="mt-1 shrink-0 text-green-600" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonImage({ image, alt, label, labelClass }) {
  return (
    <div className="relative h-32 overflow-hidden sm:h-40">
      <Image src={image} alt={alt} fill unoptimized={String(image || "").startsWith("http")}
        sizes="(max-width: 768px) 50vw, 50vw"
        className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
      <span className={`absolute bottom-2 left-2 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white ${labelClass}`}>{label}</span>
    </div>
  );
}
