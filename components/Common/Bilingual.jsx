"use client";
import { useLanguage } from "../../contexts/LanguageContext";
export default function Bilingual({ en, mr }) { const { language } = useLanguage(); return language === "mr" ? (mr || en) : en; }
