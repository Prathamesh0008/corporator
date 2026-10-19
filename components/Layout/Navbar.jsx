"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();
  const { language } = useLanguage();
  const mr = language === "mr";
  const menuButton = useRef(null);
  const links = [
    ["Home", "मुख्यपृष्ठ", "/"],
    ["Report Issue", "समस्या नोंदवा", "/complaints#register"],
    ["Track Complaint", "तक्रार तपासा", "/complaints#track"],
    ["Resolved Works", "पूर्ण झालेली कामे", "/works"],
    ["About", "परिचय", "/about"],
    ["Contact", "संपर्क", "/contact"],
  ];
  useEffect(() => { queueMicrotask(() => setOpen(false)); }, [pathname]);
  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash);
    queueMicrotask(updateHash);
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);
    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = event => { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", escape); };
  }, [open]);
  if (pathname.startsWith("/ward-control")) return null;
  const active = href => {
    const [path, hash] = href.split("#");
    if (hash) return pathname === path && (activeHash || "#register") === `#${hash}`;
    return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
  };
  const navigation = links.map(([en, marathi, href]) => <Link key={href} href={href} onNavigate={() => { if (href === "/about" && pathname === "/about") requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })); }} onClick={() => { setOpen(false); setActiveHash(href.includes("#") ? `#${href.split("#")[1]}` : ""); }} aria-current={active(href) ? (href.includes("#") ? "location" : "page") : undefined}>{mr ? marathi : en}</Link>);
  return <nav className="civic-nav" aria-label={mr ? "मुख्य नेव्हिगेशन" : "Primary navigation"}><div className="editorial-container nav-layout">
    <Link href="/" className="civic-brand">
      <Image src="/lotus.webp" alt="BJP Lotus" width={40} height={40} sizes="(max-width: 767px) 32px, 40px" className="civic-brand-lotus" />
      <span className="civic-brand-copy">
        <strong><span className="civic-brand-full-name">{mr ? "सचिन देवप्पा लवटे" : "Sachin Lavate"}</span><span className="civic-brand-short-name">{mr ? "सचिन लवटे" : "Sachin Lavate"}</span></strong>
        <span className="civic-brand-subtitle"><span className="brand-affiliation-full">{mr ? "नगरसेवक • वॉर्ड २४(ड) • भारतीय जनता पार्टी" : "Corporator • Ward 24(D) • BJP"}</span><span className="brand-affiliation-short">{mr ? "वॉर्ड २४(ड) • भाजपा" : "Ward 24(D) • BJP"}</span></span>
      </span>
    </Link>
    <div className="desktop-navigation">{navigation}</div>
    <div className="nav-controls"><button ref={menuButton} className="menu-control" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? (mr ? "मेनू बंद करा" : "Close menu") : (mr ? "मेनू उघडा" : "Open menu")}>{open ? "×" : "☰"}</button></div>
    <div id="mobile-navigation" className="mobile-navigation" hidden={!open}>{navigation}</div>
  </div></nav>;
}
