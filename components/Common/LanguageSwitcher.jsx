"use client";

import { useLanguage } from "../../contexts/LanguageContext";

export default function LanguageSwitcher({ mobile = false }) {
  const { language, toggleLanguage } = useLanguage();
  const isEnglish = language === "en";
  const labelClass = mobile ? "text-base font-bold" : "text-sm font-semibold";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={isEnglish ? "Switch to Marathi" : "Switch to English"}
      className={`flex items-center gap-2 ${
        mobile
          ? "w-full justify-center px-4 py-3 border border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50"
          : "px-3 py-1.5 border border-orange-500 text-orange-600 rounded-full text-xs font-semibold hover:bg-orange-50 transition-colors"
      }`}
    >
      <span className={labelClass}>
        {isEnglish ? "मराठी" : "English"}
      </span>
      <span className={`text-lg ${mobile ? "" : "hidden sm:inline"}`}>
        {isEnglish ? "🇮🇳" : "🇬🇧"}
      </span>
    </button>
  );
}
