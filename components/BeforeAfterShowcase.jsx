"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { workItems } from "./workData";
import { approvedStatic, publicItems } from "../lib/publicContent";

const PAGE_SIZE = 9;

export default function BeforeAfterShowcase({ mr = false, previewItems }) {
  const [publishedWorks, setPublishedWorks] = useState(previewItems || []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedWork, setSelectedWork] = useState(null);
  const [loading, setLoading] = useState(!previewItems);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (previewItems) return;
    let active = true;
    fetch("/api/works")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (active && Array.isArray(data.works)) setPublishedWorks(data.works);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [previewItems]);

  const visibleWorks = useMemo(
    () => [
      ...publicItems(publishedWorks),
      ...approvedStatic(workItems, "works"),
    ],
    [publishedWorks],
  );
  const categories = useMemo(() => {
    const unique = new Map();
    visibleWorks.forEach((work) => {
      const value = work.categoryEn || "Other";
      if (!unique.has(value))
        unique.set(value, mr ? work.categoryMr || value : value);
    });
    return [...unique.entries()];
  }, [visibleWorks, mr]);

  const filteredWorks = useMemo(() => {
    const term = query.trim().toLowerCase();
    return visibleWorks.filter((work) => {
      const matchesCategory =
        category === "all" || work.categoryEn === category;
      const searchable = [
        work.titleEn,
        work.titleMr,
        work.locationEn,
        work.locationMr,
        work.categoryEn,
        work.categoryMr,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [visibleWorks, query, category]);

  return (
    <>
      <h1 className="sr-only">
        {mr ? "वॉर्डातील विकासकामे" : "Ward Development Works"}
      </h1>

      <div className="editorial-container">
        <section
          className="archive-controls"
          aria-label={mr ? "काम शोधा आणि निवडा" : "Search and filter works"}
        >
          <div className="archive-filters">
            <FilterButton
              active={category === "all"}
              onClick={() => {
                setCategory("all");
                setVisibleCount(PAGE_SIZE);
              }}
            >
              {mr ? "सर्व कामे" : "All works"}{" "}
              <span>{visibleWorks.length}</span>
            </FilterButton>
            {categories.map(([value, label]) => (
              <FilterButton
                key={value}
                active={category === value}
                onClick={() => {
                  setCategory(value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {label}
              </FilterButton>
            ))}
          </div>

          <label className="archive-search">
            <span>{mr ? "काम शोधा" : "Search works"}</span>
            <span className="archive-search-field">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder={
                  mr ? "काम किंवा ठिकाण शोधा..." : "Search work or location..."
                }
              />
            </span>
          </label>
        </section>

        {filteredWorks.length ? (
          <div className="archive-projects">
            {filteredWorks.slice(0, visibleCount).map((work, index) => (
              <WorkArchiveEntry
                key={work.id || work.slug || `${work.titleEn}-${index}`}
                work={work}
                index={index}
                mr={mr}
                onSelect={() => setSelectedWork(work)}
              />
            ))}
          </div>
        ) : (
          <p className="archive-empty">
            {loading
              ? mr
                ? "कामे लोड होत आहेत..."
                : "Loading works..."
              : loadFailed
                ? mr
                  ? "विकासकामांची माहिती सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा."
                  : "Development works are temporarily unavailable. Please try again later."
                : !visibleWorks.length
                  ? mr
                    ? "सध्या कोणतेही विकासकाम प्रकाशित नाही."
                    : "No development works have been published yet."
                  : mr
                    ? "या शोधासाठी कोणतेही काम सापडले नाही."
                    : "No works match your search."}
          </p>
        )}

        {visibleCount < filteredWorks.length && (
          <div className="archive-load-more">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="civic-button civic-button-secondary"
            >
              {mr ? "आणखी कामे पहा" : "Show more works"} ↓
            </button>
            <p>
              {mr
                ? `${filteredWorks.length} पैकी ${Math.min(visibleCount, filteredWorks.length)} दाखवत आहे`
                : `Showing ${Math.min(visibleCount, filteredWorks.length)} of ${filteredWorks.length}`}
            </p>
          </div>
        )}
      </div>

      {selectedWork && (
        <WorkDetailModal
          work={selectedWork}
          mr={mr}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

function workText(work, field, mr) {
  return mr ? work[field + "Mr"] || work[field + "En"] : work[field + "En"];
}

function WorkArchiveEntry({ work, index, mr, onSelect }) {
  const title = workText(work, "title", mr);
  const highlights =
    (mr ? work.highlightsMr || work.highlightsEn : work.highlightsEn) || [];

  return (
    <article
      className={`archive-project ${index === 0 ? "archive-project-featured" : ""}`}
    >
      <header className="archive-project-heading">
        <div>
          <p className="archive-category">{workText(work, "category", mr)}</p>
          <h2>{title}</h2>
          <p className="archive-project-location">
            {workText(work, "location", mr)}
          </p>
        </div>
      </header>
      <div className="archive-project-body">
        <button
          type="button"
          onClick={onSelect}
          className="archive-comparison-button"
          aria-label={`${mr ? "मोठे फोटो पहा" : "View larger photos"}: ${title}`}
        >
          <ComparisonPair work={work} mr={mr} featured={index === 0} />
        </button>
        <div className="archive-project-copy">
          <p>{workText(work, "description", mr)}</p>
          {highlights.length > 0 && (
            <ul>
              {highlights.slice(0, index === 0 ? 4 : 2).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
          <p className="archive-project-status">
            {workText(work, "status", mr)}
          </p>
          <button
            type="button"
            onClick={onSelect}
            className="civic-text-action"
          >
            {mr ? "कामाची माहिती पहा" : "View work details"} <span>→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function ComparisonPair({ work, mr, featured = false, full = false }) {
  const title = workText(work, "title", mr);
  return (
    <span
      className={`archive-comparison-pair ${full ? "archive-comparison-full" : ""}`}
    >
      <ComparisonImage
        image={work.beforeImage}
        alt={`${title} — ${mr ? "पूर्वी" : "Before"}`}
        label={mr ? "पूर्वी" : "Before"}
        priority={featured}
        full={full}
      />
      <ComparisonImage
        image={work.afterImage}
        alt={`${title} — ${mr ? "नंतर" : "After"}`}
        label={mr ? "नंतर" : "After"}
        priority={featured}
        full={full}
      />
    </span>
  );
}

function ComparisonImage({ image, alt, label, priority, full }) {
  if (!image) return null;
  return (
    <span className="archive-comparison-image">
      <span className="archive-image-frame">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          unoptimized={String(image).startsWith("http")}
          sizes={
            full
              ? "(max-width: 767px) 100vw, 45vw"
              : "(max-width: 479px) 100vw, (max-width: 1023px) 45vw, 30vw"
          }
          className="archive-work-image"
        />
      </span>
      <span className="archive-image-label">{label}</span>
    </span>
  );
}

function WorkDetailModal({ work, mr, onClose }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const title = workText(work, "title", mr);
  const highlights =
    (mr ? work.highlightsMr || work.highlightsEn : work.highlightsEn) || [];

  useEffect(() => {
    const ownerDocument = dialog.current?.ownerDocument || document;
    const previousFocus = ownerDocument.activeElement;
    const previousOverflow = ownerDocument.body.style.overflow;
    ownerDocument.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const controls = [
          ...dialog.current.querySelectorAll('button, a[href], [tabindex="0"]'),
        ].filter((node) => node.getClientRects().length);
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && ownerDocument.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && ownerDocument.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    ownerDocument.addEventListener("keydown", onKeyDown);
    return () => {
      ownerDocument.body.style.overflow = previousOverflow;
      ownerDocument.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="archive-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialog}
        className="archive-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-dialog-title"
      >
        <header>
          <div>
            <p className="archive-category">{workText(work, "category", mr)}</p>
            <h2 id="archive-dialog-title">{title}</h2>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label={mr ? "बंद करा" : "Close"}
          >
            <FiX />
          </button>
        </header>
        <div className="archive-modal-body">
          <ComparisonPair work={work} mr={mr} full />
          <div className="archive-modal-details">
            <div>
              <p className="archive-project-location">
                {workText(work, "location", mr)}
              </p>
              <p className="archive-project-status">
                {workText(work, "status", mr)}
              </p>
            </div>
            <div>
              <p>{workText(work, "description", mr)}</p>
              {highlights.length > 0 && (
                <ul>
                  {highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
