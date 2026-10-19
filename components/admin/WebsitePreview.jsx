"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAdminAuth } from "./AdminShell";
import { PreviewLanguageProvider } from "../../contexts/LanguageContext";
import HomepageSections from "../home/HomepageSections";
import HeroSection from "../home/HeroSection";
import WorksPageClient from "../../app/works/WorksPageClient";
import GalleryPageClient from "../../app/gallery/GalleryPageClient";
import WorkDetailView from "../public/WorkDetailView";
import NewsDetailView from "../public/NewsDetailView";
import NewsListingView from "../public/NewsListingView";

export default function WebsitePreview({ type, values, onClose }) {
  const { adminKey } = useAdminAuth();
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");
  const [width, setWidth] = useState("desktop");
  const [surface, setSurface] = useState(type === "site" ? "hero" : "homepage");
  const [root, setRoot] = useState(null);
  const previous = useRef(null);
  const close = useRef(null);
  useEffect(() => {
    let active = true;
    previous.current = document.activeElement;
    close.current?.focus();
    // Recheck server authorization before exposing drafts, even for unsaved previews.
    fetch("/api/admin/preview", {
      method: "POST",
      headers: { "x-admin-key": adminKey },
    })
      .then((r) => {
        if (!r.ok) throw Error("Preview authorization failed. Sign in again.");
        if (active) setAuthorized(true);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      active = false;
      document.body.style.overflow = old;
      previous.current?.focus();
    };
  }, [adminKey]);
  const setup = (event) => {
    const doc = event.currentTarget.contentDocument;
    doc.documentElement.className = document.documentElement.className;
    doc.body.className = document.body.className;
    document
      .querySelectorAll("link[rel=stylesheet],style")
      .forEach((node) => doc.head.appendChild(node.cloneNode(true)));
    setRoot(doc.getElementById("preview-root"));
  };
  const item = {
    ...values,
    id: values.id || "unsaved-preview",
    slug: values.slug || "unsaved-preview",
    published: true,
    highlightsEn: Array.isArray(values.highlightsEn)
      ? values.highlightsEn
      : String(values.highlightsEn || "")
          .split("\n")
          .filter(Boolean),
    highlightsMr: Array.isArray(values.highlightsMr)
      ? values.highlightsMr
      : String(values.highlightsMr || "")
          .split("\n")
          .filter(Boolean),
  };
  const items = {
    works: type === "works" ? [item] : [],
    news: type === "news" ? [item] : [],
    gallery: type === "gallery" ? [item] : [],
  };
  const options =
    type === "site"
      ? [["hero", "Homepage hero / banner"]]
      : [
          ["homepage", "Homepage section"],
          [
            "listing",
            type === "gallery" ? "Gallery & lightbox" : "Public listing",
          ],
          ...(type !== "gallery" ? [["detail", "Full detail page"]] : []),
        ];
  let content;
  if (type === "site")
    content = (
      <HeroSection
        image={values.bannerImage || values.homeBanner || "/photo.jpeg"}
      />
    );
  else if (surface === "homepage")
    content = <HomepageSections previewItems={items} />;
  else if (type === "works")
    content =
      surface === "detail" ? (
        <WorkDetailView item={item} />
      ) : (
        <WorksPageClient previewItems={[item]} />
      );
  else if (type === "gallery")
    content = <GalleryPageClient previewItems={[item]} />;
  else
    content =
      surface === "detail" ? (
        <NewsDetailView article={item} />
      ) : (
        <NewsListingView allNews={[item]} />
      );
  return (
    <div
      className="admin-preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Website draft preview"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          if (
            e.target.ownerDocument !== document &&
            e.target.ownerDocument.querySelector('[role="dialog"]')
          )
            return;
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div className="admin-preview-tools">
        <strong>Draft Preview — Not Published</strong>
        <label>
          Language
          <select
            aria-label="Preview language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="mr">मराठी</option>
          </select>
        </label>
        <label>
          Viewport
          <select
            aria-label="Preview viewport"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          >
            <option value="desktop">Desktop · 1280px</option>
            <option value="mobile">Mobile · 390px</option>
          </select>
        </label>
        <label>
          Placement
          <select
            aria-label="Preview placement"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
          >
            {options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button ref={close} type="button" onClick={onClose}>
          Return to editing
        </button>
      </div>
      <p className="admin-preview-note">
        {type === "site"
          ? "Banner image uses the actual public hero. Hero text, biography and office details are source-managed. The announcement bar is disabled on the public site, so announcement text has no live visual preview."
          : "Actual public components with this draft substituted. Other records are omitted. Links are disabled; gallery lightboxes and work detail dialogs remain interactive. Incomplete drafts may show empty fields."}
        {type === "gallery" &&
          values.type === "video" &&
          " The homepage shows photographs only. Use the Gallery view and Videos tab to inspect this reel thumbnail; external playback is disabled in preview."}
      </p>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      <div className="admin-preview-stage">
        {authorized && (
          <iframe
            title="Private website preview"
            onLoad={setup}
            style={{ width: width === "mobile" ? 390 : 1280 }}
            srcDoc={
              '<!doctype html><html><head><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="preview-root"></div></body></html>'
            }
          />
        )}
      </div>
      {authorized &&
        root &&
        createPortal(
          <PreviewLanguageProvider language={language}>
            <div
              lang={language}
              onClickCapture={(event) => {
                if (event.target.closest("a")) event.preventDefault();
              }}
            >
              {content}
            </div>
          </PreviewLanguageProvider>,
          root,
        )}
    </div>
  );
}
