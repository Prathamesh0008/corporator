"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!phone || pathname.startsWith("/ward-control")) return null;
  const message = language === "mr" ? "नमस्कार, मला नगरसेवक सचिन लवटे यांच्या कार्यालयाकडून मदत हवी आहे." : "Hello, I need help from Corporator Sachin Lavate’s office.";
  return <a href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" aria-label="Contact office on WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl transition hover:-translate-y-1 hover:scale-105 hover:bg-green-700 focus-visible:ring-4 focus-visible:ring-green-300"><FaWhatsapp className="h-8 w-8" /></a>;
}
