"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FiArrowRight, FiUsers } from "react-icons/fi";
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
  return <article className={`about-story-item ${index % 2 ? "about-story-right" : "about-story-left"}`}>
    <span className="about-story-marker" aria-hidden="true" />
    <div className="about-story-content"><p className="about-story-year">{mr ? item.year : item.yearEn}</p><h2>{mr ? item.titleMr : item.titleEn}</h2><p className="about-story-text">{mr ? item.textMr : item.textEn}</p></div>
  </article>;
}

export default function AboutPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  useEffect(() => {
    if (window.location.hash) return;
    const frame = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, []);
  return <main className="about-biography" lang={language}>
    <section className="about-full-hero about-biography-hero">
      <div className="relative mx-auto grid max-w-6xl items-end gap-8 lg:grid-cols-[1fr_.8fr]">
        
        <Image src="/About/self2.svg" alt={mr ? "सचिन देवाप्पा लवटे" : "Sachin Devappa Lavate"} width={620} height={760} priority className="about-original-portrait" />
      </div>
    </section>
    <section className="about-biography-body"><div className="about-biography-container">
      <blockquote className="about-biography-quote">“{mr ? "पदापेक्षा सेवा मोठी, आणि स्वतःपेक्षा जनता प्रथम." : "Service is greater than position, and people come before self."}”</blockquote>
      <p className="about-biography-intro">{mr ? "सामान्य कुटुंबातील मुलगा ते लोकप्रतिनिधी—हा प्रवास नेरूळकरांच्या विश्वासाने, कुटुंबाच्या संस्कारांनी आणि जनसेवेच्या संकल्पाने घडला." : "From a son of an ordinary family to a public representative, this journey has been shaped by family values, the trust of Nerul and a commitment to public service."}</p>
      <div className="about-story-timeline"><div className="about-story-line" /><div className="about-story-list">{story.map((item, index) => <StoryMilestone key={item.titleEn} item={item} index={index} mr={mr} />)}</div></div>
      <div className="about-biography-actions"><Link href="/contact" className="civic-button"><FiUsers />{mr ? "संपर्क साधा" : "Contact Office"}<FiArrowRight /></Link><Link href="/complaints#register" className="about-report-link">{mr ? "नागरी समस्या नोंदवा" : "Report a Civic Issue"}<FiArrowRight /></Link></div>
    </div></section>

    <section className="about-biography-commitment">
      <div className="about-biography-container">
        <p className="about-commitment-label">
          {mr ? "आपलं नेरूळ, आपली बांधिलकी" : "Our Nerul, Our Commitment"}
        </p>
        <h2 className="about-commitment-title">
          {mr ? "नेरूळच्या प्रगतीसाठी सदैव तत्पर" : "Always Committed to Nerul's Progress"}
        </h2>
        <p className="about-commitment-text">
          {mr
            ? "२०२६ च्या नवी मुंबई महानगरपालिका निवडणुकीत सचिन लवटे प्रभाग २४ मधून निवडून आले. नेरूळ पश्चिम–सीवूड्स परिसरातील नागरिकांनी दिलेला विश्वास जपत, स्थानिक नागरी सुविधा, शिक्षण आणि वॉर्डच्या सर्वांगीण विकासासाठी सातत्याने पाठपुरावा करण्याची त्यांची बांधिलकी आहे."
            : "Sachin Lavate was elected from Ward 24 in the 2026 Navi Mumbai Municipal Corporation election. Honouring the trust placed in him by residents of the Nerul West–Seawoods area, he remains committed to sustained work for civic services, education and the ward's inclusive development."}
        </p>
        <Link
          href="/contact"
          className="about-commitment-link"
        >
          {mr ? "माझ्याशी संपर्क साधा" : "Connect With Me"}
          <FiArrowRight />
        </Link>
      </div>
    </section>
  </main>;
}
