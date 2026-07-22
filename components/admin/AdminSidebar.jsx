"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiList, FiFileText, FiImage, FiSettings, FiLogOut } from "react-icons/fi";
import { useAdminAuth } from "./AdminShell";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FiBarChart2 },
  { label: "Manage Works", href: "/admin/works", icon: FiList },
  { label: "Manage News", href: "/admin/news", icon: FiFileText },
  { label: "Manage Gallery", href: "/admin/gallery", icon: FiImage },
  { label: "Site Content", href: "/admin/content", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { clearAdminKey } = useAdminAuth();

  return (
    <aside className="hidden w-64 shrink-0 self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 xl:block">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <FiBarChart2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">Ward Admin</p>
          <h2 className="mt-1 text-base font-black text-slate-900">Content Management</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-700"}`}>
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={clearAdminKey}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        <FiLogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}
