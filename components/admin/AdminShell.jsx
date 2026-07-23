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
    if (!storedKey) {
      queueMicrotask(() => setInitialized(true));
      return;
    }

    fetch("/api/admin/auth", {
      method: "POST",
      headers: { "x-admin-key": storedKey },
    })
      .then((response) => {
        if (response.ok) {
          setAdminKey(storedKey);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      })
      .finally(() => setInitialized(true));
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
      <div className="min-h-screen bg-white px-5 py-14 sm:py-20">
        <main className="mx-auto max-w-xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b96820]">Administrator Access</p>
            <h1 className="mt-4 text-3xl font-black text-[#163247]">Admin Dashboard Login</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter your admin dashboard key to access complaints, contact messages, and civic works management.
            </p>
          </div>

          <AdminKeyForm onSave={saveAdminKey} />

          <p className="mt-8 border-t border-slate-200 pt-5 text-center text-xs leading-5 text-slate-500">
            Your admin key is kept only for the current browser session.
          </p>
        </main>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ adminKey, saveAdminKey, clearAdminKey, pathname }}>
      <div className="admin-ui min-h-screen bg-[#eef2f6]">
        <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col xl:flex-row">
          <AdminSidebar />
          <div className="min-w-0 flex-1 bg-white">
            <AdminHeader />
            <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}

function AdminKeyForm({ onSave }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!value.trim()) {
      setError("Enter admin key first.");
      return;
    }

    setError("");
    setChecking(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "x-admin-key": value.trim() },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to verify the admin key.");
        return;
      }
      onSave(value.trim());
    } catch {
      setError("Unable to verify the key. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-10 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700">Admin dashboard key</label>
        <input
          type="password"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError("");
          }}
          placeholder="Enter your admin key"
          className="mt-2 min-h-14 w-full border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#1f5a7a] focus:ring-2 focus:ring-[#1f5a7a]/15"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={checking} type="submit" className="inline-flex min-h-13 w-full items-center justify-center bg-[#1f5a7a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#163247] disabled:cursor-not-allowed disabled:opacity-60">
        {checking ? "Checking..." : "Continue"}
      </button>
    </form>
  );
}
