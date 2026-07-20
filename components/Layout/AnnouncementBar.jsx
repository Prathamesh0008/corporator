"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { announcementContent } from "../../data/siteContent";

export default function AnnouncementBar() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!announcementContent.enabled) return;
    const dismissed = window.localStorage.getItem("announcement-dismissed");
    setVisible(dismissed !== "true");
  }, []);

  if (!announcementContent.enabled || !visible) return null;

  const copy = language === "mr" ? announcementContent.mr : announcementContent.en;

  return (
    <div className="border-b border-white/20 bg-[#082f49] px-4 py-2 text-white">
      <div className="container-responsive flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
          <span>{copy.text}</span>
          {copy.link ? (
            <Link href={copy.link} className="font-semibold text-orange-300 underline-offset-2 hover:underline">
              {copy.linkText}
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem("announcement-dismissed", "true");
            setVisible(false);
          }}
          className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss announcement"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
