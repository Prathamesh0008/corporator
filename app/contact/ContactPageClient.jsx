"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FiCheckCircle, FiSend } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../../components/LeafletMap"), {
  ssr: false,
});

export default function ContactPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    website: "",
  });
  const [state, setState] = useState({
    loading: false,
    error: "",
    sent: false,
  });
  const submission = useRef(null);
  const inFlight = useRef(false);
  const update = (key) => (e) =>
    setForm((old) => ({ ...old, [key]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    const payload = JSON.stringify(form);
    if (!submission.current || submission.current.payload !== payload)
      submission.current = { payload, key: globalThis.crypto?.randomUUID?.() };
    setState({ loading: true, error: "", sent: false });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(submission.current.key
            ? { "Idempotency-Key": submission.current.key }
            : {}),
        },
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send message.");
      submission.current = null;
      setForm({ name: "", phone: "", email: "", message: "", website: "" });
      setState({ loading: false, error: "", sent: true });
    } catch (error) {
      setState({ loading: false, error: error.message, sent: false });
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <div className="contact-editorial" lang={language}>
      <h1 className="sr-only">
        {mr ? "नगरसेवक कार्यालय" : "Corporator Office"}
      </h1>

      <section className="contact-editorial-main">
        <div className="editorial-container contact-office-layout">
          <aside
            className="contact-office-details"
            aria-labelledby="office-address-title"
          >
            <h2 id="office-address-title">
              {mr ? "कार्यालय पत्ता" : "Office address"}
            </h2>
            <address>
              <p>
                {mr
                  ? "वॉर्ड २४, नेरूळ, नवी मुंबई"
                  : "Ward 24(D), Nerul, Navi Mumbai"}
              </p>
              <p lang="en">
                Ground Floor, 58, Shambhu Marg, near Om shiv shambhu mandi,
                Nerul West, Nerul, Navi Mumbai, Maharashtra 400706
              </p>
            </address>
            <div className="contact-office-map">
              <LeafletMap
                center={[19.0347, 73.0111]}
                zoom={15}
                title={mr ? "कार्यालय पत्ता" : "Office address"}
              />
            </div>
          </aside>

          <form
            onSubmit={submit}
            className="contact-editorial-form"
            aria-labelledby="contact-form-title"
            aria-busy={state.loading}
          >
            <h2 id="contact-form-title">
              {mr ? "सामान्य संदेश पाठवा" : "Send a General Message"}
            </h2>
            <div className="contact-form-fields">
              <label>
                <span>{mr ? "पूर्ण नाव *" : "Full name *"}</span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                />
              </label>
              <label>
                <span>{mr ? "मोबाईल नंबर *" : "Mobile number *"}</span>
                <input
                  name="phone"
                  required
                  inputMode="numeric"
                  autoComplete="tel"
                  minLength={10}
                  maxLength={15}
                  value={form.phone}
                  onChange={update("phone")}
                />
              </label>
              <label className="contact-field-wide">
                <span>{mr ? "ईमेल (ऐच्छिक)" : "Email (optional)"}</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                />
              </label>
              <label className="contact-field-wide">
                <span>{mr ? "संदेश *" : "Message *"}</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  value={form.message}
                  onChange={update("message")}
                />
              </label>
              <label hidden aria-hidden="true">
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update("website")}
                />
              </label>
            </div>
            {state.error && (
              <p role="alert" className="contact-form-error">
                {state.error}
              </p>
            )}
            {state.sent && (
              <p role="status" className="contact-form-success">
                <FiCheckCircle aria-hidden="true" />
                {mr ? "संदेश पाठवला आहे." : "Message sent."}
              </p>
            )}
            <button
              type="submit"
              disabled={state.loading}
              className="civic-button contact-form-submit"
            >
              <FiSend aria-hidden="true" />
              {state.loading
                ? mr
                  ? "पाठवत आहे..."
                  : "Sending..."
                : mr
                  ? "संदेश पाठवा"
                  : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <section className="contact-quick-help">
        <div className="editorial-container">
          <p>
            {mr
              ? "नागरी समस्येसाठी तक्रार नोंदवा आणि तक्रार क्रमांकाने स्थिती तपासा."
              : "For a civic issue, register a complaint and use your complaint ID to track progress."}
          </p>
          <div>
            <Link href="/complaints#register">
              {mr ? "समस्या नोंदवा" : "Report Issue"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/complaints#track">
              {mr ? "तक्रार तपासा" : "Track Complaint"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
