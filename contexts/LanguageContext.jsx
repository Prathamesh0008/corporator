"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(undefined);

// Admin-only preview scope. Does not change public language state or localStorage.
export function PreviewLanguageProvider({ language, children }) {
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage: () => {} }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageProvider({ children }) {
  // Match the server's initial render, then restore the existing saved preference.
  const [language, setLanguage] = useState("mr");
  useEffect(() => {
    const savedLang = localStorage.getItem("site-language");
    if (savedLang === "mr" || savedLang === "en") {
      queueMicrotask(() => setLanguage(savedLang));
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "mr" : "en";
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("site-language", newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
