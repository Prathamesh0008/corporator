"use client";
import { useEffect, useRef } from "react";
export function Notice({ error, message }) {
  return (
    <>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="admin-success">
          {message}
        </p>
      )}
    </>
  );
}
export function Pager({ page, pages, total, onChange }) {
  return (
    <div className="admin-pager">
      <span>
        {total} records · Page {page} of {pages}
      </span>
      <div>
        <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  const closeHandler = useRef(onClose);
  useEffect(() => {
    closeHandler.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    const root = ref.current;
    root?.focus();
    const key = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeHandler.current();
      }
      if (event.key === "Tab") {
        const nodes = [
          ...root.querySelectorAll(
            'button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),a[href],[tabindex="0"]',
          ),
        ].filter((el) => el.getClientRects().length);
        const first = nodes[0],
          last = nodes.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === root)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    root.addEventListener("keydown", key);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      root.removeEventListener("keydown", key);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <div className="admin-modal-backdrop">
      <section
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="admin-modal"
      >
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close editor">
            Close
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
export const dateLabel = (value) =>
  value && !Number.isNaN(Date.parse(value))
    ? new Date(value).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
