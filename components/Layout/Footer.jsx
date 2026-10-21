"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";
export default function Footer() {
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const mr = language === "mr";
  if (pathname.startsWith("/ward-control")) return null;
  const links = [["About", "परिचय", "/about"], ["Development Works", "विकासकामे", "/works"], ["News", "बातम्या", "/news"], ["Gallery", "गॅलरी", "/gallery"], ["Citizen Help", "नागरिक सहाय्य", "/complaints"], ["Contact", "संपर्क", "/contact"]];
  return <footer className="civic-footer"><div className="editorial-container"><div className="footer-layout"><div><Link href="/" className="footer-name"><Image src="/lotus.webp" alt="BJP Lotus" width={40} height={40} sizes="40px" /><span><strong>{mr ? "सचिन देवप्पा लवटे" : "Sachin Devappa Lavate"}</strong><span className="footer-brand-subtitle">{mr ? "नगरसेवक • वॉर्ड २४ • भारतीय जनता पार्टी" : "Corporator • Ward 24(D) • BJP"}</span></span></Link><a className="footer-instagram" href="https://www.instagram.com/samajsevaksachinlavate/" target="_blank" rel="noreferrer"><FaInstagram /> Instagram ↗</a></div><nav aria-label={mr ? "उपयुक्त दुवे" : "Footer navigation"}>{links.map(([en, marathi, href]) => <Link href={href} key={href}>{mr ? marathi : en}</Link>)}</nav><div className="footer-more"><Link href="/services">{mr ? "वॉर्ड सेवा" : "Ward services"} →</Link><Link href="/nation-first">{mr ? "राष्ट्र प्रथम" : "Nation First"} →</Link><Link href="/nantar-paksha">{mr ? "नंतर पक्ष" : "Party Next"} →</Link></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} {mr ? "सचिन लवटे • वॉर्ड २४, नेरूळ" : "Sachin Lavate • Ward 24(D), Nerul"}</p><div className="footer-language-control" role="group" aria-label="Language"><button type="button" lang="mr" aria-pressed={mr} onClick={() => { if (!mr) toggleLanguage(); }}>मराठी</button><span aria-hidden="true">|</span><button type="button" lang="en" aria-pressed={!mr} onClick={() => { if (mr) toggleLanguage(); }}>EN</button></div><div>{[["Privacy", "गोपनीयता", "/privacy"], ["Terms", "अटी", "/terms"], ["Disclaimer", "अस्वीकरण", "/disclaimer"]].map(([en, marathi, href]) => <Link href={href} key={href}>{mr ? marathi : en}</Link>)}</div></div></div></footer>;
}
