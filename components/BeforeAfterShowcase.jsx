"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiMapPin,
  FiTool,
} from "react-icons/fi";
import { workItems } from "./workData";

export default function BeforeAfterShowcase({ mr = false }) {
  const [publishedWorks, setPublishedWorks] = useState([]);

  useEffect(() => {
    let active = true;
    fetch("/api/works")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => { if (active && Array.isArray(data.works)) setPublishedWorks(data.works); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const visibleWorks = [...publishedWorks, ...workItems];

  if (visibleWorks.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <p className="font-bold text-slate-700">
          {mr
            ? "सध्या कोणतीही कामे उपलब्ध नाहीत."
            : "No works are currently available."}
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-700">
          <FiTool />

          {mr ? "पूर्ण झालेली विकासकामे" : "COMPLETED CIVIC WORKS"}
        </div>

        <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
          {mr
            ? "कामापूर्वी आणि कामानंतर"
            : "Before and After the Work"}
        </h2>

        <p className="mx-auto mt-4 max-w-3xl leading-7 text-slate-600">
          {mr
            ? "वॉर्डमधील विविध विकासकामांची कामापूर्वीची आणि काम पूर्ण झाल्यानंतरची स्थिती पाहा."
            : "View the condition before the work and the improvement after the civic work was completed."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {visibleWorks.map((work, index) => (
          <WorkComparisonCard
            key={work.id || work.slug}
            work={work}
            index={index}
            mr={mr}
          />
        ))}
      </div>
    </section>
  );
}

function WorkComparisonCard({ work, index, mr }) {
  const title = mr ? work.titleMr : work.titleEn;
  const category = mr ? work.categoryMr : work.categoryEn;
  const location = mr ? work.locationMr : work.locationEn;
  const status = mr ? work.statusMr : work.statusEn;
  const description = mr
    ? work.descriptionMr
    : work.descriptionEn;

  const highlights = mr
    ? work.highlightsMr || []
    : work.highlightsEn || [];

  return (
    <article className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
      {/* Work heading */}
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-6 sm:px-7 lg:px-9">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-600 text-lg font-black text-white shadow-md">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">
                {category}
              </span>

              <h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-2xl">
                {title}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <FiMapPin className="text-orange-600" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="inline-flex self-start items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-black text-green-700">
            <FiCheckCircle />
            {status}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 lg:p-9">
        {/* Before and after images */}
        <div className="grid gap-5 sm:grid-cols-2">
          <ComparisonImage
            image={work.beforeImage}
            alt={`${title} ${mr ? "कामापूर्वी" : "before work"}`}
            label={mr ? "कामापूर्वी" : "Before"}
            labelClass="bg-red-600"
            bottomText={
              mr
                ? "काम सुरू होण्यापूर्वीची स्थिती"
                : "Condition before the work"
            }
          />

          <ComparisonImage
            image={work.afterImage}
            alt={`${title} ${mr ? "कामानंतर" : "after work"}`}
            label={mr ? "कामानंतर" : "After"}
            labelClass="bg-green-600"
            bottomText={
              mr
                ? "काम पूर्ण झाल्यानंतरची स्थिती"
                : "Condition after completion"
            }
          />
        </div>

        {/* Description */}
        <div className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">
              {mr ? "कामाची माहिती" : "WORK DETAILS"}
            </p>

            <p className="mt-3 leading-8 text-slate-700">
              {description}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-green-800">
              {mr ? "पूर्ण झालेली कामे" : "WORK COMPLETED"}
            </p>

            <ul className="mt-4 space-y-3">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-sm leading-6 text-green-950"
                >
                  <FiCheckCircle className="mt-1 shrink-0 text-green-600" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function ComparisonImage({
  image,
  alt,
  label,
  labelClass,
  bottomText,
}) {
  return (
    <div className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={alt}
          fill
          unoptimized={String(image || "").startsWith("http")}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <span
          className={`absolute left-4 top-4 rounded-full px-5 py-2 text-sm font-black text-white shadow-lg ${labelClass}`}
        >
          {label}
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="font-bold text-slate-800">
          {bottomText}
        </p>
      </div>
    </div>
  );
}
