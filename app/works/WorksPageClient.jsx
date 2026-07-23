"use client";

import Link from "next/link";
import { FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import BeforeAfterShowcase from "../../components/BeforeAfterShowcase";

export default function WorksPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <div className="min-h-screen bg-white">
      <main className="container-responsive px-4 pb-14 sm:px-6 lg:px-8">
        <div id="completed-works" className="scroll-mt-24">
          <BeforeAfterShowcase mr={mr} />
        </div>

        <section className="mt-14 flex flex-col gap-5 border-l-4 border-orange-500 bg-[#082f49] px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-white/10 text-xl">
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
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-white px-5 text-sm font-black text-[#082f49] transition hover:bg-orange-50">
            {mr ? "समस्या नोंदवा" : "Report an Issue"} <FiArrowRight />
          </Link>
        </section>
      </main>
    </div>
  );
}
