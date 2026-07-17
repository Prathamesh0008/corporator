"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiAlertCircle, FiCheckCircle, FiHome, FiImage, FiMenu, FiPhone, FiSettings, FiUser, FiX } from "react-icons/fi";
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
  const items = [
    ["nav.home", "/", <FiHome key="h" />], ["nav.about", "/about", <FiUser key="a" />],
    ["nav.works", "/works", <FiCheckCircle key="w" />], ["nav.services", "/services", <FiSettings key="s" />],
    ["nav.gallery", "/gallery", <FiImage key="g" />], ["nav.contact", "/contact", <FiPhone key="c" />],
  ];
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 8); onScroll(); addEventListener("scroll", onScroll, { passive: true }); return () => removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  const active = (path) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  return <>
    <div className="border-b border-black/5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] px-4 py-1.5 text-slate-800">
      <div className="container-responsive flex items-center justify-between gap-3 text-[11px] font-semibold tracking-wide sm:text-xs"><span className="inline-flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />{mr ? "नगरसेवक सचिन लवटे | वॉर्ड २४(ड)" : "Corporator Sachin Lavate | Ward 24(D)"}</span><a href="https://www.instagram.com/samajsevaksachinlavate/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-slate-700 transition hover:bg-white hover:text-pink-600"><FaInstagram className="h-4 w-4" /></a></div>
    </div>
    <nav className={`sticky top-0 z-[100] border-b bg-white transition-all duration-300 ${scrolled ? "border-slate-200 bg-white/90 shadow-md backdrop-blur" : "border-transparent"}`} aria-label="Primary navigation">
      <div className="container-responsive flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2" aria-label="Corporator Sachin Lavate home"><Image src="/logo-6.png" alt="Sachin Lavate office logo" width={56} height={56} className="h-14 w-14 rounded-full object-cover transition duration-300 group-hover:scale-105" /><span className="hidden leading-tight sm:block"><strong className="block text-base font-semibold text-slate-900">{mr ? <>नगरसेवक<br />सचिन लवटे</> : <>Corporator<br />Sachin D. Lavate</>}</strong></span></Link>
        <div className="hidden items-center gap-1 lg:flex">{items.map(([key, path, icon]) => <Link key={key} href={path} aria-current={active(path) ? "page" : undefined} className={`flex items-center gap-2 rounded-md border-b-2 px-2.5 py-2 text-sm font-semibold transition-colors ${active(path) ? "border-orange-500 text-orange-600" : "border-transparent text-slate-700 hover:border-orange-300 hover:text-orange-600"}`}>{icon}{t(key, language)}</Link>)}</div>
        <div className="flex items-center gap-2"><LanguageSwitcher /><button onClick={() => setOpen(!open)} className="rounded-md p-2 transition hover:bg-slate-100 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}>{open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}</button></div>
      </div>
      {open && <div id="mobile-nav" className="absolute inset-x-0 top-full max-h-[calc(100vh-56px)] overflow-y-auto border-t bg-white p-4 shadow-xl lg:hidden"><div className="container-responsive grid gap-1">{items.map(([key, path, icon]) => <Link key={key} href={path} onClick={() => setOpen(false)} className={`flex min-h-12 items-center gap-3 rounded-md px-4 font-semibold ${active(path) ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-orange-50"}`}>{icon}{t(key, language)}</Link>)}<Link href="/complaints#register" onClick={() => setOpen(false)} className="complaint-cta mt-2 justify-center"><FiAlertCircle />{mr ? "तक्रार नोंदवा" : "Register Complaint"}</Link></div></div>}
    </nav>
  </>;
}
