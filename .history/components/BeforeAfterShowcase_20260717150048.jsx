"use client";

import { useState } from "react";
import Image from "next/image";

const workItems = [
  {
    id: "road",
    titleEn: "Road resurfacing and drainage repair",
    titleMr: "रस्त्याची डांबरीकरण व गटार दुरुस्ती",
    descEn: "Improved road safety and water flow in the main lane.",
    descMr: "मुख्य रस्त्यावर सुरक्षितता आणि पाण्याच्या वाहतुकीत सुधारणा.",
    beforeImage: "/images/banner-1.jpg",
    afterImage: "/images/banner-2.jpg",
  },
  {
    id: "lighting",
    titleEn: "Streetlight and footpath upgrade",
    titleMr: "पथदिवे व पदपथ सुधारणा",
    descEn: "Added better lighting and a safer walking path.",
    descMr: "चांगल्या प्रकाश आणि सुरक्षित चालण्याच्या मार्गासाठी सुधारणा.",
    beforeImage: "/images/banner-2.jpg",
    afterImage: "/images/banner-3.jpeg",
  },
  {
    id: "cleaning",
    titleEn: "Garbage and public space beautification",
    titleMr: "कचरा व सार्वजनिक क्षेत्र सौंदर्यीकरण",
    descEn: "Cleaner surroundings and a more organized civic space.",
    descMr: "स्वच्छ वातावरण आणि अधिक सुव्यवस्थित सार्वजनिक क्षेत्र.",
    beforeImage: "/images/banner-3.jpeg",
    afterImage: "/images/banner-1.jpg",
  },
];

export default function BeforeAfterShowcase({ mr = false }) {
  const [sliderValues, setSliderValues] = useState(() =>
    workItems.reduce((acc, item) => ({ ...acc, [item.id]: 58 }), {})
  );

  const updateSlider = (id, value) => {
    setSliderValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-black tracking-[0.2em] text-orange-700">
            {mr ? "प्रत्येक कामाची तुलना" : "WORK BY WORK"}
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            {mr ? "प्रत्येक प्रकल्पासाठी आधी-नंतरचे बदल" : "Before and after progress for every public work"}
          </h2>
          <p className="mt-3 text-lg leading-8 text-slate-600">
            {mr
              ? "प्रत्येक कामासाठी स्वतंत्र आधी-नंतरची तुलना दाखवून नागरिकांना प्रगती सहज दिसते."
              : "Each completed work can now be shown with its own before and after story for better transparency."}
          </p>
        </div>
        <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
          {mr ? "प्रत्येक कामासाठी इंटरएक्टिव्ह" : "Interactive per work"}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {workItems.map((item) => {
          const slider = sliderValues[item.id];
          return (
            <article key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {mr ? item.titleMr : item.titleEn}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {mr ? item.descMr : item.descEn}
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700 shadow-sm">
                  {mr ? "तुलना" : "Compare"}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100 p-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
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
                    <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-lg font-black text-white shadow-lg">
                      ⇄
                    </div>
                  </div>

                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-2 text-sm font-black text-slate-800 shadow">
                    {mr ? "पूर्व" : "Before"}
                  </div>
                  <div className="absolute right-3 top-3 rounded-full bg-orange-600 px-3 py-2 text-sm font-black text-white shadow">
                    {mr ? "नंतर" : "After"}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={slider}
                    onChange={(event) => updateSlider(item.id, Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-orange-500"
                    aria-label={mr ? ` ${item.titleMr} साठी तुलना बदलण्यासाठी` : `Adjust comparison for ${item.titleEn}`}
                  />
                  <div className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
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
