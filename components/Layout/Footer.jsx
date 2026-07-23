"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiAlertCircle, FiArrowRight, FiMapPin } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const mr = language === "mr";
  const links = [["Home", "मुख्यपृष्ठ", "/"], ["About", "माहिती", "/about"], ["Ward works", "वॉर्ड कामे", "/works"], ["Ward services", "वॉर्ड सेवा", "/services"], ["News", "बातम्या", "/news"], ["Gallery", "छायाचित्रे", "/gallery"], ["Office", "कार्यालय", "/contact"]];
  if (pathname.startsWith("/ward-control")) return null;
  return <footer className="relative overflow-hidden bg-[#071d2b] text-white">
    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
    <div className="container-responsive relative px-5 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_.8fr_.9fr]">
        <div><div className="flex items-center gap-4"><Image src="/logo-6.png" alt="Sachin Lavate office logo" width={80} height={80} className="h-20 w-20 rounded-full object-cover"/><div><h2 className="text-xl font-black text-white">{mr ? "नगरसेवक सचिन लवटे" : "Corporator Sachin Lavate"}</h2><p className="font-bold text-orange-300">{mr ? "वॉर्ड २४(ड), नेरूळ" : "Ward 24(D), Nerul"}</p></div></div><p className="mt-5 max-w-md leading-7 text-slate-300">{mr ? "वॉर्डमधील महानगरपालिका नागरी समस्यांची नोंद, समन्वय आणि पाठपुरावा करण्यासाठी नागरिक-केंद्रित संकेतस्थळ." : "A citizen-first website for reporting, coordinating, and following up on municipal civic issues in the ward."}</p></div>
        <div><h3 className="text-lg font-black text-white">{mr ? "महत्त्वाचे दुवे" : "Useful links"}</h3><ul className="mt-4 grid grid-cols-2 gap-3">{links.map(([en, marathi, href]) => <li key={href}><Link href={href} className="inline-flex items-center gap-1 text-slate-300 transition hover:translate-x-1 hover:text-orange-300">{mr ? marathi : en}</Link></li>)}</ul></div>
        <div><h3 className="text-lg font-black text-white">{mr ? "सेवा क्षेत्र" : "Service area"}</h3><p className="mt-4 flex items-start gap-2 text-slate-300"><FiMapPin className="mt-1 shrink-0 text-orange-400" />Ward 24(D), Nerul, Navi Mumbai</p><a href="https://www.instagram.com/samajsevaksachinlavate/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-2xl text-white transition hover:scale-105"><FaInstagram /></a></div>
      </div>
      <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row"><p>© {new Date().getFullYear()} Corporator Sachin Lavate · Ward 24(D), Nerul</p><div className="flex flex-wrap gap-4"><Link href="/privacy" className="hover:text-white">{mr ? "गोपनीयता" : "Privacy"}</Link><Link href="/terms" className="hover:text-white">{mr ? "अटी" : "Terms"}</Link><Link href="/disclaimer" className="hover:text-white">{mr ? "अस्वीकरण" : "Disclaimer"}</Link></div></div>
    </div>
  </footer>;
}
