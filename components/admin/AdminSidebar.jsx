"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiList, FiFileText, FiImage, FiSettings, FiLogOut } from "react-icons/fi";
import { useAdminAuth } from "./AdminShell";

const navItems = [
  { label: "Dashboard", href: "/ward-control", icon: FiBarChart2 },
  { label: "Manage Works", href: "/ward-control/works", icon: FiList },
  { label: "Manage News", href: "/ward-control/news", icon: FiFileText },
  { label: "Manage Gallery", href: "/ward-control/gallery", icon: FiImage },
  { label: "Site Content", href: "/ward-control/content", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { clearAdminKey } = useAdminAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#29465d] bg-[#163247] p-5 xl:sticky xl:top-0 xl:block xl:h-screen">
      <div className="mb-6 flex items-center gap-3 border-b border-[#365368] pb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#e58a35] text-white">
          <FiBarChart2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f0a65f]">Ward Admin</p>
          <h2 className="mt-1 text-base font-black text-white">Content Management</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/ward-control" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-semibold text-white transition ${isActive ? "border-[#f0a65f] bg-[#24445b]" : "border-transparent hover:bg-[#1e3c52]"}`}
            >
              <span className={`flex h-9 w-9 items-center justify-center ${isActive ? "text-[#f0a65f]" : "text-white"}`}>
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
        className="mt-6 flex w-full items-center justify-center gap-2 border border-[#486276] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24445b]"
      >
        <FiLogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}
