"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { workItems } from "./workData";

export default function BeforeAfterShowcase({ mr = false }) {
  const [sliderValues, setSliderValues] = useState(() =>
    workItems.reduce((acc, item) => ({ ...acc, [item.id]: 58 }), {})
  );

  const updateSlider = (id, value) => {
    setSliderValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-black tracking-[0.2em] text-orange-700">
            {mr ? "प्रत्येक कामाची तुलना" : "WORK BY WORK"}
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {mr ? "प्रत्येक प्रकल्पासाठी आधी-नंतरचे बदल" : "Before and after progress for every public work"}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {workItems.slice(0, 4).map((item) => {
          const slider = sliderValues[item.id];
          return (
            <article key={item.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {mr ? item.titleMr : item.titleEn}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {mr ? item.shortMr : item.shortEn}
                  </p>
                </div>
                <Link href={`/works/${item.slug}`} className="shrink-0 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white">
                  {mr ? "तपशील" : "Detail"}
                </Link>
              </div>

              <div className="mt-4 overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100 p-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[14px]">
                  <div className="absolute inset-0">
                    <Image
                      src={item.beforeImage}
                      alt={mr ? `${item.titleMr} पूर्व` : `${item.titleEn} before`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${slider}%` }}>
                    <Image
                      src={item.afterImage}
                      alt={mr ? `${item.titleMr} नंतर` : `${item.titleEn} after`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  <div className="absolute inset-y-0" style={{ left: `${slider}%` }}>
                    <div className="h-full w-[3px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
                    <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-base font-black text-white shadow-lg">
                      ⇄
                    </div>
                  </div>

                  <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1.5 text-xs font-black text-slate-800 shadow">
                    {mr ? "पूर्व" : "Before"}
                  </div>
                  <div className="absolute right-2 top-2 rounded-full bg-orange-600 px-2.5 py-1.5 text-xs font-black text-white shadow">
                    {mr ? "नंतर" : "After"}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={slider}
                    onChange={(event) => updateSlider(item.id, Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-orange-500"
                    aria-label={mr ? ` ${item.titleMr} साठी तुलना बदलण्यासाठी` : `Adjust comparison for ${item.titleEn}`}
                  />
                  <div className="text-sm font-semibold text-slate-700">
                    {mr ? `दर्शन: ${slider}%` : `View: ${slider}%`}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
