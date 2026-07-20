"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiMapPin, FiUsers } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";

const story = [
  { year: "मुळं", yearEn: "Roots", titleMr: "नेरूळमध्ये जडलेली नाळ", titleEn: "Roots in Nerul", textMr: "स्व. देवाप्पा सीताराम लवटे यांचे सुपुत्र सचिन देवाप्पा लवटे यांचे कुटुंब सुमारे ३० वर्षांपासून नेरूळ सेक्टर १८ येथे वास्तव्यास आहे. त्यांचे बालपण आणि जडणघडण याच परिसरात झाली.", textEn: "Sachin Devappa Lavate, son of the late Shri Devappa Sitaram Lavate, belongs to a family that has lived in Nerul Sector 18 for around 30 years. His childhood and formative years were spent here." },
  { year: "संस्कार", yearEn: "Values", titleMr: "कष्टातून घडलेले व्यक्तिमत्त्व", titleEn: "A life shaped by hard work", textMr: "वडिलांची खाजगी नोकरी, आईचा छोटा घरगुती व्यवसाय आणि कुटुंबाने चालवलेली टपरी—या साध्या पार्श्वभूमीने कष्ट, स्वाभिमान आणि सामान्य माणसाशी जोडलेपणाची शिकवण दिली.", textEn: "His father’s private-sector job, his mother’s small home business and the family’s modest stall taught him hard work, dignity and a lasting connection with ordinary people." },
  { year: "शिक्षण", yearEn: "Education", titleMr: "MBA फायनान्स आणि बँकिंग अनुभव", titleEn: "MBA Finance and banking experience", textMr: "शिक्षण पूर्ण करताना कुटुंबाच्या व्यवसायात हातभार लावल्यानंतर त्यांनी MBA (Finance) पूर्ण केले आणि बँकिंग क्षेत्रात कामाचा अनुभव घेतला.", textEn: "After supporting the family business while studying, he completed an MBA in Finance and gained professional experience in banking." },
  { year: "१२+ वर्षे", yearEn: "12+ years", titleMr: "समाजसेवेचा सातत्यपूर्ण प्रवास", titleEn: "A sustained journey of social service", textMr: "क्रीडा, सामाजिक, धार्मिक, शैक्षणिक आणि वैद्यकीय क्षेत्रांतील विविध उपक्रमांतून गेली १२ हून अधिक वर्षे नागरिकांसोबत काम सुरू आहे.", textEn: "For more than 12 years, he has worked with citizens through sports, social, cultural, educational and medical initiatives." },
  { year: "२०२६", yearEn: "2026", titleMr: "वॉर्ड २४(ड) चे लोकप्रतिनिधित्व", titleEn: "Representing Ward 24(D)", textMr: "नेरूळच्या वॉर्ड २४(ड) मधील नागरिकांनी दिलेल्या विश्वासातून स्थानिक प्रश्न, नागरी सुविधा आणि विकासकामांचा जबाबदार पाठपुरावा सुरू आहे.", textEn: "With the trust of Ward 24(D), Nerul, he continues responsible follow-up on local concerns, civic services and development work." },
  { year: "संकल्प", yearEn: "Resolve", titleMr: "सेवा हीच बांधिलकी", titleEn: "Service as a commitment", textMr: "प्रत्येक नागरिकाचा विकास, प्रत्येक कुटुंबाचे कल्याण आणि संपूर्ण वॉर्डची प्रगती साधत वॉर्ड २४(ड) आदर्श बनवणे हा संकल्प आहे.", textEn: "His resolve is to make Ward 24(D) a model ward through citizen development, family welfare and inclusive progress." },
];

function StoryMilestone({ item, index, mr }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const node = ref.current; if (!node) return undefined; const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .22, rootMargin: "0px 0px -8% 0px" }); observer.observe(node); return () => observer.disconnect(); }, []);
  return <article ref={ref} className={`milestone-item ${visible ? "milestone-visible" : ""} ${index % 2 ? "milestone-right" : "milestone-left"} relative grid pl-16 md:grid-cols-2 md:pl-0 ${index % 2 ? "md:text-left" : "md:text-right"}`}>
    <span className={`milestone-dot ${visible ? "milestone-dot-visible" : ""} absolute left-[12px] top-1.5 z-10 h-5 w-5 rounded-full border-4 border-[#fff8e8] bg-orange-600 shadow`} />
    <div className={`milestone-content ${index % 2 ? "md:col-start-2 md:pl-12" : "md:pr-12"}`}><p className="text-3xl font-black text-orange-600 sm:text-4xl">{mr ? item.year : item.yearEn}</p><h2 className="mt-2 text-2xl font-black text-[#4a210d]">{mr ? item.titleMr : item.titleEn}</h2><p className="mt-3 text-base leading-8 text-[#765f4d]">{mr ? item.textMr : item.textEn}</p></div>
  </article>;
}

