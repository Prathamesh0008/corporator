"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiChevronRight, FiClock, FiMapPin, FiPhone, FiShield, FiTrendingUp } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { newsData, schemesData, statsData, testimonialsData } from "../../data/siteContent";
import SectionHeading from "./SectionHeading";
import Counter from "./Counter";
import BeforeAfterComparison from "./BeforeAfterComparison";

export default function HomepageSections() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <div className="divide-y divide-slate-200 bg-white">
      <section className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-600">{mr ? "अधिकृत सार्वजनिक सेवा" : "Official public service"}</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              {mr ? "वॉर्ड २४(ड) साठी पारदर्शक, सोयीची आणि जलद सेवा" : "Transparent, convenient and prompt service for Ward 24(D)"}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {mr
                ? "तक्रार नोंदणीपासून विकास प्रकल्पांपर्यंत सर्व माहिती एका ठिकाणी. नागरिकांना स्पष्ट मार्गदर्शन आणि वेळेवर पाठपुरावा मिळावा यासाठी हे पृष्ठ सज्ज केले आहे."
                : "From complaint registration to development work updates, everything is arranged in one place to make civic service clearer and faster."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/complaints#register" className="complaint-cta">{mr ? "तक्रार नोंदवा" : "Register Complaint"}</Link>
              <Link href="/complaints#track" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600">{mr ? "तक्रार तपासा" : "Track Complaint"}</Link>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#082f49] via-[#0d3d57] to-[#1a5f7f] p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <FiShield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">{mr ? "प्राथमिक सेवा" : "Core service"}</p>
                <p className="text-lg font-black">{mr ? "तात्काळ मदत आणि विचाराधीन तक्रारी" : "Fast support and follow-up for civic issues"}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-200">{mr ? "कार्यालय वेळ" : "Office hours"}</p>
                <p className="mt-2 flex items-center gap-2 font-semibold"> <FiClock className="text-orange-300" /> {mr ? "सकाळी १० ते ६" : "10 AM to 6 PM"}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm text-slate-200">{mr ? "संपर्क" : "Contact"}</p>
                <p className="mt-2 flex items-center gap-2 font-semibold"> <FiPhone className="text-orange-300" /> +91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <SectionHeading eyebrow={mr ? "आकडेवारी" : "Public impact"} title={mr ? "वॉर्डातील सार्वजनिक सेवेची पार्श्वभूमी" : "A clear picture of ward service impact"} description={mr ? "लोकांच्या तक्रारी, प्रगती आणि सेवा स्तराची स्पष्ट मोजमापे." : "Numbers that reflect public service, development progress and citizen support."} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statsData.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-600">{mr ? item.labelMr : item.labelEn}</p>
              <p className="mt-3 text-4xl font-black text-[#082f49]">
                <Counter value={item.value} suffix={item.suffix ?? ""} prefix={item.prefix ?? ""} />
              </p>
              <p className="mt-2 text-sm text-slate-500">{mr ? item.noteMr ?? "" : item.noteEn ?? ""}</p>
            </div>
          ))}
        </div>
      </section>

  

      <section className="py-10 sm:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={mr ? "सध्याच्या बातम्या" : "Latest updates"} title={mr ? "नवीन घोषणा आणि अपडेट्स" : "Recent announcements and updates"} description={mr ? "वॉर्डातील कामे आणि सेवा बद्दल ताज्या बातम्या." : "Fresh updates about service delivery and ward initiatives."} align="left" />
          <Link href="/news" className="inline-flex items-center gap-2 font-semibold text-orange-600">{mr ? "सर्व बातम्या पहा" : "View all news"}<FiChevronRight /></Link>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {newsData.slice(0, 3).map((item) => (
            <article key={item.id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 shadow-sm">
              <div className="relative h-44">
                <Image src={item.image} alt={mr ? item.titleMr : item.titleEn} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-orange-600">{mr ? item.categoryMr : item.categoryEn}</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">{mr ? item.titleMr : item.titleEn}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{mr ? item.summaryMr : item.summaryEn}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>{new Date(item.date).toLocaleDateString(language === "mr" ? "en-IN" : "en-US")}</span>
                  <Link href={`/news/${item.slug}`} className="font-semibold text-orange-600">{mr ? "अधिक वाचा" : "Read More"}</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <SectionHeading eyebrow={mr ? "नागरिक अभिप्राय" : "Testimonials"} title={mr ? "राहिवाशांच्या अनुभव" : "What citizens say"} description={mr ? "वॉर्डाच्या सेवा अनुभवांविषयी नागरिकांचे प्रत्यक्ष मत." : "Real feedback from citizens who used the ward service channels."} />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonialsData.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#082f49] text-lg font-black text-white">{item.name.charAt(0)}</div>
                <div>
                  <h3 className="font-black text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600">{mr ? item.areaMr : item.areaEn}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">“{mr ? item.feedbackMr : item.feedbackEn}”</p>
              {item.rating ? <div className="mt-3 text-orange-500">{'★'.repeat(item.rating)}</div> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <SectionHeading eyebrow={mr ? "सरकारी योजना" : "Government schemes"} title={mr ? "नागरिकांसाठी उपलब्ध योजना" : "Schemes and citizen services"} description={mr ? "वॉर्डातील नागरिकांसाठी उपलब्ध सरकारी आणि शासकीय सेवा." : "Helpful schemes and services for citizens in the ward."} />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {schemesData.map((scheme) => (
            <div key={scheme.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{mr ? scheme.titleMr : scheme.titleEn}</h3>
                  <p className="mt-2 text-sm text-slate-600">{mr ? `अंतिम अद्यतन: ${scheme.updated}` : `Last updated: ${scheme.updated}`}</p>
                </div>
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">{mr ? "अधिकृत" : "Official"}</span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div><span className="font-black text-slate-900">{mr ? "पात्रता" : "Eligibility"}: </span>{mr ? scheme.eligibilityMr : scheme.eligibilityEn}</div>
                <div><span className="font-black text-slate-900">{mr ? "फायदे" : "Benefits"}: </span>{mr ? scheme.benefitsMr : scheme.benefitsEn}</div>
                <div><span className="font-black text-slate-900">{mr ? "दस्तऐवज" : "Documents"}: </span>{mr ? scheme.docsMr : scheme.docsEn}</div>
              </div>
              <Link href={scheme.link} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-600">{mr ? "अधिकृत दुवा" : "Official link"}<FiArrowRight /></Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
