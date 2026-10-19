"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminAuth } from "../../components/admin/AdminShell";
import { Notice, dateLabel } from "../../components/admin/AdminUI";
export default function AdminPageClient() {
  const { adminKey } = useAdminAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/overview", {
        headers: { "x-admin-key": adminKey },
      });
      const json = await r.json();
      if (!r.ok) throw Error(json.error);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [adminKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h2>Overview</h2>
          <p className="admin-muted">
            Current database totals. Acceptance tests and known demo records are
            excluded.
          </p>
        </div>
        <button onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Refresh / retry"}
        </button>
      </div>
      <Notice error={error} />
      {!error && data && (
        <>
          <div className="admin-stats">
            {[
              ["complaints", "Total complaints"],
              ["Under Review", "Under Review"],
              ["In Progress", "In Progress"],
              ["Resolved", "Resolved"],
              ["Rejected", "Rejected"],
              ["publishedWorks", "Published works"],
              ["hiddenWorks", "Hidden works"],
              ["gallery", "Gallery items"],
              ["news", "News articles"],
              ["contacts", "Contact messages"],
            ].map(([key, label]) => (
              <div key={key}>
                <strong>{data.counts[key]}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          {Object.values(data.excluded).some(Boolean) && (
            <p className="admin-muted">
              {Object.values(data.excluded).reduce((a, b) => a + b, 0)} labelled
              test/demo records excluded. Select “Test/demo records” in the
              relevant manager to review them.
            </p>
          )}
          <section className="admin-section">
            <h2>Quick actions</h2>
            <div className="admin-actions">
              {[
                ["View complaints", "/ward-control/complaints"],
                ["Add development work", "/ward-control/works?new=1"],
                ["Upload gallery photos", "/ward-control/gallery?new=1"],
                ["Add announcement", "/ward-control/content"],
              ].map(([label, href]) => (
                <Link className="admin-button" key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </section>
          <h2>Recent complaints</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {[
                    "Complaint ID",
                    "Issue type",
                    "Location",
                    "Date",
                    "Status",
                    "Action",
                  ].map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent.map((item) => (
                  <tr key={item.complaintId}>
                    <td>{item.complaintId}</td>
                    <td>{item.complaintType}</td>
                    <td>{item.location}</td>
                    <td>{dateLabel(item.createdAt)}</td>
                    <td>{item.status}</td>
                    <td>
                      <Link
                        className="admin-button"
                        href={`/ward-control/complaints?q=${encodeURIComponent(item.complaintId)}`}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.recent.length && (
              <p className="admin-empty">
                No citizen complaints yet. Disposable tests are excluded.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
