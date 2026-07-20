"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const STORAGE_KEY = "admin-dashboard-key";

const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminShell");
  }
  return context;
}

export default function AdminShell({ children }) {
  const [adminKey, setAdminKey] = useState("");
  const [initialized, setInitialized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedKey = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : "";
    if (storedKey) {
      setAdminKey(storedKey);
    }
    setInitialized(true);
  }, []);

  const saveAdminKey = (key) => {
    sessionStorage.setItem(STORAGE_KEY, key);
    setAdminKey(key);
  };

  const clearAdminKey = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
  };

  if (!initialized) {
    return null;
  }

  if (!adminKey) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-lg rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-600">Administrator Access</p>
            <h1 className="mt-4 text-3xl font-black text-slate-900">Admin Dashboard Login</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter your admin dashboard key to access complaints, contact messages, and civic works management.
            </p>
          </div>

          <AdminKeyForm onSave={saveAdminKey} />

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-semibold">Note</p>
            <p className="mt-2">
              This dashboard uses a secure admin key. The key is stored only in your browser session and is never sent in plain text to the UI.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ adminKey, saveAdminKey, clearAdminKey, pathname }}>
      <div className="min-h-screen bg-slate-50">
        <div className="container-responsive mx-auto flex min-h-screen flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
          <AdminSidebar />
          <div className="flex-1 space-y-6">
            <AdminHeader />
            <main>{children}</main>
          </div>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}

function AdminKeyForm({ onSave }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      setError("Enter admin key first.");
      return;
    }
    setError("");
    onSave(value.trim());
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700">Admin dashboard key</label>
        <input
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter your admin key"
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="inline-flex w-full items-center justify-center rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
        Continue
      </button>
    </form>
  );
}
