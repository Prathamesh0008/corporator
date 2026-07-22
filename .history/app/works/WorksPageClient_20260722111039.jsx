"use client";

import Link from "next/link";
import { FiAlertCircle, FiArrowRight, FiCheckCircle, FiMapPin } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import BeforeAfterShowcase from "../../components/BeforeAfterShowcase";

export default function WorksPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-responsive px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.14em] text-orange-700">
                
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <FiMapPin className="text-orange-600" /> {mr ? "वॉर्ड २४(ड), नेरूळ" : "Ward 24(D), Nerul"}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {mr ? "कामापूर्वी आणि कामानंतर" : "Our Work: Before & After"}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {mr
                  ? "वॉर्डातील पूर्ण झालेल्या नागरी कामांचे फोटो, ठिकाण आणि संक्षिप्त माहिती एकाच ठिकाणी पहा."
                  : "Explore before and after photographs, locations and key details of completed civic works across the ward."}
              </p>
            </div>

            <Link href="/complaints#register"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-orange-600 px-5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-md lg:self-auto">
              <FiAlertCircle /> {mr ? "समस्या नोंदवा" : "Report an Issue"} <FiArrowRight />
            </Link>
          </div>
        </div>
      </header>

      <main className="container-responsive px-4 pb-14 sm:px-6 lg:px-8">
        <div id="completed-works" className="scroll-mt-24">
          <BeforeAfterShowcase mr={mr} />
        </div>

        <section className="mt-12 flex flex-col gap-5 overflow-hidden rounded-2xl bg-[#082f49] px-5 py-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
              <FiAlertCircle />
            </span>
            <div>
              <h2 className="text-lg font-black text-white">
                {mr ? "आपल्या परिसरात नागरी समस्या आहे?" : "See a civic issue in your area?"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-blue-100">
                {mr ? "फोटो आणि अचूक ठिकाणासह आम्हाला कळवा." : "Let us know with a photograph and the exact location."}
              </p>
            </div>
          </div>
          <Link href="/complaints#register"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-[#082f49] transition hover:bg-orange-50">
            {mr ? "समस्या नोंदवा" : "Report an Issue"} <FiArrowRight />
          </Link>
        </section>
      </main>
    </div>
  );
}
