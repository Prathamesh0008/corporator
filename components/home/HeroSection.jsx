"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiMapPin, FiPhone, FiSearch } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";

export default function HeroSection() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br from-[#082f49] via-[#0a3e5a] to-[#1e6b80] p-6 text-white shadow-xl sm:p-8 lg:p-10">
      <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            <FiMapPin /> {mr ? "वॉर्ड २४(ड), नेरूळ" : "Ward 24(D), Nerul"}
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {mr ? "सार्वजनिक सेवेचा विश्वास, नागरिकांच्या आवाजासाठी सज्ज" : "Trusted public service, ready to hear your voice"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
            {mr
              ? "नगरसेवक सचिन देवप्पा लवटे यांच्या कार्यालयाकडून तक्रार नोंदणी, पाठपुरावा आणि वॉर्ड विकासाच्या कामांची माहिती एका सोप्या अनुभवात उपलब्ध आहे."
              : "From complaint registration to ward development updates, the office of Corporator Sachin Devappa Lavate brings civic support and follow-up into one clear experience."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/complaints#register" className="complaint-cta justify-center">{mr ? "आता तक्रार नोंदवा" : "Register Complaint"}</Link>
            <Link href="/complaints#track" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#082f49]"> <FiSearch /> {mr ? "तक्रार तपासा" : "Track Complaint"}</Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#082f49]"> <FiPhone /> {mr ? "संपर्क करा" : "Contact"}</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">{mr ? "मोबाईल-फ्रेंडली सेवा" : "Mobile-friendly service"}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">{mr ? "पारदर्शक पाठपुरावा" : "Transparent follow-up"}</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 rounded-[32px] bg-white/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">
            <Image src="/bio.png" alt={mr ? "सचिन देवप्पा लवटे" : "Sachin Devappa Lavate"} width={720} height={900} className="h-[500px] w-full rounded-[24px] object-cover object-top" priority sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
