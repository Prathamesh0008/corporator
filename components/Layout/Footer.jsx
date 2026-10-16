"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";
export default function Footer() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const mr = language === "mr";
  if (pathname.startsWith("/ward-control")) return null;
  const links = [["About", "परिचय", "/about"], ["Development Works", "विकासकामे", "/works"], ["News", "बातम्या", "/news"], ["Gallery", "गॅलरी", "/gallery"], ["Citizen Help", "नागरिक सहाय्य", "/complaints"], ["Contact", "संपर्क", "/contact"]];
  return <footer className="civic-footer"><div className="editorial-container"><div className="footer-layout"><div><Link href="/" className="footer-name">{mr ? "सचिन देवप्पा लवटे" : "Sachin Devappa Lavate"}</Link><p>{mr ? "नगरसेवक • वॉर्ड २४(ड)" : "Corporator • Ward 24(D)"}</p><p>{mr ? "नेरूळ, नवी मुंबई" : "Nerul, Navi Mumbai"}</p><a className="footer-instagram" href="https://www.instagram.com/samajsevaksachinlavate/" target="_blank" rel="noreferrer"><FaInstagram /> Instagram ↗</a></div><nav aria-label={mr ? "उपयुक्त दुवे" : "Footer navigation"}>{links.map(([en, marathi, href]) => <Link href={href} key={href}>{mr ? marathi : en}</Link>)}</nav><div className="footer-more"><Link href="/services">{mr ? "वॉर्ड सेवा" : "Ward services"} →</Link><Link href="/nation-first">{mr ? "राष्ट्र प्रथम" : "Nation First"} →</Link><Link href="/nantar-paksha">{mr ? "नंतर पक्ष" : "Party Next"} →</Link></div></div><div className="footer-party-affiliation"><Image src="/lotus.webp" alt="BJP Lotus" width={30} height={30} sizes="30px" /><div><p>{mr ? "\u092d\u093e\u0930\u0924\u0940\u092f \u091c\u0928\u0924\u093e \u092a\u093e\u0930\u094d\u091f\u0940" : "Bharatiya Janata Party"}</p><p>{mr ? "\u0935\u0949\u0930\u094d\u0921 \u0968\u096a(\u0921), \u0928\u0947\u0930\u0942\u0933, \u0928\u0935\u0940 \u092e\u0941\u0902\u092c\u0908" : "Ward 24(D), Nerul, Navi Mumbai"}</p></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} {mr ? "सचिन लवटे • वॉर्ड २४(ड), नेरूळ" : "Sachin Lavate • Ward 24(D), Nerul"}</p><div>{[["Privacy", "गोपनीयता", "/privacy"], ["Terms", "अटी", "/terms"], ["Disclaimer", "अस्वीकरण", "/disclaimer"]].map(([en, marathi, href]) => <Link href={href} key={href}>{mr ? marathi : en}</Link>)}</div></div></div></footer>;
}
