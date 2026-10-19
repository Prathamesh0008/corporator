"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAdminAuth } from "./AdminShell";
export const adminNavigation = [
  ["Overview", "/ward-control"],
  ["Complaints", "/ward-control/complaints"],
  ["Development Works", "/ward-control/works"],
  ["Gallery", "/ward-control/gallery"],
  ["News & Updates", "/ward-control/news"],
  ["Contact Messages", "/ward-control/messages"],
  ["Website Content", "/ward-control/content"],
];
export default function AdminSidebar() {
  const { pathname, clearAdminKey, sidebarOpen, setSidebarOpen } =
    useAdminAuth();
  const ref = useRef(null);
  useEffect(() => {
    if (!sidebarOpen) return;
    const old = document.activeElement,
      sidebar = ref.current;
    sidebar.querySelector("button")?.focus();
    const key = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
      if (event.key === "Tab") {
        const nodes = [...sidebar.querySelectorAll("button,a[href]")].filter(
          (node) => node.getClientRects().length,
        );
        if (event.shiftKey && document.activeElement === nodes[0]) {
          event.preventDefault();
          nodes.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === nodes.at(-1)) {
          event.preventDefault();
          nodes[0]?.focus();
        }
      }
    };
    sidebar.addEventListener("keydown", key);
    return () => {
      sidebar.removeEventListener("keydown", key);
      old?.focus();
    };
  }, [sidebarOpen, setSidebarOpen]);
  return (
    <>
      {sidebarOpen && (
        <div
          className="admin-sidebar-scrim"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        ref={ref}
        id="admin-navigation"
        className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}
      >
        <div className="admin-mobile-toggle">
          <button type="button" onClick={() => setSidebarOpen(false)}>
            Close navigation
          </button>
        </div>
        <div>
          <strong>Ward Administration</strong>
          <small>Sachin Lavate · Ward 24(D)</small>
        </div>
        <nav aria-label="Admin navigation">
          {adminNavigation.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setSidebarOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={clearAdminKey}>
          Logout
        </button>
      </aside>
    </>
  );
}
