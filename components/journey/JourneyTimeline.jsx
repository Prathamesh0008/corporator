"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";

function Milestone({ event, index, mr }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <article ref={ref} className={`milestone-item ${visible ? "milestone-visible" : ""} ${index % 2 ? "milestone-right" : "milestone-left"} relative grid pl-16 md:grid-cols-2 md:pl-0 ${index % 2 ? "md:text-left" : "md:text-right"}`}>
    <span className={`milestone-dot ${visible ? "milestone-dot-visible" : ""} absolute left-[12px] top-1.5 z-10 h-5 w-5 rounded-full border-4 border-[#fff8e8] bg-orange-600 shadow`} />
    <div className={`milestone-content ${index % 2 ? "md:col-start-2 md:pl-12" : "md:pr-12"}`}>
      <p className="text-3xl font-black text-orange-600 sm:text-4xl">{event.year}</p>
      <h2 className="mt-2 text-2xl font-black text-[#4a210d]">{mr ? event.titleMr : event.titleEn}</h2>
      <p className="mt-3 text-base leading-8 text-[#765f4d]">{mr ? event.textMr : event.textEn}</p>
    </div>
  </article>;
}

export default function JourneyTimeline({ type, events }) {
  const { language } = useLanguage();
  const mr = language === "mr";
  const nation = type === "nation";
  const title = nation ? (mr ? "राष्ट्र प्रथम" : "Nation First") : (mr ? "नंतर पक्ष" : "Party Next");
  const quote = nation ? (mr ? "सबका साथ, सबका विकास, सबका विश्वास, सबका प्रयास" : "Together, with everyone’s development, trust and effort") : (mr ? "अंधेरा छटेगा, सूरज निकलेगा, कमल खिलेगा" : "The darkness will pass, the sun will rise, and the lotus will bloom");

  return <main className="min-h-screen bg-[#fff8e8]">
    <section className="relative w-full overflow-hidden bg-[#fff8e8]" aria-labelledby="journey-page-title">
      <h1 id="journey-page-title" className="sr-only">{title}</h1>
      <Image
        src={nation ? "/About/nationFirst.png" : "/About/partyNext.png"}
        alt={title}
        width={2243}
        height={701}
        priority
        className="block h-auto w-full max-w-none object-contain"
        sizes="100vw"
      />
    </section>
    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-6xl">
      <blockquote className="mx-auto max-w-4xl text-center text-2xl font-black leading-relaxed text-[#4a210d] sm:text-4xl">“{quote}”</blockquote>
      <div className="relative mt-16 md:mt-24"><div className="absolute bottom-0 left-5 top-0 w-1 bg-gradient-to-b from-orange-400 via-orange-500 to-green-600 md:left-1/2 md:-translate-x-1/2" /><div className="space-y-10 md:space-y-16">
        {events.map((event, index) => <Milestone key={`${event.year}-${event.titleEn}`} event={event} index={index} mr={mr} />)}
      </div></div>
      <div className="mt-20 flex flex-col justify-center gap-3 sm:flex-row"><Link href={nation ? "/nantar-paksha" : "/nation-first"} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 font-black text-white hover:bg-orange-700">{nation ? (mr ? "नंतर पक्ष" : "Party Next") : (mr ? "राष्ट्र प्रथम" : "Nation First")}<FiArrowRight /></Link><Link href="/about" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#4a210d] px-7 font-black text-[#4a210d] hover:bg-[#4a210d] hover:text-white">{mr ? "शेवटी स्वतः" : "Self Last"}<FiArrowRight /></Link></div>
    </div></section>
  </main>;
}
