"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
export default function HeroSection({ image = "/photo.jpeg" }) {
  const { language } = useLanguage();
  const mr = language === "mr";
  return <section className="civic-hero"><div className="editorial-container hero-layout">
    <div className="hero-copy"><p className="hero-location hero-party-affiliation">{mr ? "भारतीय जनता पार्टी • वॉर्ड २४(ड), नेरूळ" : "Bharatiya Janata Party • Ward 24(D), Nerul"}</p><h1><span className="hero-role">{mr ? "नगरसेवक" : "Corporator"}</span><span className="hero-name">{mr ? "सचिन देवप्पा लवटे" : "Sachin Devappa Lavate"}</span></h1><p className="hero-promise">{mr ? "जनतेशी नातं. विकासाशी बांधिलकी." : "Connected to people. Committed to development."}</p></div>
    <div className={`hero-photo ${image === "/photo.jpeg" ? "hero-portrait" : "hero-banner"}`}><Image src={image} alt={mr ? "नगरसेवक सचिन देवप्पा लवटे" : "Corporator Sachin Devappa Lavate"} fill priority unoptimized={image.startsWith("http")} sizes="(max-width: 767px) 100vw, 48vw" /></div>
    <div className="hero-actions"><Link href="/works" className="civic-button">{mr ? "विकासकामे पहा" : "Explore development works"}</Link><Link href="/complaints#register" className="civic-text-action">{mr ? "समस्या नोंदवा" : "Report an issue"} <span>→</span></Link></div>
  </div></section>;
}
