"use client";

import { useLanguage } from "../../contexts/LanguageContext";

export default function LanguageSwitcher({ mobile = false }) {
  const { language, toggleLanguage } = useLanguage();
  const marathi = language === "mr";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={marathi ? "Switch to English" : "मराठी भाषेत बदला"}
      title={marathi ? "Switch to English" : "मराठी भाषेत बदला"}
      className={`group inline-grid grid-cols-2 items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-bold shadow-sm transition hover:border-orange-300 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 ${mobile ? "w-full" : "w-[104px]"}`}
    >
      <span className={`flex h-8 items-center justify-center rounded-full px-2 transition-all duration-200 ${marathi ? "bg-orange-600 text-white shadow-sm" : "text-slate-500 group-hover:text-slate-700"}`}>मराठी</span>
      <span className={`flex h-8 items-center justify-center rounded-full px-2 transition-all duration-200 ${!marathi ? "bg-orange-600 text-white shadow-sm" : "text-slate-500 group-hover:text-slate-700"}`}>EN</span>
    </button>
  );
}
