"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiAlertCircle, FiMail, FiList, FiPlusCircle, FiLogOut } from "react-icons/fi";
import { useAdminAuth } from "./AdminShell";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FiBarChart2 },
  { label: "Complaints", href: "/admin", icon: FiAlertCircle },
  { label: "Contact Messages", href: "/admin", icon: FiMail },
  { label: "Manage Works", href: "/admin/works", icon: FiList },
  { label: "Add New Work", href: "/admin/works/new", icon: FiPlusCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { clearAdminKey } = useAdminAuth();

  return (
    <aside className="hidden w-72 shrink-0 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:block">
      <div className="mb-10 space-y-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-100 text-orange-700">
          <FiBarChart2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Ward Admin</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Content Management</h2>
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
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
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
        className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        <FiLogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}
