"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../../components/admin/AdminShell";

const STATUS_OPTIONS = ["Under Review", "In Progress", "Resolved", "Rejected"];
const EMPTY_NEWS = { titleEn: "", titleMr: "", categoryEn: "", categoryMr: "", summaryEn: "", summaryMr: "", contentEn: "", contentMr: "", externalUrl: "", date: new Date().toISOString().slice(0, 10), image: "" };
const EMPTY_WORK = { titleEn: "", titleMr: "", categoryEn: "", categoryMr: "", locationEn: "", locationMr: "", statusEn: "Completed", statusMr: "पूर्ण झाले", descriptionEn: "", descriptionMr: "", beforeImage: "", afterImage: "", highlightsEn: "", highlightsMr: "" };

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("resolved")) return "bg-green-100 text-green-700";
  if (normalized.includes("progress")) return "bg-blue-100 text-blue-700";
  if (normalized.includes("review")) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-700";
}

function toCloudinaryDownloadUrl(url) {
  if (!url) return "";
  if (url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/fl_attachment/");
  }
  return url;
}

async function imageUrlToDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load demo image.");
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to prepare demo image."));
    reader.readAsDataURL(blob);
  });
}

export default function AdminPageClient() {
  const { adminKey } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [limit, setLimit] = useState(50);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [statusUpdateLoading, setStatusUpdateLoading] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [workForm, setWorkForm] = useState(EMPTY_WORK);
  const [workSaving, setWorkSaving] = useState(false);
  const [newsForm, setNewsForm] = useState(EMPTY_NEWS);
  const [newsSaving, setNewsSaving] = useState(false);
  const [complaintSearch, setComplaintSearch] = useState("");
  const [complaintStatusFilter, setComplaintStatusFilter] = useState("All");

  const totals = useMemo(
    () => ({
      complaints: complaints.length,
      contacts: contacts.length,
    }),
    [complaints.length, contacts.length]
  );

  const complaintCounts = useMemo(() => STATUS_OPTIONS.reduce((counts, status) => {
    counts[status] = complaints.filter((item) => item.status === status).length;
    return counts;
  }, {}), [complaints]);

  const filteredComplaints = useMemo(() => {
    const query = complaintSearch.trim().toLowerCase();
    return complaints.filter((item) => {
      const matchesStatus = complaintStatusFilter === "All" || item.status === complaintStatusFilter;
      const matchesSearch = !query || [item.complaintId, item.name, item.phone, item.complaintType, item.location]
        .some((value) => String(value || "").toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [complaints, complaintSearch, complaintStatusFilter]);

  const fetchSubmissions = useCallback(async () => {
    if (!adminKey.trim()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/submissions?limit=${limit}`, {
        method: "GET",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load data.");
      }

      const nextComplaints = Array.isArray(data.complaints) ? data.complaints : [];
      setComplaints(nextComplaints);
      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
      setFetchedAt(data.fetchedAt || new Date().toISOString());
      setStatusDrafts(
        nextComplaints.reduce((acc, item) => {
          acc[item.complaintId] = item.status || "Under Review";
          return acc;
        }, {})
      );
      setStatusUpdateMessage("");
    } catch (err) {
      setError(err.message || "Failed to load submissions.");
    } finally {
      setIsLoading(false);
    }
  }, [adminKey, limit]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateComplaintStatus = async (complaintId) => {
    if (!adminKey.trim()) {
      setError("Enter admin key first.");
      return;
    }

    const nextStatus = statusDrafts[complaintId];
    const comment = String(commentDrafts[complaintId] || "").trim();
    if (!nextStatus && !comment) return;

    setStatusUpdateLoading(complaintId);
    setStatusUpdateMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          complaintId,
          status: nextStatus,
          comment,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to update complaint status.");
      }

      setComplaints((prev) =>
        prev.map((item) =>
          item.complaintId === complaintId
            ? {
                ...item,
                status: data?.complaint?.status || nextStatus,
                comments: data?.complaint?.comments || item.comments || [],
                updatedAt: data?.complaint?.updatedAt || new Date().toISOString(),
              }
            : item
        )
      );
      setCommentDrafts((prev) => ({ ...prev, [complaintId]: "" }));

      setStatusUpdateMessage(`Updated ${complaintId}.`);
    } catch (err) {
      setError(err.message || "Failed to update status.");
    } finally {
      setStatusUpdateLoading("");
    }
  };

  const publishWork = async (event) => {
    event.preventDefault();
    if (!adminKey.trim()) return setError("Enter admin key first.");
    setWorkSaving(true); setError(""); setStatusUpdateMessage("");
    try {
      const response = await fetch("/api/works", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey.trim() }, body: JSON.stringify(workForm) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to publish work.");
      setWorkForm(EMPTY_WORK);
      setStatusUpdateMessage(`Published "${data.work.titleEn}" on the works page.`);
    } catch (err) { setError(err.message || "Unable to publish work."); }
    finally { setWorkSaving(false); }
  };

  const selectWorkPhoto = (key) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Each work photo must be 5 MB or smaller."); return; }
    const reader = new FileReader();
    reader.onload = () => setWorkForm((old) => ({ ...old, [key]: String(reader.result || "") }));
    reader.onerror = () => setError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  const publishNews = async (event) => {
    event.preventDefault();
    if (!adminKey.trim()) return setError("Enter admin key first.");
    setNewsSaving(true); setError(""); setStatusUpdateMessage("");
    try {
      const response = await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey.trim() }, body: JSON.stringify(newsForm) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to publish news.");
      setNewsForm({ ...EMPTY_NEWS, date: new Date().toISOString().slice(0, 10) });
      setStatusUpdateMessage(`Published "${data.article.titleEn}" on the news page.`);
    } catch (err) { setError(err.message || "Unable to publish news."); }
    finally { setNewsSaving(false); }
  };

  const selectNewsPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please select an image file.");
    if (file.size > 5 * 1024 * 1024) return setError("News photo must be 5 MB or smaller.");
    const reader = new FileReader();
    reader.onload = () => setNewsForm((old) => ({ ...old, image: String(reader.result || "") }));
    reader.onerror = () => setError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  const fillDemoWork = async () => {
    setError("");
    try {
      const [beforeImage, afterImage] = await Promise.all([imageUrlToDataUrl("/works/r1.png"), imageUrlToDataUrl("/works/r2.png")]);
      setWorkForm({ titleEn: "Demo Road Improvement Work", titleMr: "नमुना रस्ता सुधारणा काम", categoryEn: "Road Development", categoryMr: "रस्ता विकास", locationEn: "Sector 18, Nerul", locationMr: "सेक्टर १८, नेरूळ", statusEn: "Completed", statusMr: "पूर्ण झाले", descriptionEn: "Demo entry created to test the complete civic work publishing workflow, including before and after photographs.", descriptionMr: "कामापूर्वी आणि कामानंतरच्या छायाचित्रांसह संपूर्ण विकासकाम प्रकाशन प्रक्रिया तपासण्यासाठी तयार केलेली नमुना नोंद.", highlightsEn: "Damaged surface repaired\nSafer vehicle movement\nImproved road quality", highlightsMr: "खराब पृष्ठभागाची दुरुस्ती\nसुरक्षित वाहतूक\nरस्त्याच्या गुणवत्तेत सुधारणा", beforeImage, afterImage });
      setStatusUpdateMessage("Demo work data is ready. Review it and click Publish Work.");
    } catch (err) { setError(err.message); }
  };

  const fillDemoNews = async () => {
    setError("");
    try {
      const image = await imageUrlToDataUrl("/images/banner-1.jpg");
      setNewsForm({ titleEn: "Demo Ward Development Update", titleMr: "नमुना वॉर्ड विकास अपडेट", categoryEn: "Ward Update", categoryMr: "वॉर्ड अपडेट", summaryEn: "A demo news post for testing image upload, bilingual content and article publishing from the admin dashboard.", summaryMr: "अॅडमिन डॅशबोर्डमधून फोटो, द्विभाषिक मजकूर आणि बातमी प्रकाशन तपासण्यासाठी नमुना बातमी.", contentEn: "This is a demonstration article. It can be edited, hidden or deleted later from the Manage News page.", contentMr: "ही एक नमुना बातमी आहे. मॅनेज न्यूज पृष्ठावरून ती नंतर संपादित, लपविता किंवा हटविता येईल.", externalUrl: "", date: new Date().toISOString().slice(0, 10), image });
      setStatusUpdateMessage("Demo news data is ready. Review it and click Publish News.");
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="min-w-0 bg-transparent">
      <div className="w-full min-w-0 space-y-4 sm:space-y-6">
        <section className="border-y border-slate-200 bg-white py-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
          <h2 className="text-xl font-bold text-gray-900">Submissions overview</h2>
          <p className="mt-1 text-sm text-gray-600">
            Complaint and contact submissions load automatically after login.
          </p>
            </div>
          <div className="flex gap-3">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              aria-label="Number of submissions"
              className="border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <button
              type="button"
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {statusUpdateMessage && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {statusUpdateMessage}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Total complaints: {totals.complaints}</span>
            <span>Total contacts: {totals.contacts}</span>
            <span>Last refresh: {formatDate(fetchedAt)}</span>
          </div>
        </section>

        <form onSubmit={publishWork} className="border-b border-slate-200 bg-white py-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-semibold text-gray-900">Publish a Civic Work</h2><button type="button" onClick={fillDemoWork} className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-100">Fill Demo Data</button></div>
          <p className="mt-1 text-sm text-gray-600">New entries appear at the top of the public Works page. Upload before and after photos up to 5 MB each.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["titleEn", "Title (English) *"], ["titleMr", "Title (Marathi)"],
              ["categoryEn", "Category (English)"], ["categoryMr", "Category (Marathi)"],
              ["locationEn", "Location (English) *"], ["locationMr", "Location (Marathi)"],
            ].map(([key, label]) => <label key={key} className="text-sm font-semibold text-slate-700">{label}<input required={label.includes("*")} value={workForm[key]} onChange={(e) => setWorkForm((old) => ({ ...old, [key]: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>)}
            {["beforeImage", "afterImage"].map((key) => <label key={key} className="text-sm font-semibold text-slate-700">{key === "beforeImage" ? "Before photo *" : "After photo *"}<span className="mt-2 block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><input required={!workForm[key]} type="file" accept="image/*" onChange={selectWorkPhoto(key)} className="block w-full text-sm font-normal text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:font-semibold file:text-orange-700" />{workForm[key] ? <span className="mt-2 block text-xs font-semibold text-green-700">Photo selected and ready to upload.</span> : null}</span></label>)}
            <label className="text-sm font-semibold text-slate-700">Description (English) *<textarea required rows={4} value={workForm.descriptionEn} onChange={(e) => setWorkForm((old) => ({ ...old, descriptionEn: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">Description (Marathi)<textarea rows={4} value={workForm.descriptionMr} onChange={(e) => setWorkForm((old) => ({ ...old, descriptionMr: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">Highlights (English, one per line)<textarea rows={4} value={workForm.highlightsEn} onChange={(e) => setWorkForm((old) => ({ ...old, highlightsEn: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">Highlights (Marathi, one per line)<textarea rows={4} value={workForm.highlightsMr} onChange={(e) => setWorkForm((old) => ({ ...old, highlightsMr: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
          </div>
          <button disabled={workSaving} className="btn-primary mt-5 disabled:opacity-60">{workSaving ? "Publishing..." : "Publish Work"}</button>
        </form>

        <form onSubmit={publishNews} className="border-b border-slate-200 bg-white py-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-semibold text-gray-900">Publish News</h2><button type="button" onClick={fillDemoNews} className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 hover:bg-orange-100">Fill Demo Data</button></div>
          <p className="mt-1 text-sm text-gray-600">Publish an announcement or ward update with a photo. New articles appear first on the public News page.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[["titleEn", "Title (English) *"], ["titleMr", "Title (Marathi)"], ["categoryEn", "Category (English)"], ["categoryMr", "Category (Marathi)"]].map(([key, label]) => (
              <label key={key} className="text-sm font-semibold text-slate-700">{label}<input required={label.includes("*")} value={newsForm[key]} onChange={(e) => setNewsForm((old) => ({ ...old, [key]: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            ))}
            <label className="text-sm font-semibold text-slate-700">Publication date *<input required type="date" value={newsForm.date} onChange={(e) => setNewsForm((old) => ({ ...old, date: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">External news URL (optional)<input type="url" placeholder="https://news-website.com/article" value={newsForm.externalUrl} onChange={(e) => setNewsForm((old) => ({ ...old, externalUrl: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">News photo *<span className="mt-2 block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><input required={!newsForm.image} type="file" accept="image/*" onChange={selectNewsPhoto} className="block w-full text-sm font-normal text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:font-semibold file:text-orange-700" />{newsForm.image ? <span className="mt-2 block text-xs font-semibold text-green-700">Photo selected and ready to upload.</span> : null}</span></label>
            <label className="text-sm font-semibold text-slate-700">Summary (English) *<textarea required rows={3} value={newsForm.summaryEn} onChange={(e) => setNewsForm((old) => ({ ...old, summaryEn: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">Summary (Marathi)<textarea rows={3} value={newsForm.summaryMr} onChange={(e) => setNewsForm((old) => ({ ...old, summaryMr: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">Full article (English)<textarea rows={7} value={newsForm.contentEn} onChange={(e) => setNewsForm((old) => ({ ...old, contentEn: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
            <label className="text-sm font-semibold text-slate-700">Full article (Marathi)<textarea rows={7} value={newsForm.contentMr} onChange={(e) => setNewsForm((old) => ({ ...old, contentMr: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-orange-500" /></label>
          </div>
          <button disabled={newsSaving} className="btn-primary mt-5 disabled:opacity-60">{newsSaving ? "Publishing..." : "Publish News"}</button>
        </form>

        <section className="border-y border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-1 py-6">
            <p className="text-xs font-black uppercase tracking-[.2em] text-orange-600">Citizen case management</p>
            <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><h2 className="text-2xl font-black text-slate-900">Complaints</h2><p className="mt-1 text-sm text-slate-600">Review cases, update progress, and post messages citizens can see while tracking.</p></div>
              <span className="text-sm font-bold text-slate-500">{filteredComplaints.length} shown</span>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto border-b border-slate-200 px-1 pt-4">
            {[{ label: "All", value: complaints.length, tone: "text-slate-900" }, ...STATUS_OPTIONS.map((status) => ({ label: status, value: complaintCounts[status] || 0, tone: statusClass(status).split(" ")[1] }))].map((item) => (
              <button key={item.label} type="button" onClick={() => setComplaintStatusFilter(item.label)} className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition ${complaintStatusFilter === item.label ? "border-orange-600 text-orange-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}>
                {item.label} <span className={`ml-1 ${item.tone}`}>({item.value})</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-200 py-4 sm:flex-row">
            <input value={complaintSearch} onChange={(e) => setComplaintSearch(e.target.value)} placeholder="Search ID, citizen, phone, type or location..." className="min-h-12 flex-1 rounded-xl border border-slate-300 px-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            <select value={complaintStatusFilter} onChange={(e) => setComplaintStatusFilter(e.target.value)} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 font-semibold outline-none focus:border-orange-500"><option value="All">All statuses</option>{STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}</select>
          </div>

          <div className="overflow-x-auto">
          <table className="min-w-[1500px] w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Complaint ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Ward</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Urgency</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Change Status</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Photo</th>
                <th className="px-3 py-2">Public Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-gray-500" colSpan={12}>
                    {complaints.length ? "No complaints match your filters." : "No complaints loaded yet."}
                  </td>
                </tr>
              )}
              {filteredComplaints.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 align-top transition hover:bg-orange-50/30">
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500">{formatDate(item.createdAt)}</td>
                  <td className="whitespace-nowrap px-3 py-4 font-black text-slate-900">{item.complaintId || "-"}</td>
                  <td className="px-3 py-2">{item.name || "-"}</td>
                  <td className="px-3 py-2">{item.phone || "-"}</td>
                  <td className="px-3 py-2">{item.ward || "-"}</td>
                  <td className="max-w-[220px] px-3 py-2"><span className="font-semibold">{item.complaintType || "-"}</span>{item.description ? <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{item.description}</p> : null}</td>
                  <td className="px-3 py-2">{item.urgency || "-"}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                      {item.status || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex min-w-[220px] items-center gap-2">
                      <select
                        value={statusDrafts[item.complaintId] || item.status || "Under Review"}
                        onChange={(e) =>
                          setStatusDrafts((prev) => ({
                            ...prev,
                            [item.complaintId]: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => updateComplaintStatus(item.complaintId)}
                        disabled={statusUpdateLoading === item.complaintId}
                        className="rounded-md bg-orange-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {statusUpdateLoading === item.complaintId ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2">{item.location || "-"}</td>
                  <td className="px-3 py-2">
                    {item.photoUrl ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={item.photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          View
                        </a>
                        <a
                          href={toCloudinaryDownloadUrl(item.photoUrl)}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="min-w-[280px] space-y-2">
                      <textarea
                        value={commentDrafts[item.complaintId] || ""}
                        onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [item.complaintId]: e.target.value }))}
                        maxLength={1000}
                        rows={3}
                        placeholder="Update visible to the citizen..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                      {item.comments?.length ? (
                        <div className="max-h-28 space-y-1 overflow-y-auto rounded-md bg-slate-50 p-2 text-xs text-slate-600">
                          {item.comments.map((comment, index) => <p key={`${comment.createdAt}-${index}`}><strong>{formatDate(comment.createdAt)}:</strong> {comment.text}</p>)}
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>

        <section className="overflow-x-auto border-y border-slate-200 bg-white py-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Contact Messages</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-gray-500" colSpan={5}>
                    No contact submissions loaded yet.
                  </td>
                </tr>
              )}
              {contacts.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 align-top">
                  <td className="px-3 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-3 py-2">{item.name || "-"}</td>
                  <td className="px-3 py-2">{item.phone || "-"}</td>
                  <td className="px-3 py-2">{item.email || "-"}</td>
                  <td className="max-w-lg px-3 py-2 whitespace-pre-wrap break-words">{item.message || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
