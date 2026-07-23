```jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiAlertCircle, FiChevronDown } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";
import LanguageSwitcher from "../Common/LanguageSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [journeyDismissed, setJourneyDismissed] = useState(false);

  const pathname = usePathname();
  const { language } = useLanguage();

  const mr = language === "mr";

  const links = [
    ["nav.home", "/"],
    ["nav.works", "/works"],
    ["nav.services", "/services"],
    ["nav.news", "/news"],
    ["nav.gallery", "/gallery"],
    ["nav.contact", "/contact"],
  ];

  const journey = [
    ["/nation-first", mr ? "राष्ट्र प्रथम" : "Nation First"],
    ["/nantar-paksha", mr ? "नंतर पक्ष" : "Party Next"],
    ["/about", mr ? "शेवटी स्वतः" : "Self Last"],
  ];

  const active = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const journeyActive = journey.some(([path]) => active(path));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  if (pathname.startsWith("/ward-control")) return null;

  return (
    <>
      <nav
        className={`sticky top-0 z-[100] border-b bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,.08)]"
            : "border-slate-100"
        }`}
        aria-label="Primary navigation"
      >
        <div className="container-responsive flex h-[76px] items-center justify-between gap-2 px-3 sm:h-[88px] sm:gap-4 sm:px-6 lg:px-8">
          
          {/* LOGO / NAME */}
          <Link
            href="/"
            className="group flex min-w-0 shrink items-center gap-2 sm:shrink-0 sm:gap-3"
            aria-label="Sachin Lavate home"
          >
            <span className="shrink-0 whitespace-nowrap leading-tight">
              <strong className="block whitespace-nowrap text-[14px] font-black tracking-tight text-slate-900 transition group-hover:text-orange-700 sm:text-[19px]">
                {mr ? "सचिन देवप्पा लवटे" : "Sachin D. Lavate"}
              </strong>

              <span className="mt-1.5 hidden text-[9px] font-bold uppercase min-[380px]:block tracking-[.13em] text-orange-600 sm:text-[10px] sm:tracking-[.18em]">
                {mr
                  ? "नगरसेवक • वॉर्ड २४(ड)"
                  : "Corporator • Ward 24(D)"}
              </span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden h-full items-center xl:flex">
            {links.map(([key, path], index) => (
              <div key={path} className="contents">
                <Link
                  href={path}
                  className={`relative flex h-full items-center px-3 text-[13px] font-semibold transition ${
                    active(path)
                      ? "text-orange-600 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-orange-500"
                      : "text-slate-600 hover:text-orange-600"
                  }`}
                >
                  {t(key, language)}
                </Link>

                {/* ABOUT DROPDOWN */}
                {index === 0 && (
                  <div
                    className="group relative flex h-full items-center"
                    onMouseEnter={() => setJourneyDismissed(false)}
                  >
                    <button
                      type="button"
                      className={`flex h-full items-center gap-1.5 px-3 text-[13px] font-semibold transition ${
                        journeyActive
                          ? "text-orange-600"
                          : "text-slate-600 hover:text-orange-600"
                      }`}
                    >
                      {t("nav.about", language)}

                      <FiChevronDown className="transition duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                    </button>

                    {!journeyDismissed && (
                      <div className="invisible absolute left-0 top-[calc(100%-4px)] w-56 translate-y-2 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(15,23,42,.14)] transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        
                        {journey.map(
                          ([href, label], itemIndex) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() =>
                                setJourneyDismissed(true)
                              }
                              className={`group/item flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition hover:bg-orange-50 hover:text-orange-700 ${
                                active(href)
                                  ? "bg-orange-50 text-orange-700"
                                  : "text-slate-700"
                              }`}
                            >
                              <span
                                className={`h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] transition group-hover/item:rotate-[135deg] ${
                                  itemIndex === 0
                                    ? "bg-orange-500"
                                    : itemIndex === 1
                                    ? "bg-[#082f49]"
                                    : "bg-green-600"
                                }`}
                              />

                              {label}
                            </Link>
                          )
                        )}

                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            <LanguageSwitcher />

            {/* COMPLAINT BUTTON */}
            <Link
              href="/complaints#register"
              className="hidden min-h-11 items-center gap-2 rounded-full bg-orange-600 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-md 2xl:inline-flex"
            >
              <FiAlertCircle />

              {mr ? "तक्रार" : "Complaint"}
            </Link>

            {/* ============================= */}
            {/* ANIMATED MOBILE HAMBURGER */}
            {/* ============================= */}

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="
                relative
                flex
                h-11
                w-11
                flex-col
                items-center
                justify-center
                rounded-lg
                text-slate-700
                transition
                hover:bg-slate-100
                xl:hidden
              "
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={
                open
                  ? "Close navigation"
                  : "Open navigation"
              }
            >

              {/* TOP LINE */}
              <span
                className={`
                  block
                  h-0.5
                  w-6
                  rounded
                  bg-slate-700
                  transition-all
                  duration-300

                  ${
                    open
                      ? "rotate-45 translate-y-1.5"
                      : ""
                  }
                `}
              />

              {/* MIDDLE LINE */}
              <span
                className={`
                  my-1
                  block
                  h-0.5
                  w-6
                  rounded
                  bg-slate-700
                  transition-all
                  duration-300

                  ${
                    open
                      ? "opacity-0"
                      : "opacity-100"
                  }
                `}
              />

              {/* BOTTOM LINE */}
              <span
                className={`
                  block
                  h-0.5
                  w-6
                  rounded
                  bg-slate-700
                  transition-all
                  duration-300

                  ${
                    open
                      ? "-rotate-45 -translate-y-1.5"
                      : ""
                  }
                `}
              />

            </button>

          </div>
        </div>

        {/* ============================= */}
        {/* MOBILE NAVIGATION */}
        {/* ============================= */}

        <div
          id="mobile-navigation"
          className={`
            absolute
            inset-x-0
            top-full
            border-t
            border-slate-100
            bg-white
            shadow-2xl
            xl:hidden

            transition-all
            duration-300
            ease-out

            ${
              open
                ? "max-h-[calc(100vh-104px)] opacity-100 overflow-y-auto"
                : "max-h-0 opacity-0 overflow-hidden"
            }
          `}
        >
          <div className="p-4">
            <div className="container-responsive space-y-1">

              {links.map(([key, path], index) => (
                <div key={path}>

                  <Link
                    href={path}
                    className={`flex min-h-12 items-center rounded-lg px-4 font-bold ${
                      active(path)
                        ? "bg-orange-50 text-orange-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t(key, language)}
                  </Link>

                  {/* MOBILE ABOUT DROPDOWN */}
                  {index === 0 && (
                    <details className="group">

                      <summary className="flex min-h-12 cursor-pointer list-none items-center rounded-lg px-4 font-bold text-slate-700 hover:bg-slate-50">
                        
                        {t("nav.about", language)}

                        <FiChevronDown className="ml-auto transition group-open:rotate-180" />

                      </summary>

                      <div className="ml-4 border-l border-orange-200 pl-3">

                        {journey.map(
                          ([href, label], itemIndex) => (
                            <Link
                              key={href}
                              href={href}
                              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                            >

                              <span
                                className={`h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] ${
                                  itemIndex === 0
                                    ? "bg-orange-500"
                                    : itemIndex === 1
                                    ? "bg-[#082f49]"
                                    : "bg-green-600"
                                }`}
                              />

                              {label}

                            </Link>
                          )
                        )}

                      </div>

                    </details>
                  )}

                </div>
              ))}

              {/* MOBILE COMPLAINT BUTTON */}
              <Link
                href="/complaints#register"
                className="complaint-cta mt-3 w-full justify-center"
              >
                <FiAlertCircle />

                {mr
                  ? "तक्रार नोंदवा"
                  : "Register Complaint"}
              </Link>

            </div>
          </div>
        </div>

      </nav>
    </>
  );
}
```
