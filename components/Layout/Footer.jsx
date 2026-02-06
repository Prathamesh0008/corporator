"use client";

import { useEffect, useState } from "react";
import { FiHome, FiPhone, FiMail, FiMapPin, FiClock, FiUsers } from "react-icons/fi";
import { GiIndiaGate } from "react-icons/gi";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCount = async () => {
      try {
        const visitKey = "site_visit_at";
        const now = Date.now();
        const ttlMs = 24 * 60 * 60 * 1000; // 1 day
        let shouldCount = true;

        try {
          const stored = localStorage.getItem(visitKey);
          if (stored && now - Number(stored) < ttlMs) {
            shouldCount = false;
          }
        } catch {
          // ignore localStorage errors
        }

        const res = await fetch("/api/visits", { method: shouldCount ? "POST" : "GET" });
        const data = await res.json();
        if (shouldCount) {
          try {
            localStorage.setItem(visitKey, String(now));
          } catch {
            // ignore localStorage errors
          }
        }
        if (isMounted) {
          setVisitCount(typeof data.count === "number" ? data.count : 0);
        }
      } catch {
        if (isMounted) {
          setVisitCount(0);
        }
      }
    };

    loadCount();
    return () => {
      isMounted = false;
    };
  }, []);
  
  const quickLinks = [
    { name: "nav.home", href: "/" },
    { name: "nav.about", href: "/about" },
    { name: "nav.works", href: "/works" },
    { name: "nav.services", href: "/services" },
    { name: "nav.complaints", href: "/complaints" },
    { name: "nav.gallery", href: "/gallery" },
    { name: "nav.contact", href: "/contact" }
  ];
  
  const governmentLinks = [
    { 
      name: language === "en" ? "NMMC Portal" : "NMMC पोर्टल", 
      href: "https://www.nmmc.gov.in" 
    },
    { 
      name: language === "en" ? "Maharashtra Government" : "महाराष्ट्र शासन", 
      href: "https://www.maharashtra.gov.in" 
    },
    { 
      name: language === "en" ? "BJP Maharashtra" : "भाजप महाराष्ट्र", 
      href: "https://www.bjpmaharashtra.org" 
    },
    { 
      name: language === "en" ? "Election Commission" : "निवडणूक आयोग", 
      href: "https://www.eci.gov.in" 
    }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-responsive px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Corporator Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-40 h-40 rounded-full">
                {/* <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center"> */}
                  <Image
                                      src="/logo-6.png"
                                      alt="Bharatiya Janata Party logo"
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                {/* </div> */}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  {language === "en" ? "Corporator Sachin Lavate" : "नगरसेवक सचिन लवटे"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {language === "en" ? "Ward 24(D), Nerul" : "वॉर्ड २४(ड), नेरूळ"}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              {language === "en" 
                ? "Elected Corporator of Navi Mumbai Municipal Corporation. Dedicated to the development of Ward 24(D) and welfare of citizens."
                : "नवी मुंबई महानगरपालिकेचे निवडून आलेले नगरसेवक. वॉर्ड २४(ड) च्या विकासासाठी आणि नागरिकांच्या कल्याणासाठी समर्पित."}
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6 border-l-4 border-orange-500 pl-3">
              {language === "en" ? "Quick Links" : "द्रुत दुवे"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <FiHome className="w-4 h-4" />
                    {t(link.name, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Government Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white border-l-4 border-green-500 pl-3">
              {language === "en" ? "Government Links" : "सरकारी दुवे"}
            </h4>
            <ul className="space-y-3">
              {governmentLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 border-l-4 border-blue-500 pl-3">
              {t("contact.title", language)}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-orange-500 mt-1" />
                <div>
                  <div className="font-medium">{t("contact.officeAddress", language)}</div>
                  <div className="text-gray-400 text-sm">
                    Ward Office 24(D),<br />
                    Navi Mumbai - 400706
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium">{t("contact.phoneNumbers", language)}</div>
                  <div className="text-gray-400 text-sm">
                    <div>Office: 022-12345678</div>
                    <div>Mobile: +91 98765 43210</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium">{t("contact.email", language)}</div>
                  <div className="text-gray-400 text-sm">
                    sachin.lavate@nmmc.gov.in
                  </div>
                </div>
              </div>
            </div>
            
            {/* Office Hours */}
        
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} {language === "en" ? "Corporator Sachin Lavate Office" : "नगरसेवक सचिन लवटे कार्यालय"}. 
            {language === "en" ? " All rights reserved." : " सर्व हक्क राखीव."}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white">
              {language === "en" ? "Privacy Policy" : "गोपनीयता धोरण"}
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white">
              {language === "en" ? "Terms of Use" : "वापराच्या अटी"}
            </a>
            <a href="/disclaimer" className="text-gray-400 hover:text-white">
              {language === "en" ? "Disclaimer" : "अस्वीकरण"}
            </a>
          </div>
          
          <div className="text-gray-400 text-sm flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span>❤</span>
              {language === "en" ? "Made for Ward 24(D) Citizens" : "वॉर्ड २४(ड) च्या नागरिकांसाठी बनवले"}
            </div>
            <span className="hidden md:inline text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span>👀</span>
              <span>
                {language === "en" ? "Visitors:" : "भेट देणारे:"} {visitCount === null ? "-" : visitCount}
              </span>
            </div>
          </div>
        </div>
        
        {/* Official Seals */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col items-center">
          <div className="grid w-full max-w-3xl grid-cols-3 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <Image
                  src="/nmmc.png"
                  alt="Navi Mumbai Municipal Corporation"
                  width={40}
                  height={40}
                  className="h-20 w-20 object-cover"
                />
              </div>
              <div className="text-xs text-gray-400 mt-2">Navi Mumbai Corporation</div>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                महाराष्ट्र
              </div>
              <div className="text-xs text-gray-400 mt-2">Maharashtra Government</div>
            </div>
            <div className="text-center">
              <div className="mx-auto h-13 w-13 rounded-full bg-white p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Bharatiya Janata Party"
                  width={40}
                  height={40}
                  className="h-15 w-15 object-cover"
                />
              </div>
              <div className="text-xs text-gray-400 mt-2">Bharatiya Janata Party</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm text-center max-w-2xl mt-5">
              {language === "en" 
                ? "An official website of Corporator Sachin Devappa Lavate, Ward 24(D), Navi Mumbai Municipal Corporation. This website is for public service and information purposes."
                : "नगरसेवक सचिन देवाप्पा लवटे, वॉर्ड २४(ड), नेरूळ सेक्टर १८, नवी मुंबई महानगरपालिका यांची अधिकृत वेबसाइट. ही वेबसाइट सार्वजनिक सेवा आणि माहितीच्या हेतूने आहे."}
          </p>
        </div>
      </div>
    </footer>
  );
}


