"use client";

import { usePathname } from "next/navigation";
import { FiHome, FiList, FiMail, FiBarChart2, FiPlusCircle } from "react-icons/fi";
import { useAdminAuth } from "./AdminShell";

const sectionTitles = [
  { path: "/admin/works/new", title: "Add New Work", icon: FiPlusCircle },
  { path: "/admin/works/", title: "Manage Works", icon: FiList },
  { path: "/admin/works", title: "Manage Works", icon: FiList },
  { path: "/admin", title: "Dashboard Overview", icon: FiBarChart2 },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const { clearAdminKey } = useAdminAuth();

  const current = sectionTitles.find((item) => pathname.startsWith(item.path)) || sectionTitles[0];
  const Icon = current.icon;

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-100 text-orange-700">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-600">Admin control</p>
            <h1 className="text-3xl font-black text-slate-900">{current.title}</h1>
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
    </div>
  );
}