export default function AboutPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  return <main className="min-h-screen bg-[#fff8e8]">
    <section className="about-full-hero relative isolate w-full overflow-hidden bg-[#fff8e8]">
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full border-[42px] border-white/10" /><div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full border-[56px] border-green-700/20" /><Image src="/lotus.webp" alt="" width={220} height={220} className="absolute right-4 top-8 hidden w-44 rotate-12 opacity-15 lg:block" />
      <div className="relative mx-auto grid max-w-6xl items-end gap-8 lg:grid-cols-[1fr_.8fr]">
        
        <Image src="/About/self.png" alt={mr ? "सचिन देवाप्पा लवटे" : "Sachin Devappa Lavate"} width={620} height={760} priority className="mx-auto max-h-[520px] w-auto object-contain object-bottom drop-shadow-2xl" />
      </div>
    </section>
    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-6xl">
      <blockquote className="mx-auto max-w-4xl text-center text-2xl font-black leading-relaxed text-[#4a210d] sm:text-4xl">“{mr ? "पदापेक्षा सेवा मोठी, आणि स्वतःपेक्षा जनता प्रथम." : "Service is greater than position, and people come before self."}”</blockquote>
      <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-[#765f4d]">{mr ? "सामान्य कुटुंबातील मुलगा ते लोकप्रतिनिधी—हा प्रवास नेरूळकरांच्या विश्वासाने, कुटुंबाच्या संस्कारांनी आणि जनसेवेच्या संकल्पाने घडला." : "From a son of an ordinary family to a public representative, this journey has been shaped by family values, the trust of Nerul and a commitment to public service."}</p>
      <div className="relative mt-16 md:mt-24"><div className="absolute bottom-0 left-5 top-0 w-1 bg-gradient-to-b from-orange-400 via-orange-500 to-green-600 md:left-1/2 md:-translate-x-1/2" /><div className="space-y-10 md:space-y-16">{story.map((item, index) => <StoryMilestone key={item.titleEn} item={item} index={index} mr={mr} />)}</div></div>
      <div className="mt-20 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/contact" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 font-black text-white hover:bg-orange-700"><FiUsers />{mr ? "संपर्क साधा" : "Contact Office"}<FiArrowRight /></Link><Link href="/complaints#register" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#4a210d] px-7 font-black text-[#4a210d] hover:bg-[#4a210d] hover:text-white">{mr ? "नागरी समस्या नोंदवा" : "Report a Civic Issue"}<FiArrowRight /></Link></div>
    </div></section>

    <section className="w-full border-y border-[#ead8b7] bg-[#fff1d9] px-5 py-10 text-center sm:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[.28em] text-orange-600">
          {mr ? "आपलं नेरूळ, आपली बांधिलकी" : "Our Nerul, Our Commitment"}
        </p>
        <h2 className="mt-3 text-3xl font-black leading-tight text-[#4a210d] sm:text-5xl">
          {mr ? "नेरूळच्या प्रगतीसाठी सदैव तत्पर" : "Always Committed to Nerul's Progress"}
        </h2>
        <p className="mx-auto mt-5 max-w-5xl text-base leading-7 text-[#756657] sm:text-lg">
          {mr
            ? "२०२६ च्या नवी मुंबई महानगरपालिका निवडणुकीत सचिन लवटे प्रभाग २४ मधून निवडून आले. नेरूळ पश्चिम–सीवूड्स परिसरातील नागरिकांनी दिलेला विश्वास जपत, स्थानिक नागरी सुविधा, शिक्षण आणि वॉर्डच्या सर्वांगीण विकासासाठी सातत्याने पाठपुरावा करण्याची त्यांची बांधिलकी आहे."
            : "Sachin Lavate was elected from Ward 24 in the 2026 Navi Mumbai Municipal Corporation election. Honouring the trust placed in him by residents of the Nerul West–Seawoods area, he remains committed to sustained work for civic services, education and the ward's inclusive development."}
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 font-black text-white shadow-[0_12px_30px_rgba(249,115,22,.25)] transition hover:-translate-y-0.5 hover:bg-orange-600"
        >
          {mr ? "माझ्याशी संपर्क साधा" : "Connect With Me"}
          <FiArrowRight />
        </Link>
      </div>
    </section>
  </main>;
}
