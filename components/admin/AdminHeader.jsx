"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiList, FiBarChart2, FiFileText, FiImage, FiSettings } from "react-icons/fi";
import { useAdminAuth } from "./AdminShell";

const sectionTitles = [
  { path: "/ward-control/works", title: "Manage Works", icon: FiList },
  { path: "/ward-control/news", title: "Manage News", icon: FiFileText },
  { path: "/ward-control/gallery", title: "Manage Gallery", icon: FiImage },
  { path: "/ward-control/content", title: "Site Content", icon: FiSettings },
  { path: "/ward-control", title: "Dashboard Overview", icon: FiBarChart2 },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const { clearAdminKey } = useAdminAuth();

  const current = sectionTitles.find((item) => pathname.startsWith(item.path)) || sectionTitles[0];
  const Icon = current.icon;

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center bg-[#1f5a7a] text-white">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b96820]">Admin control</p>
            <h1 className="text-xl font-black text-slate-900 sm:text-2xl">{current.title}</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={clearAdminKey}
          className="inline-flex items-center justify-center border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 xl:hidden"
        >
          Sign out
        </button>
      </div>
      <nav className="mt-5 flex gap-2 overflow-x-auto border-t border-slate-100 pt-4 xl:hidden">
        {[["Dashboard", "/ward-control"], ["Works", "/ward-control/works"], ["News", "/ward-control/news"], ["Gallery", "/ward-control/gallery"], ["Content", "/ward-control/content"]].map(([label, href]) => <Link key={href} href={href} className={`shrink-0 border-b-2 px-3 py-2 text-xs font-bold ${pathname === href ? "border-orange-600 text-orange-700" : "border-transparent text-slate-500"}`}>{label}</Link>)}
      </nav>
    </header>
  );
}
