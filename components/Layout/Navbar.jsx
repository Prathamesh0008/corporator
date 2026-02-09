"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiHome, FiUser, FiCheckCircle, FiImage, FiSettings, FiAlertCircle, FiPhone, FiClock, FiPhoneCall } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";
import LanguageSwitcher from "../Common/LanguageSwitcher";
import Image from "next/image";

export default function Navbar() {
  const logoRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introMove, setIntroMove] = useState(false);
  const [introDelta, setIntroDelta] = useState({ x: 0, y: 0 });
  const pathname = usePathname();
  const { language } = useLanguage();
  const isEnglish = language === "en";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const computeDelta = () => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setIntroDelta({ x: targetX - centerX, y: targetY - centerY });
    };

    computeDelta();
    const raf = requestAnimationFrame(() => setIntroMove(true));
    const timer = setTimeout(() => setShowIntro(false), 1600);

    window.addEventListener("resize", computeDelta);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", computeDelta);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const navItems = [
    { name: "nav.home", path: "/", icon: <FiHome className="w-4 h-4" /> },
    { name: "nav.about", path: "/about", icon: <FiUser className="w-4 h-4" /> },
    { name: "nav.works", path: "/works", icon: <FiCheckCircle className="w-4 h-4" /> },
    { name: "nav.gallery", path: "/gallery", icon: <FiImage className="w-4 h-4" /> },
    { name: "nav.services", path: "/services", icon: <FiSettings className="w-4 h-4" /> },
    { name: "nav.complaints", path: "/complaints", icon: <FiAlertCircle className="w-4 h-4" /> },
    { name: "nav.contact", path: "/contact", icon: <FiPhone className="w-4 h-4" /> },
  ];

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const topBarTitle = isEnglish
    ? "Corporator Sachin Lavate | Ward 24(D) "
    : "नगरसेवक सचिन लवटे | वॉर्ड २४(ड)";
  const officeHours = isEnglish
    ? "Office Hours: 24/7"
    : "कार्यालय वेळ: २४/७";
  const helpline = isEnglish
    ? "Helpline: 022-12345678"
    : "हेल्पलाइन: ०२२-१२३४५६७८";
const brandTitle = isEnglish ? (
  <>Corporator <br /> Sachin D. Lavate</>
) : (
  <>नगरसेवक <br /> सचिन लवटे</>
);

  return (
    <>
      {showIntro && (
        <div className="fixed inset-0 z-[60] bg-white flex items-center justify-center pointer-events-none">
          <div
            className={`intro-logo ${introMove ? "intro-logo--move" : ""}`}
            style={{
              "--intro-x": `${introDelta.x}px`,
              "--intro-y": `${introDelta.y}px`,
            }}
          >
            <div className="flex items-center gap-4 px-6 py-4  rounded-2xl shadow-2xl  ">
              <div className="w-35 h-35 rounded-full bg-white shadow-md border  p-3">
                <Image
                  src="/logo-6.png"
                  alt="Bharatiya Janata Party logo"
                  width={150}
                  height={150}
                  priority
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-black">
                  {isEnglish ? "Corporator Sachin Lavate" : "नगरसेवक सचिन लवटे"}
                </div>
                <div className="text-sm text-black/90">
                  {isEnglish ? "Ward 24(D), Nerul Sector 18" : "वॉर्ड २४(ड), नेरूळ सेक्टर १८"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .intro-logo {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(1.1);
          transition: transform 1.2s ease-in-out;
        }
        .intro-logo--move {
          transform: translate(calc(-50% + var(--intro-x)), calc(-50% + var(--intro-y))) scale(0.55);
        }
      `}</style>

      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] text-gray-800 py-1.5 px-4 border-b border-black/5">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-semibold tracking-wide">{topBarTitle}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-700 hover:text-[#1877F2] transition"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="https://www.instagram.com/samajsevaksachinlavate?igsh=MTM4cnc4anFhMWxoMQ=="
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-700 hover:text-[#E4405F] transition"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </Link>
              <Link
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-gray-700 hover:text-black transition"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-2000 transition-all duration-300 ${
        isScrolled ? "shadow-md bg-white/90 backdrop-blur border-b border-gray-200" : "bg-white"
      }`}>
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">

            {/* Logo */}
            <div className="flex items-center gap-2" ref={logoRef}>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-full ">
                  <Image
                    src="/logo-6.png"
                    alt="Bharatiya Janata Party logo"
                    width={56}
                    height={56}
                    sizes="56px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="">
                  <h1 className="font-semibold text-base text-gray-900 leading-tight">
                    {brandTitle}
                  </h1>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`px-2.5 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex items-center gap-2 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    isActive(item.path)
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-700 hover:text-orange-600 hover:border-orange-300"
                  }`}
                >
                  {item.icon}
                  <span>{t(item.name, language)}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                type="button"
                aria-label="Search (coming soon)"
                title="Search (coming soon)"
                className="hidden md:flex p-1.5 hover:bg-gray-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <FiSearch className="w-4 h-4 text-gray-600" />
              </button>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-expanded={isMenuOpen}
                aria-controls="primary-navigation"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="primary-navigation" className="lg:hidden bg-white border-t shadow-inner">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{t(item.name, language)}</span>
                </Link>
              ))}

              {/* Language Switcher Mobile */}
              <div className="px-4 pt-4">
                <LanguageSwitcher mobile />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
