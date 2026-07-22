"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiList, FiBarChart2, FiFileText, FiImage, FiSettings } from "react-icons/fi";
import { useAdminAuth } from "./AdminShell";

const sectionTitles = [
  { path: "/admin/works", title: "Manage Works", icon: FiList },
  { path: "/admin/news", title: "Manage News", icon: FiFileText },
  { path: "/admin/gallery", title: "Manage Gallery", icon: FiImage },
  { path: "/admin/content", title: "Site Content", icon: FiSettings },
  { path: "/admin", title: "Dashboard Overview", icon: FiBarChart2 },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const { clearAdminKey } = useAdminAuth();

  const current = sectionTitles.find((item) => pathname.startsWith(item.path)) || sectionTitles[0];
  const Icon = current.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-100 text-orange-700">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-600">Admin control</p>
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{current.title}</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={clearAdminKey}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Sign out
        </button>
      </div>
      <nav className="mt-5 flex gap-2 overflow-x-auto border-t border-slate-100 pt-4 xl:hidden">
        {[["Dashboard", "/admin"], ["Works", "/admin/works"], ["News", "/admin/news"], ["Gallery", "/admin/gallery"], ["Content", "/admin/content"]].map(([label, href]) => <Link key={href} href={href} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${pathname === href ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"}`}>{label}</Link>)}
      </nav>
    </div>
  );
}
