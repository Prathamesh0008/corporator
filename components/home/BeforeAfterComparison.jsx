"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BeforeAfterComparison({ mr = false, beforeImage, afterImage, title, description, auto = false, speed = 40 }) {
  // when auto-playing, start at the "before" end (minimal after overlay)
  const minStart = 10;
  const defaultStart = 58;
  const [slider, setSlider] = useState(() => (auto ? minStart : defaultStart));

  // simple autoplay: slider moves between 10 and 90 and reverses direction
  useEffect(() => {
    if (!auto) return;
    let dir = 1; // 1 = forward (increase), -1 = backward
    const min = minStart;
    const max = 90;
    const step = 1;
    const interval = setInterval(() => {
      setSlider((s) => {
        let next = s + dir * step;
        if (next >= max) {
          next = max;
          dir = -1;
        } else if (next <= min) {
          next = min;
          dir = 1;
        }
        return next;
      });
    }, Math.max(10, speed));
    return () => clearInterval(interval);
  }, [auto, speed]);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>

      <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 p-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
          <div className="absolute inset-0">
            <Image src={beforeImage} alt={mr ? `${title} पूर्व` : `${title} before`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${slider}%` }}>
            <Image src={afterImage} alt={mr ? `${title} नंतर` : `${title} after`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="absolute inset-y-0" style={{ left: `${slider}%` }}>
            <div className="h-full w-[3px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
            <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-base font-black text-white shadow-lg">
              ⇄
            </div>
          </div>
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1.5 text-xs font-black text-slate-800 shadow">{mr ? "पूर्व" : "Before"}</div>
          <div className="absolute right-2 top-2 rounded-full bg-orange-600 px-2.5 py-1.5 text-xs font-black text-white shadow">{mr ? "नंतर" : "After"}</div>
        </div>
        {/* hide manual controls when auto-playing to keep UI simple */}
        {!auto ? (
          <div className="mt-3 flex flex-col gap-2">
            <input type="range" min="10" max="90" value={slider} onChange={(event) => setSlider(Number(event.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-orange-500" aria-label={mr ? "तुलना बदलवा" : "Adjust comparison"} />
            <div className="text-sm font-semibold text-slate-700">{mr ? `दृष्टी: ${slider}%` : `View: ${slider}%`}</div>
          </div>
        ) : (
          <div className="mt-3 text-sm font-semibold text-slate-700">{mr ? `दृष्टी: ${slider}%` : `View: ${slider}%`}</div>
        )}
      </div>
    </div>
  );
}
