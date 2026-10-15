"use client";

import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import BeforeAfterShowcase from "../../components/BeforeAfterShowcase";

export default function WorksPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <div className="works-archive" lang={language}>
      <div id="completed-works">
        <BeforeAfterShowcase mr={mr} />
      </div>
      <section className="archive-citizen-cta">
        <div className="editorial-container">
          <div>
            <h2>{mr ? "आपल्या परिसरात नागरी समस्या आहे?" : "Have a civic issue in your area?"}</h2>
            <p>{mr ? "काय घडले आणि कुठे, ते आम्हाला कळवा." : "Tell us what happened and where."}</p>
          </div>
          <Link href="/complaints#register" className="civic-button">
            {mr ? "समस्या नोंदवा" : "Report an issue"} →
          </Link>
        </div>
      </section>
    </div>
  );
}
