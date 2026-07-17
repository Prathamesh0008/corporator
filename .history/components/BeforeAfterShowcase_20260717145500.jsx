"use client";

import { useState } from "react";
import Image from "next/image";

export default function BeforeAfterShowcase({ mr = false }) {
  const [slider, setSlider] = useState(58);

  const beforeImage = "/images/banner-1.jpg";
  const afterImage = "/images/banner-2.jpg";

  return (
    <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-black tracking-[0.2em] text-orange-700">
            {mr ? "कामांची तुलना" : "BEFORE & AFTER"}
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            {mr ? "वॉर्डातील बदल दिसून येणाऱ्या कामांची तुलना" : "See how civic work transforms the area"}
          </h2>
          <p className="mt-3 text-lg leading-8 text-slate-600">
            {mr
              ? "कृपया प्रत्यक्ष कामाची झलक पाहण्यासाठी ही तुलना वापरली जाते. वास्तविक प्रकल्प फोटो जोडल्यावर ही विभाग अधिक प्रभावी दिसते."
              : "This section helps visitors compare project impact visually. Replace these sample images with real ward improvement photos for each completed work."}
          </p>
        </div>
        <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
          {mr ? "स्लायड करून तुलना करा" : "Drag to compare"}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 p-2 sm:p-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
          <div className="absolute inset-0">
            <Image
              src={beforeImage}
              alt={mr ? "कामापूर्वीचे चित्र" : "Before work image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </div>

          <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${slider}%` }}>
            <Image
              src={afterImage}
              alt={mr ? "कामानंतरचे चित्र" : "After work image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </div>

          <div className="absolute inset-y-0" style={{ left: `${slider}%` }}>
            <div className="h-full w-[3px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-xl font-black text-white shadow-lg">
              ⇄
            </div>
          </div>

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-sm font-black text-slate-800 shadow">
            {mr ? "पूर्व" : "Before"}
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-orange-600 px-3 py-2 text-sm font-black text-white shadow">
            {mr ? "नंतर" : "After"}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="range"
              min="10"
              max="90"
              value={slider}
              onChange={(event) => setSlider(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-orange-500"
              aria-label={mr ? "तुलना बदलण्यासाठी स्लायडर" : "Adjust comparison slider"}
            />
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {mr ? `सध्याची तुलना: ${slider}%` : `Current view: ${slider}%`}
          </div>
        </div>
      </div>
    </section>
  );
}
