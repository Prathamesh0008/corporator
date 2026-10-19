"use client";
import { useAdminAuth } from "./AdminShell";
import { adminNavigation } from "./AdminSidebar";
export default function AdminHeader() {
  const { pathname, clearAdminKey, sidebarOpen, setSidebarOpen } =
    useAdminAuth();
  return (
    <header className="admin-header">
      <div className="admin-actions">
        <div className="admin-mobile-toggle">
          <button
            type="button"
            aria-expanded={sidebarOpen}
            aria-controls="admin-navigation"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close navigation" : "Open navigation"}
          </button>
        </div>
        <div>
          <h1>
            {adminNavigation.find(([, href]) => pathname === href)?.[0] ||
              "Administration"}
          </h1>
          <small>Private content management</small>
        </div>
      </div>
      <button type="button" onClick={clearAdminKey}>
        Sign out
      </button>
    </header>
  );
}
