"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { faqData } from "../../data/siteContent";
import SectionHeading from "./SectionHeading";

export default function HomeFaqSection() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <section className="section-padding border-t border-slate-200 bg-white" aria-labelledby="home-faq-title">
      <div className="container-responsive">
        <div>
          <div id="home-faq-title">
            <SectionHeading eyebrow={mr ? "वारंवार विचारले जाणारे प्रश्न" : "FAQ"} title={mr ? "सामान्य प्रश्न" : "Frequently asked questions"} description={mr ? "तक्रार, पाठपुरावा आणि संपर्क याबाबतच्या सामान्य शंका." : "Common questions about complaints, tracking and public service updates."} />
          </div>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {faqData.map((item) => (
              <details key={item.id} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-black text-slate-900">
                  <span>{mr ? item.questionMr : item.questionEn}</span>
                  <span className="text-xl text-orange-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{mr ? item.answerMr : item.answerEn}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
