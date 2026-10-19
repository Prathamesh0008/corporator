"use client";
/* eslint-disable @next/next/no-img-element -- Private previews use validated local data URLs and retain original uploaded images without public optimization. */
import { useEffect, useState } from "react";
import { readAdminImage } from "../../lib/adminImageFile";
import { isTestContent } from "../../lib/adminQueries";
import { useAdminAuth } from "./AdminShell";
import { Modal, Notice, Pager } from "./AdminUI";
import WebsitePreview from "./WebsitePreview";
const CONFIG = {
  works: {
    key: "works",
    title: "Development Works",
    images: ["beforeImage", "afterImage"],
    fields: [
      ["titleEn", "Title English"],
      ["titleMr", "Title Marathi"],
      ["categoryEn", "Category English"],
      ["categoryMr", "Category Marathi"],
      ["locationEn", "Location English"],
      ["locationMr", "Location Marathi"],
      ["statusEn", "Work status English"],
      ["statusMr", "Work status Marathi"],
      ["descriptionEn", "Description English", "textarea"],
      ["descriptionMr", "Description Marathi", "textarea"],
      ["highlightsEn", "Highlights English (one per line)", "textarea"],
      ["highlightsMr", "Highlights Marathi (one per line)", "textarea"],
    ],
  },
  news: {
    key: "news",
    title: "News & Updates",
    images: ["image"],
    fields: [
      ["titleEn", "Title English"],
      ["titleMr", "Title Marathi"],
      ["categoryEn", "Category English"],
      ["categoryMr", "Category Marathi"],
      ["date", "Publication date", "date"],
      ["externalUrl", "External article URL", "url"],
      ["summaryEn", "Summary English", "textarea"],
      ["summaryMr", "Summary Marathi", "textarea"],
      ["contentEn", "Full article English", "textarea"],
      ["contentMr", "Full article Marathi", "textarea"],
    ],
  },
  gallery: {
    key: "items",
    title: "Gallery",
    images: ["image"],
    fields: [
      ["titleEn", "Title English"],
      ["titleMr", "Title Marathi"],
      ["categoryEn", "Category English"],
      ["categoryMr", "Category Marathi"],
      ["date", "Date", "date"],
    ],
  },
};
export default function ContentManager({ type }) {
  const config = CONFIG[type],
    endpoint = "/api/" + type;
  const { adminKey } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [records, setRecords] = useState("real");
  const [page, setPage] = useState(1);
  const fresh = () => ({ published: false, type: "photo" });
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(endpoint + "?admin=1", {
        headers: { "x-admin-key": adminKey },
      });
      const json = await r.json();
      if (!r.ok) throw Error(json.error);
      setItems(json[config.key] || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
      if (new URLSearchParams(window.location.search).get("new") === "1")
        setEditing(fresh());
    }, 0);
    return () => clearTimeout(timer);
  }, [type, adminKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const open = (item) => {
    setEditing({
      ...item,
      ...item.draft,
      id: item.id,
      published: item.published,
      draft: undefined,
    });
    setError("");
    setMessage("");
  };
  const image = (key) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReading((n) => n + 1);
    setError("");
    try {
      const src = await readAdminImage(file);
      setEditing((old) => ({ ...old, [key]: src }));
    } catch (err) {
      setError(err.message);
      e.target.value = "";
    } finally {
      setReading((n) => n - 1);
    }
  };
  const request = async (item, method, payload) => {
    const r = await fetch(endpoint + (item.id ? "/" + item.id : ""), {
      method,
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    const json = await r.json();
    if (!r.ok) throw Error(json.error || "Action failed.");
    return json;
  };
  const save = async (publish) => {
    const required = !publish
      ? ["titleEn"]
      : type === "works"
        ? [
            "titleEn",
            "locationEn",
            "descriptionEn",
            "beforeImage",
            "afterImage",
          ]
        : type === "news"
          ? ["titleEn", "summaryEn", "image", "date"]
          : ["titleEn", "image", "date"];
    if (
      required.some((key) => !String(editing[key] || "").trim()) ||
      (publish &&
        type === "gallery" &&
        editing.type === "video" &&
        !editing.href)
    )
      return setError(
        "Complete the required title, details, date (where shown) and images. Video items also need a URL.",
      );
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...editing,
        published: publish,
        action: publish ? "publish" : "save-draft",
      };
      for (const key of ["highlightsEn", "highlightsMr"])
        if (Array.isArray(payload[key])) payload[key] = payload[key].join("\n");
      await request(editing, editing.id ? "PATCH" : "POST", payload);
      setEditing(null);
      setMessage(
        publish
          ? "Content published."
          : "Draft saved. Existing published versions remain unchanged.",
      );
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const action = async (item, name) => {
    if (
      name === "delete" &&
      !window.confirm(
        `Permanently delete “${item.titleEn}”? Uploaded originals will be retained.`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await request(
        item,
        name === "delete" ? "DELETE" : "PATCH",
        name === "delete" ? null : { published: false },
      );
      setMessage(name === "delete" ? "Record deleted." : "Content hidden.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const live = (item) =>
    type === "news"
      ? item.slug
        ? "/news/" + encodeURIComponent(item.slug)
        : "/news"
      : type === "works"
        ? item.slug || item.id
          ? "/works/" + encodeURIComponent(item.slug || item.id)
          : "/works#completed-works"
        : "/gallery";
  const filtered = items.filter(
    (item) =>
      (records === "all" || (records === "tests") === isTestContent(item)) &&
      (visibility === "all" ||
        (visibility === "published") === Boolean(item.published)) &&
      (!search ||
        [item.titleEn, item.titleMr, item.categoryEn, item.locationEn].some(
          (v) =>
            String(v || "")
              .toLowerCase()
              .includes(search.toLowerCase()),
        )),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 15)),
    currentPage = Math.min(page, pages);
  return (
    <>
      <div className="admin-toolbar">
        <div>
          <h2>{config.title}</h2>
          <p className="admin-muted">
            Save a draft, check its public presentation, then publish
            explicitly.
          </p>
        </div>
        <div className="admin-actions">
          <button onClick={load} disabled={busy}>
            Refresh / retry
          </button>
          <button
            className="admin-primary"
            onClick={() => {
              setEditing(fresh());
              setError("");
            }}
          >
            Add{" "}
            {type === "works"
              ? "Work"
              : type === "news"
                ? "Article"
                : "Gallery Item"}
          </button>
        </div>
      </div>
      <div className="admin-toolbar">
        <label>
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Visibility
          <select
            value={visibility}
            onChange={(e) => {
              setVisibility(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All visibility</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden / draft</option>
          </select>
        </label>
        <label>
          Records
          <select
            value={records}
            onChange={(e) => {
              setRecords(e.target.value);
              setPage(1);
            }}
          >
            <option value="real">Real content</option>
            <option value="tests">Test/demo records</option>
            <option value="all">All records</option>
          </select>
        </label>
      </div>
      <Notice error={error} message={message} />
      {loading ? (
        <p className="admin-empty">Loading content…</p>
      ) : (
        !error && (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    {[
                      "Image",
                      "Title",
                      "Category / location",
                      "Visibility",
                      "Actions",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    .slice((currentPage - 1) * 15, currentPage * 15)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item[config.images.at(-1)] && (
                            <img src={item[config.images.at(-1)]} alt="" />
                          )}
                        </td>
                        <td>
                          {item.titleEn}
                          <small
                            className="admin-muted"
                            style={{ display: "block" }}
                          >
                            {item.titleMr}
                          </small>
                          {isTestContent(item) && (
                            <span className="admin-test-label">
                              Disposable test/demo
                            </span>
                          )}
                        </td>
                        <td>
                          {item.categoryEn}
                          <br />
                          {item.locationEn || item.date}
                        </td>
                        <td>
                          {item.published ? "Published" : "Hidden / draft"}
                          {item.draft && (
                            <small className="admin-test-label">
                              Unpublished revisions
                            </small>
                          )}
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button disabled={busy} onClick={() => open(item)}>
                              Edit / Preview
                            </button>
                            {item.published ? (
                              <>
                                <a
                                  className="admin-button"
                                  href={live(item)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Live
                                </a>
                                <button
                                  disabled={busy}
                                  onClick={() => action(item, "hide")}
                                >
                                  Hide
                                </button>
                              </>
                            ) : (
                              <button
                                disabled={busy}
                                onClick={() => open(item)}
                              >
                                Review & Publish
                              </button>
                            )}
                            <button
                              disabled={busy}
                              className="admin-danger"
                              onClick={() => action(item, "delete")}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!filtered.length && (
                <p className="admin-empty">
                  No matching content. Labelled tests are separated from real
                  content.
                </p>
              )}
            </div>
            <Pager
              page={currentPage}
              pages={pages}
              total={filtered.length}
              onChange={setPage}
            />
          </>
        )
      )}
      {editing && (
        <Modal
          title={`${editing.id ? "Edit" : "Add"} ${type}`}
          onClose={() => !busy && !reading && setEditing(null)}
        >
          <div className="admin-form-grid">
            {config.fields.map(([key, label, kind]) => (
              <label
                key={key}
                className={kind === "textarea" ? "admin-wide" : ""}
              >
                {label}
                {kind === "textarea" ? (
                  <textarea
                    rows={key.startsWith("content") ? 7 : 3}
                    value={
                      Array.isArray(editing[key])
                        ? editing[key].join("\n")
                        : editing[key] || ""
                    }
                    onChange={(e) =>
                      setEditing((old) => ({ ...old, [key]: e.target.value }))
                    }
                  />
                ) : (
                  <input
                    type={kind || "text"}
                    value={editing[key] || ""}
                    onChange={(e) =>
                      setEditing((old) => ({ ...old, [key]: e.target.value }))
                    }
                  />
                )}
              </label>
            ))}
            {type === "gallery" && (
              <>
                <label>
                  Media type
                  <select
                    value={editing.type || "photo"}
                    onChange={(e) =>
                      setEditing((old) => ({ ...old, type: e.target.value }))
                    }
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Instagram reel / video link</option>
                  </select>
                </label>
                {editing.type === "video" && (
                  <label>
                    Video / reel URL
                    <input
                      type="url"
                      value={editing.href || ""}
                      onChange={(e) =>
                        setEditing((old) => ({ ...old, href: e.target.value }))
                      }
                    />
                  </label>
                )}
              </>
            )}
            {config.images.map((key) => (
              <label key={key}>
                {key === "beforeImage"
                  ? "Before image"
                  : key === "afterImage"
                    ? "After image"
                    : type === "gallery"
                      ? "Photo / video thumbnail"
                      : "Article image"}
                {editing[key] && (
                  <img
                    className="admin-image-preview"
                    src={editing[key]}
                    alt={key}
                  />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy || reading > 0}
                  onChange={image(key)}
                />
                <small>
                  JPG, PNG, WEBP · up to 5 MB. Leave unchanged to retain the
                  current image.
                </small>
              </label>
            ))}
            <div className="admin-wide">
              <Notice error={error} />
              <p className="admin-muted">
                Saving a draft never publishes it. Revisions to a published item
                stay private until Publish is selected.
              </p>
            </div>
          </div>
          <footer className="admin-editor-footer">
            <button disabled={busy || reading > 0} onClick={() => save(false)}>
              Save Draft
            </button>
            <button
              disabled={busy || reading > 0}
              onClick={() => setPreview(true)}
            >
              Preview
            </button>
            <button
              className="admin-primary"
              disabled={busy || reading > 0}
              onClick={() => save(true)}
            >
              {busy ? "Saving…" : "Publish"}
            </button>
            {editing.published && (
              <a
                className="admin-button"
                href={live(editing)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live
              </a>
            )}
          </footer>
        </Modal>
      )}
      {preview && editing && (
        <WebsitePreview
          type={type}
          values={editing}
          onClose={() => setPreview(false)}
        />
      )}
    </>
  );
}
