"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiHome, FiUser, FiCheckCircle, FiImage, FiSettings, FiAlertCircle, FiPhone, FiClock, FiPhoneCall } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";
import LanguageSwitcher from "../Common/LanguageSwitcher";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    ? "Corporator Sachin Lavate | Ward 24(D) | Nerul Sector 18"
    : "नगरसेवक सचिन लवटे | वॉर्ड २४(ड) | नेरूळ सेक्टर १८";
  const officeHours = isEnglish
    ? "Office Hours: 24/7"
    : "कार्यालय वेळ: २४/७";
  const helpline = isEnglish
    ? "Helpline: 022-12345678"
    : "हेल्पलाइन: ०२२-१२३४५६७८";
  const brandTitle = isEnglish ? "Corporator Sachin Lavate" : "नगरसेवक सचिन लवटे";
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] text-gray-800 py-1.5 px-4 border-b border-black/5">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-semibold tracking-wide">{topBarTitle}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4 text-gray-700" />
                <span>{officeHours}</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <FiPhoneCall className="w-4 h-4 text-gray-700" />
                <span>{helpline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md bg-white/90 backdrop-blur border-b border-gray-200" : "bg-white"
      }`}>
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 p-1">
                  <Image
                    src="/logo.png"
                    alt="Bharatiya Janata Party logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block">
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
