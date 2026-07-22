"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiRefreshCw, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { useAdminAuth } from "./AdminShell";

const CONFIG = {
  works: {
    endpoint: "/api/works", responseKey: "works", title: "Civic Works", imageKey: "afterImage",
    fields: [["titleEn", "Title (English)"], ["titleMr", "Title (Marathi)"], ["categoryEn", "Category (English)"], ["categoryMr", "Category (Marathi)"], ["locationEn", "Location (English)"], ["locationMr", "Location (Marathi)"], ["descriptionEn", "Description (English)", "textarea"], ["descriptionMr", "Description (Marathi)", "textarea"], ["highlightsEn", "Highlights (English, one per line)", "textarea"], ["highlightsMr", "Highlights (Marathi, one per line)", "textarea"]],
  },
  news: {
    endpoint: "/api/news", responseKey: "news", title: "News Articles", imageKey: "image",
    fields: [["titleEn", "Title (English)"], ["titleMr", "Title (Marathi)"], ["categoryEn", "Category (English)"], ["categoryMr", "Category (Marathi)"], ["date", "Publication date", "date"], ["externalUrl", "External URL"], ["summaryEn", "Summary (English)", "textarea"], ["summaryMr", "Summary (Marathi)", "textarea"], ["contentEn", "Full article (English)", "textarea"], ["contentMr", "Full article (Marathi)", "textarea"]],
  },
};

export default function ContentManager({ type }) {
  const config = CONFIG[type];
  const { adminKey } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${config.endpoint}?admin=1`, { headers: { "x-admin-key": adminKey } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load content.");
      setItems(data[config.responseKey] || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mutate = async (item, method, body, success) => {
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch(`${config.endpoint}/${item.id}`, { method, headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: body ? JSON.stringify(body) : undefined });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action failed.");
      setMessage(success); setEditing(null); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const saveEdit = () => {
    const payload = { ...editing };
    ["highlightsEn", "highlightsMr"].forEach((key) => { if (Array.isArray(payload[key])) payload[key] = payload[key].join("\n"); });
    mutate(editing, "PATCH", payload, "Changes saved successfully.");
  };

  const remove = (item) => {
    if (!window.confirm(`Permanently delete "${item.titleEn}"? This cannot be undone.`)) return;
    mutate(item, "DELETE", null, "Content deleted.");
  };

  return <div className="space-y-5">
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black text-slate-900">Manage {config.title}</h2><p className="mt-1 text-sm text-slate-600">Edit, publish, hide, or permanently delete content created from the admin dashboard.</p></div><button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><FiRefreshCw /> Refresh</button></div>
      {message && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">{message}</p>}
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
    </section>

    {loading ? <div className="rounded-3xl bg-white p-10 text-center font-bold text-slate-500">Loading content...</div> : items.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">No admin-created {config.title.toLowerCase()} yet.</div> : <div className="grid gap-4 xl:grid-cols-2">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex gap-4 p-4"><div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100"><Image src={item[config.imageKey]} alt="" fill unoptimized={String(item[config.imageKey]).startsWith("http")} className="object-cover" sizes="112px" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-wider text-orange-600">{item.categoryEn || "Uncategorized"}</p><h3 className="mt-1 line-clamp-2 font-black text-slate-900">{item.titleEn}</h3></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${item.published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>{item.published ? "Published" : "Hidden"}</span></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.locationEn || item.summaryEn}</p></div></div><div className="grid grid-cols-3 border-t border-slate-100"><Action icon={<FiEdit2 />} label="Edit" onClick={() => setEditing({ ...item })} /><Action icon={item.published ? <FiEyeOff /> : <FiEye />} label={item.published ? "Hide" : "Publish"} onClick={() => mutate(item, "PATCH", { published: !item.published }, item.published ? "Content hidden." : "Content published.")} /><Action danger icon={<FiTrash2 />} label="Delete" onClick={() => remove(item)} /></div></article>)}</div>}

    {editing && <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4"><h2 className="text-xl font-black">Edit {type === "works" ? "Work" : "News Article"}</h2><button type="button" onClick={() => setEditing(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100"><FiX /></button></div><div className="grid gap-4 p-5 sm:grid-cols-2">{config.fields.map(([key, label, inputType]) => <label key={key} className={`text-sm font-bold text-slate-700 ${inputType === "textarea" ? "sm:col-span-2" : ""}`}>{label}{inputType === "textarea" ? <textarea rows={key.includes("content") ? 7 : 4} value={Array.isArray(editing[key]) ? editing[key].join("\n") : editing[key] || ""} onChange={(event) => setEditing((old) => ({ ...old, [key]: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /> : <input type={inputType || "text"} value={editing[key] || ""} onChange={(event) => setEditing((old) => ({ ...old, [key]: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" />}</label>)}</div><div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white p-4"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 px-5 py-2.5 font-bold">Cancel</button><button type="button" disabled={saving} onClick={saveEdit} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 font-bold text-white disabled:opacity-60"><FiSave />{saving ? "Saving..." : "Save Changes"}</button></div></div></div>}
  </div>;
}

function Action({ icon, label, onClick, danger }) { return <button type="button" onClick={onClick} className={`inline-flex items-center justify-center gap-2 px-3 py-3 text-xs font-black transition hover:bg-slate-50 ${danger ? "text-red-600" : "text-slate-600"}`}>{icon}{label}</button>; }
