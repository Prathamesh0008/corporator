"use client";
/* eslint-disable @next/next/no-img-element -- Private complaint attachment is displayed only after authorized retrieval. */
import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "./AdminShell";
import { Modal, Notice, Pager, dateLabel } from "./AdminUI";
import { complaintStatuses, isTestContent } from "../../lib/adminQueries";
export default function InboxManager({ view }) {
  const { adminKey } = useAdminAuth();
  const complaints = view === "complaints";
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    category: "",
    date: "",
    records: "real",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("Under Review");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setFilters((old) => ({ ...old, q }));
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        view,
        limit: "20",
        page: String(page),
        ...filters,
      });
      const response = await fetch("/api/admin/submissions?" + query, {
        headers: { "x-admin-key": adminKey },
      });
      const json = await response.json();
      if (!response.ok) throw Error(json.error);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [view, adminKey, page, filters]);
  useEffect(() => {
    const timer = setTimeout(load, 350);
    return () => clearTimeout(timer);
  }, [load]);
  const filter = (key) => (e) => {
    setPage(1);
    setFilters((old) => ({ ...old, [key]: e.target.value }));
  };
  const open = (item) => {
    setSelected(item);
    setStatus(item.status || "Under Review");
    setComment("");
    setMessage("");
  };
  const update = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          complaintId: selected.complaintId,
          status,
          comment,
        }),
      });
      const json = await response.json();
      if (!response.ok) throw Error(json.error);
      setSelected(json.complaint);
      setComment("");
      setMessage("Complaint updated.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const headings = complaints
    ? [
        "Complaint ID",
        "Citizen",
        "Mobile",
        "Category",
        "Location",
        "Submitted",
        "Status",
        "Action",
      ]
    : ["Name", "Phone", "Email", "Message", "Submitted", "Action"];
  return (
    <>
      <div className="admin-toolbar">
        <label>
          Search
          <input
            type="search"
            value={filters.q}
            onChange={filter("q")}
            placeholder={
              complaints
                ? "ID, citizen, mobile or location"
                : "Name, email, mobile or message"
            }
          />
        </label>
        {complaints && (
          <>
            <label>
              Status
              <select value={filters.status} onChange={filter("status")}>
                <option value="">All statuses</option>
                {complaintStatuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select value={filters.category} onChange={filter("category")}>
                <option value="">All categories</option>
                {data?.categories.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Submission date
              <input
                type="date"
                value={filters.date}
                onChange={filter("date")}
              />
            </label>
          </>
        )}
        <label>
          Records
          <select value={filters.records} onChange={filter("records")}>
            <option value="real">Citizen records</option>
            <option value="tests">Test/demo records</option>
            <option value="all">All records</option>
          </select>
        </label>
        <button onClick={load}>Refresh / retry</button>
      </div>
      <Notice error={error} />
      {loading ? (
        <p className="admin-empty">Loading records…</p>
      ) : (
        !error &&
        data && (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    {headings.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      {complaints && <td>{item.complaintId}</td>}
                      <td>
                        {item.name}
                        {isTestContent(item) && (
                          <span className="admin-test-label">
                            Disposable test/demo
                          </span>
                        )}
                      </td>
                      <td>{item.phone}</td>
                      {complaints ? (
                        <>
                          <td>{item.complaintType}</td>
                          <td>{item.location}</td>
                          <td>{dateLabel(item.createdAt)}</td>
                          <td>{item.status}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.email || "—"}</td>
                          <td>{item.message.slice(0, 100)}</td>
                          <td>{dateLabel(item.createdAt)}</td>
                        </>
                      )}
                      <td>
                        <button onClick={() => open(item)}>Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.items.length && (
                <p className="admin-empty">
                  No matching {complaints ? "complaints" : "messages"}.
                </p>
              )}
            </div>
            <Pager {...data} onChange={setPage} />
          </>
        )
      )}
      {selected && (
        <Modal
          title={complaints ? selected.complaintId : "Contact message"}
          onClose={() => !busy && setSelected(null)}
        >
          <div className="admin-details">
            <dl>
              {(complaints
                ? [
                    ["name", "Citizen"],
                    ["phone", "Mobile"],
                    ["address", "Address"],
                    ["ward", "Ward"],
                    ["complaintType", "Category"],
                    ["location", "Location"],
                    ["description", "Description"],
                    ["status", "Status"],
                    ["urgency", "Urgency"],
                  ]
                : [
                    ["name", "Name"],
                    ["phone", "Phone"],
                    ["email", "Email"],
                    ["message", "Message"],
                  ]
              ).map(([key, label]) => (
                <div key={key}>
                  <dt>{label}</dt>
                  <dd>{selected[key] || "—"}</dd>
                </div>
              ))}
              <div>
                <dt>Submitted</dt>
                <dd>{dateLabel(selected.createdAt)}</dd>
              </div>
              {complaints && (
                <div>
                  <dt>Last updated</dt>
                  <dd>{dateLabel(selected.updatedAt)}</dd>
                </div>
              )}
            </dl>
            {selected.photoUrl && (
              <>
                <a
                  href={selected.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={selected.photoUrl}
                    className="admin-image-preview"
                    alt="Complaint attachment"
                  />
                </a>
                <a
                  className="admin-button"
                  href={
                    selected.photoUrl.includes("/upload/")
                      ? selected.photoUrl.replace(
                          "/upload/",
                          "/upload/fl_attachment/",
                        )
                      : selected.photoUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  Download attachment
                </a>
              </>
            )}
            {complaints && (
              <>
                <h3>Office updates</h3>
                <p className="admin-muted">Office email notification: {({ sent: "Sent (provider accepted)", failed: "Failed", not_configured: "Not configured", unknown: "Unknown — do not resend automatically", pending: "Pending", sending: "Sending / outcome pending" })[selected.notification?.status] || "Not recorded"}</p>
                <p className="admin-muted">
                  Comments may be visible to anyone tracking this complaint.
                  Never include private citizen information.
                </p>
                {selected.comments?.length ? (
                  <ol className="admin-comments">
                    {selected.comments.map((c, i) => (
                      <li key={i}>
                        <small>{dateLabel(c.createdAt)}</small>
                        <p>{c.text}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No office updates yet.</p>
                )}
                <form onSubmit={update}>
                  <label>
                    Current status
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {complaintStatuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    New public office comment
                    <textarea
                      maxLength={1000}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </label>
                  <Notice error={error} message={message} />
                  <button className="admin-primary" disabled={busy}>
                    {busy ? "Updating…" : "Save update"}
                  </button>
                </form>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
