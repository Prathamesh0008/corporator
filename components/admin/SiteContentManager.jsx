"use client";
/* eslint-disable @next/next/no-img-element -- Private preview supports unsaved data URLs. */
import { useEffect, useState } from "react";
import { useAdminAuth } from "./AdminShell";
import { readAdminImage } from "../../lib/adminImageFile";
import { Notice } from "./AdminUI";
import WebsitePreview from "./WebsitePreview";
export default function SiteContentManager() {
  const { adminKey } = useAdminAuth();
  const [form, setForm] = useState({});
  const [published, setPublished] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const load = async () => {
    setError("");
    setLoaded(false);
    try {
      const response = await fetch("/api/site-content?admin=1", {
        headers: { "x-admin-key": adminKey },
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setForm({
        ...data.content,
        ...(data.draft && !data.draft.syncedToLive ? data.draft : {}),
        bannerImage: "",
      });
      setPublished(
        Boolean(data.content?.homeBanner || data.content?.updatedAt),
      );
      setLoaded(true);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [adminKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const image = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReading(true);
    setError("");
    try {
      const bannerImage = await readAdminImage(file);
      setForm((old) => ({ ...old, bannerImage }));
    } catch (err) {
      setError(err.message);
    } finally {
      setReading(false);
    }
  };
  const save = async (publish) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/site-content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          ...form,
          action: publish ? "publish" : "save-draft",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setForm((old) => ({ ...old, ...data.content, bannerImage: "" }));
      if (publish) setPublished(true);
      setMessage(
        publish
          ? "Website content published."
          : "Draft saved privately. Live website unchanged.",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <section className="admin-section">
        <div className="admin-toolbar">
          <div>
            <h2>Homepage content</h2>
            <p className="admin-muted">
              The banner image feeds the existing hero. Save privately before
              publishing.
            </p>
          </div>
          <button disabled={busy} onClick={load}>
            Reload / retry
          </button>
        </div>
        <Notice error={error} message={message} />
        <div className="admin-form-grid">
          <label className="admin-wide">
            Homepage banner / hero image
            <img
              className="admin-image-preview"
              src={form.bannerImage || form.homeBanner || "/photo.jpeg"}
              alt="Homepage hero"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy || reading || !loaded}
              onChange={image}
            />
            <small>
              Leave empty to retain the current image. Maximum 5 MB.
            </small>
          </label>
          <div className="admin-wide">
            <h3>Announcement settings (currently inactive publicly)</h3>
            <p className="admin-muted">
              The public announcement bar is disabled in the existing layout.
              These settings can be saved, but publishing them will not add a
              bar or change the homepage structure.
            </p>
            <label>
              <span>
                <input
                  type="checkbox"
                  checked={Boolean(form.announcementEnabled)}
                  onChange={(e) =>
                    setForm((old) => ({
                      ...old,
                      announcementEnabled: e.target.checked,
                    }))
                  }
                />{" "}
                Announcement enabled setting
              </span>
            </label>
          </div>
          {[
            ["announcementEn", "Announcement English"],
            ["announcementMr", "Announcement Marathi"],
          ].map(([key, label]) => (
            <label key={key}>
              {label}
              <textarea
                maxLength={500}
                value={form[key] || ""}
                onChange={(e) =>
                  setForm((old) => ({ ...old, [key]: e.target.value }))
                }
              />
            </label>
          ))}
        </div>
        <div className="admin-actions">
          <button
            disabled={!loaded || busy || reading}
            onClick={() => save(false)}
          >
            Save Draft
          </button>
          <button
            disabled={!loaded || busy || reading}
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
          <button
            className="admin-primary"
            disabled={!loaded || busy || reading}
            onClick={() => save(true)}
          >
            Publish
          </button>
          {published && (
            <a
              className="admin-button"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Live
            </a>
          )}
        </div>
      </section>
      <section className="admin-section">
        <h2>Content sources</h2>
        <ul>
          <li>
            Works, gallery previews and news: managed through their published
            records.
          </li>
          <li>
            Hero name, identity text, biography and party affiliation:
            source-managed; no editable API is available.
          </li>
          <li>
            Office contact details and ward map boundaries: source-managed and
            unchanged.
          </li>
          <li>
            Announcement: settings exist, but public presentation is disabled.
          </li>
          <li>
            Unverified bundled photographs and example articles: retained in
            source, excluded from public rendering.
          </li>
        </ul>
      </section>
      {preview && (
        <WebsitePreview
          type="site"
          values={form}
          onClose={() => setPreview(false)}
        />
      )}
    </>
  );
}
