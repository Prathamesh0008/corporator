"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiAlertCircle, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";
import LanguageSwitcher from "../Common/LanguageSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguage();
  const mr = language === "mr";
  const links = [["nav.home", "/"], ["nav.works", "/works"], ["nav.services", "/services"], ["nav.news", "/news"], ["nav.gallery", "/gallery"], ["nav.contact", "/contact"]];
  const journey = [["/nation-first", mr ? "राष्ट्र प्रथम" : "Nation First"], ["/nantar-paksha", mr ? "नंतर पक्ष" : "Party Next"], ["/about", mr ? "शेवटी स्वतः" : "Self Last"]];
  const active = (path) => path === "/" ? pathname === "/" : pathname.startsWith(path);
  const journeyActive = journey.some(([path]) => active(path));

  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); addEventListener("scroll", onScroll, { passive: true }); return () => removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => setOpen(false), [pathname]);

  return <>
    

    <nav className={`sticky top-0 z-[100] border-b bg-white/95 backdrop-blur-xl transition-all duration-300 ${scrolled ? "border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,.08)]" : "border-slate-100"}`} aria-label="Primary navigation">
      <div className="container-responsive flex h-[88px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Sachin Lavate home">
          {/* <Image src="/logo-3.png" alt={mr ? "सचिन देवप्पा लवटे" : "Sachin Devappa Lavate"} width={78} height={78} priority className="h-[78px] w-[78px] shrink-0 object-contain transition duration-300 group-hover:scale-[1.03]" /> */}
          <span className="hidden shrink-0 whitespace-nowrap border-l border-slate-200 pl-3 leading-tight sm:block"><strong className="block text-[17px] font-black tracking-tight text-slate-900">{mr ? "सचिन देवप्पा लवटे" : "Sachin D. Lavate"}</strong><span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[.18em] text-orange-600">{mr ? "नगरसेवक • वॉर्ड २४(ड)" : "Corporator • Ward 24(D)"}</span></span>
        </Link>

        <div className="hidden h-full items-center lg:flex">
          {links.map(([key, path], index) => <div key={path} className="contents">
            <Link href={path} className={`relative flex h-full items-center px-3 text-[13px] font-semibold transition ${active(path) ? "text-orange-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-orange-500" : "text-slate-600 hover:text-orange-600"}`}>{t(key, language)}</Link>
            {index === 0 && <div className="group relative flex h-full items-center">
              <button type="button" className={`flex h-full items-center gap-1.5 px-3 text-[13px] font-semibold transition ${journeyActive ? "text-orange-600" : "text-slate-600 hover:text-orange-600"}`}>{t("nav.about", language)}<FiChevronDown className="transition duration-200 group-hover:rotate-180 group-focus-within:rotate-180" /></button>
              <div className="invisible absolute left-0 top-[calc(100%-4px)] w-56 translate-y-2 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(15,23,42,.14)] transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {journey.map(([href, label], itemIndex) => <Link key={href} href={href} className={`group/item flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition hover:bg-orange-50 hover:text-orange-700 ${active(href) ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}><span className={`h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] transition group-hover/item:rotate-[135deg] ${itemIndex === 0 ? "bg-orange-500" : itemIndex === 1 ? "bg-[#082f49]" : "bg-green-600"}`} />{label}</Link>)}
              </div>
            </div>}
          </div>)}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/complaints#register" className="hidden min-h-11 items-center gap-2 rounded-full bg-orange-600 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-md xl:inline-flex"><FiAlertCircle />{mr ? "तक्रार" : "Complaint"}</Link>
          <button type="button" onClick={() => setOpen(!open)} className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}</button>
        </div>
      </div>

      {open && <div id="mobile-navigation" className="absolute inset-x-0 top-full max-h-[calc(100vh-104px)] overflow-y-auto border-t border-slate-100 bg-white p-4 shadow-2xl lg:hidden">
        <div className="container-responsive space-y-1">
          {links.map(([key, path], index) => <div key={path}>
            <Link href={path} className={`flex min-h-12 items-center rounded-lg px-4 font-bold ${active(path) ? "bg-orange-50 text-orange-700" : "text-slate-700 hover:bg-slate-50"}`}>{t(key, language)}</Link>
            {index === 0 && <details className="group"><summary className="flex min-h-12 cursor-pointer list-none items-center rounded-lg px-4 font-bold text-slate-700 hover:bg-slate-50">{t("nav.about", language)}<FiChevronDown className="ml-auto transition group-open:rotate-180" /></summary><div className="ml-4 border-l border-orange-200 pl-3">{journey.map(([href, label], itemIndex) => <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-700"><span className={`h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] ${itemIndex === 0 ? "bg-orange-500" : itemIndex === 1 ? "bg-[#082f49]" : "bg-green-600"}`} />{label}</Link>)}</div></details>}
          </div>)}
          <Link href="/complaints#register" className="complaint-cta mt-3 w-full justify-center"><FiAlertCircle />{mr ? "तक्रार नोंदवा" : "Register Complaint"}</Link>
        </div>
      </div>}
    </nav>
  </>;
}
