"use client";

import { useMemo, useState } from "react";

const STORAGE_KEY = "admin-dashboard-key";
const STATUS_OPTIONS = ["Under Review", "In Progress", "Resolved", "Rejected"];

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

export default function AdminPageClient() {
  const [adminKey, setAdminKey] = useState(
    () => (typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) || "" : "")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchedAt, setFetchedAt] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [limit, setLimit] = useState(50);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [statusUpdateLoading, setStatusUpdateLoading] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");

  const totals = useMemo(
    () => ({
      complaints: complaints.length,
      contacts: contacts.length,
    }),
    [complaints.length, contacts.length]
  );

  const fetchSubmissions = async () => {
    if (!adminKey.trim()) {
      setError("Enter admin key first.");
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

      sessionStorage.setItem(STORAGE_KEY, adminKey.trim());
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
  };

  const updateComplaintStatus = async (complaintId) => {
    if (!adminKey.trim()) {
      setError("Enter admin key first.");
      return;
    }

    const nextStatus = statusDrafts[complaintId];
    if (!nextStatus) return;

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
                updatedAt: data?.complaint?.updatedAt || new Date().toISOString(),
              }
            : item
        )
      );

      setStatusUpdateMessage(`Updated ${complaintId} to "${nextStatus}".`);
    } catch (err) {
      setError(err.message || "Failed to update status.");
    } finally {
      setStatusUpdateLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-responsive px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            View recent complaint and contact form submissions.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px_auto]">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              {isLoading ? "Loading..." : "Load Submissions"}
            </button>
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
        </div>

        <div className="card overflow-x-auto">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Complaints</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
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
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 && (
                <tr>
                  <td className="px-3 py-3 text-gray-500" colSpan={10}>
                    No complaints loaded yet.
                  </td>
                </tr>
              )}
              {complaints.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-3 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">{item.complaintId || "-"}</td>
                  <td className="px-3 py-2">{item.name || "-"}</td>
                  <td className="px-3 py-2">{item.phone || "-"}</td>
                  <td className="px-3 py-2">{item.ward || "-"}</td>
                  <td className="px-3 py-2">{item.complaintType || "-"}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card overflow-x-auto">
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
        </div>
      </div>
    </div>
  );
}
