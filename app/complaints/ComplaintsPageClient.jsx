"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCheckCircle, FiCopy, FiSearch } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

const initialForm = { name: "", phone: "", address: "", ward: "24(D)", complaintType: "", location: "", description: "", urgency: "normal", website: "" };
const types = [
  ["Road / pothole / footpath", "रस्ता / खड्डा / पदपथ"],
  ["Water supply / leakage", "पाणीपुरवठा / गळती"],
  ["Garbage / cleanliness", "कचरा / स्वच्छता"],
  ["Drainage / sewer", "गटार / मलनिस्सारण"],
  ["Street light", "पथदिवा"],
  ["Public toilet", "सार्वजनिक स्वच्छतागृह"],
  ["Garden / public space", "उद्यान / सार्वजनिक जागा"],
  ["Other civic issue", "इतर नागरी समस्या"],
];
const progressSteps = [
  ["Submitted", "तक्रार नोंदवली"],
  ["Under Review", "तपासणी सुरू"],
  ["In Progress", "कार्यवाही सुरू"],
  ["Resolved", "निराकरण झाले"],
];
const statusLabels = { ...Object.fromEntries(progressSteps), Rejected: "तक्रार नाकारली" };

function scrollToElement(element) {
  element?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

function dateText(value, mr) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString(mr ? "mr-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ComplaintsPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const [form, setForm] = useState(initialForm);
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complaintId, setComplaintId] = useState("");
  const [copyState, setCopyState] = useState("");
  const [trackId, setTrackId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [result, setResult] = useState(null);
  const photoInput = useRef(null);
  const photoReader = useRef(null);
  const successHeading = useRef(null);
  const trackInput = useRef(null);
  const submission = useRef(null);
  const inFlight = useRef(false);

  useEffect(() => {
    if (complaintId) {
      successHeading.current?.focus({ preventScroll: true });
      scrollToElement(successHeading.current);
    }
  }, [complaintId]);

  useEffect(() => () => {
    if (photoReader.current?.readyState === 1) photoReader.current.abort();
  }, []);

  const update = key => event => setForm(old => ({ ...old, [key]: event.target.value }));

  const clearPhoto = () => {
    if (photoReader.current?.readyState === 1) photoReader.current.abort();
    setPhotoDataUrl("");
    setPhotoName("");
    setReadingPhoto(false);
    if (photoInput.current) photoInput.current.value = "";
  };

  const choosePhoto = event => {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    if (photoReader.current?.readyState === 1) photoReader.current.abort();
    setPhotoDataUrl("");
    setPhotoName("");
    setReadingPhoto(false);
    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return setError(mr ? "फक्त फोटो निवडा." : "Please choose an image file.");
    }
    if (file.size > 1_500_000) {
      event.target.value = "";
      return setError(mr ? "फोटो १.५ MB पेक्षा लहान असावा." : "Photo must be smaller than 1.5 MB.");
    }
    const reader = new FileReader();
    photoReader.current = reader;
    setReadingPhoto(true);
    reader.onload = () => {
      setPhotoDataUrl(String(reader.result || ""));
      setPhotoName(file.name);
      setReadingPhoto(false);
    };
    reader.onerror = () => {
      setReadingPhoto(false);
      setError(mr ? "फोटो वाचता आला नाही. कृपया पुन्हा निवडा." : "Could not read the photo. Please choose it again.");
    };
    reader.readAsDataURL(file);
  };

  const submit = async event => {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setError("");
    try {
      const payload = JSON.stringify({ ...form, photoDataUrl });
      if (submission.current?.payload !== payload) submission.current = { payload, key: crypto.randomUUID() };
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submission.current.key },
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (mr ? "तक्रार पाठवता आली नाही." : "Could not submit complaint."));
      setComplaintId(data.complaintId);
      submission.current = null;
      setCopyState("");
      setForm(initialForm);
      clearPhoto();
    } catch (err) {
      setError(err.message);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  const lookupComplaint = async id => {
    setTracking(true);
    setTrackError("");
    setResult(null);
    try {
      const response = await fetch(`/api/complaints?complaintId=${encodeURIComponent(id.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (mr ? "तक्रार सापडली नाही." : "Complaint not found."));
      setResult(data.complaint);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setTracking(false);
    }
  };

  const track = event => {
    event.preventDefault();
    lookupComplaint(trackId);
  };

  const trackThisComplaint = () => {
    setTrackId(complaintId);
    trackInput.current?.focus({ preventScroll: true });
    scrollToElement(document.getElementById("track"));
    lookupComplaint(complaintId);
  };

  const copyComplaintId = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(complaintId);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const reportAnother = () => {
    setComplaintId("");
    setCopyState("");
    setError("");
    requestAnimationFrame(() => {
      document.getElementById("complaint-name")?.focus({ preventScroll: true });
      scrollToElement(document.getElementById("register"));
    });
  };

  const nextSteps = [
    ["Submit issue", "समस्या नोंदवा", "Share the details and location.", "समस्या आणि ठिकाणाची माहिती द्या."],
    ["Receive complaint ID", "तक्रार क्रमांक मिळवा", "Keep the number for future reference.", "पुढील संदर्भासाठी क्रमांक जतन करा."],
    ["Office follow-up", "कार्यालय पाठपुरावा करेल", "The office coordinates with the relevant department.", "कार्यालय संबंधित विभागाशी समन्वय करेल."],
    ["Track resolution", "कार्यवाहीची स्थिती पहा", "Use your complaint ID to check updates.", "तक्रार क्रमांक वापरून अपडेट्स पहा."],
  ];

  return (
    <div className="complaint-service" lang={language}>
      <h1 className="sr-only">{mr ? "नागरी समस्या नोंदवा" : "Report a Civic Issue"}</h1>

      <div className="editorial-container">
        <section id="register" className="complaint-register">
          {complaintId ? (
            <div className="complaint-success">
              <p className="complaint-success-label"><FiCheckCircle aria-hidden="true" />{mr ? "तक्रार नोंदवली आहे" : "Complaint Registered"}</p>
              <h2 ref={successHeading} tabIndex={-1}>{mr ? "आपला तक्रार क्रमांक" : "Your complaint number"}</h2>
              <p className="complaint-success-id">{complaintId}</p>
              <p className="complaint-muted">{mr ? "हा क्रमांक लिहून ठेवा किंवा त्याचा फोटो घ्या." : "Write down this number or take a screenshot."}</p>
              <div className="complaint-success-actions">
                <button type="button" onClick={copyComplaintId} className="civic-button civic-button-secondary"><FiCopy aria-hidden="true" />{mr ? "तक्रार क्रमांक कॉपी करा" : "Copy Complaint ID"}</button>
                <button type="button" onClick={trackThisComplaint} disabled={tracking} className="civic-button">{mr ? "ही तक्रार तपासा" : "Track This Complaint"}</button>
                <button type="button" onClick={reportAnother} className="civic-text-action">{mr ? "दुसरी तक्रार नोंदवा" : "Report Another Issue"} <span>→</span></button>
              </div>
              <p className="complaint-copy-feedback" role="status">{copyState === "copied" ? (mr ? "तक्रार क्रमांक कॉपी केला." : "Complaint ID copied.") : copyState === "failed" ? (mr ? "कॉपी करता आले नाही. वरील क्रमांक निवडून कॉपी करा." : "Could not copy automatically. Select and copy the number above.") : ""}</p>
              <p className="complaint-followup-note">{mr ? "कार्यालय तक्रार तपासून संबंधित महानगरपालिका विभागाशी पाठपुरावा करेल. हा आपत्कालीन प्रतिसादाचा हमी कालावधी नाही." : "The office will review the complaint and follow up with the relevant municipal department. This is not an emergency response guarantee."}</p>
            </div>
          ) : (
            <div className="complaint-form-surface">
              <header className="complaint-form-heading">
                <h2>{mr ? "तक्रार नोंदणी" : "Complaint Form"}</h2>
                <p>{mr ? "* असलेली माहिती आवश्यक आहे. वॉर्ड आपोआप२४ राहील." : "Fields marked * are required. Ward 24(D) is assigned automatically."}</p>
              </header>
              <form onSubmit={submit} aria-busy={submitting}>
                <fieldset>
                  <legend>{mr ? "आपली माहिती" : "Your Details"}</legend>
                  <div className="complaint-fields">
                    <Field label={`${t("complaints.name", language)} *`}><input id="complaint-name" name="name" required autoComplete="name" value={form.name} onChange={update("name")} /></Field>
                    <Field label={`${t("complaints.phone", language)} *`}><input name="phone" required inputMode="numeric" autoComplete="tel" minLength={10} maxLength={15} value={form.phone} onChange={update("phone")} placeholder={mr ? "१० अंकी मोबाईल नंबर" : "10 digit mobile number"} /></Field>
                    <Field label={`${t("complaints.address", language)} (${mr ? "ऐच्छिक" : "optional"})`} wide><input name="address" autoComplete="street-address" value={form.address} onChange={update("address")} /></Field>
                  </div>
                </fieldset>
                <fieldset>
                  <legend>{mr ? "समस्येची माहिती" : "Issue Details"}</legend>
                  <p className="complaint-group-help">{mr ? "अचूक ठिकाण दिल्यास पाठपुरावा करणे सोपे होते." : "An exact location helps the office follow up."}</p>
                  <div className="complaint-fields">
                    <Field label={`${t("complaints.complaintType", language)} *`}><select name="complaintType" required value={form.complaintType} onChange={update("complaintType")}><option value="">{mr ? "प्रकार निवडा" : "Choose problem type"}</option>{types.map(([en, marathi]) => <option key={en} value={en}>{mr ? marathi : en}</option>)}</select></Field>
                    <Field label={`${mr ? "समस्येचे ठिकाण" : "Problem location"} *`}><input name="location" required value={form.location} onChange={update("location")} placeholder={mr ? "उदा. इमारत, रस्ता, जवळची खूण" : "Building, road, or nearby landmark"} /></Field>
                    <Field label={`${t("complaints.description", language)} *`} wide><textarea name="description" required rows={4} minLength={10} value={form.description} onChange={update("description")} placeholder={mr ? "काय समस्या आहे आणि ती कुठे दिसते ते साध्या शब्दांत लिहा." : "In simple words, tell us what is wrong and where you see it."} /></Field>
                    <div hidden aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} /></label></div>
                  </div>
                </fieldset>
                <div className="complaint-photo-upload">
                  <label htmlFor="photo">{t("complaints.uploadPhoto", language)}</label>
                  <p id="photo-help">{mr ? "JPG, PNG किंवा WEBP · कमाल १.५ MB" : "JPG, PNG or WEBP · max 1.5 MB"}</p>
                  <input ref={photoInput} id="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} aria-describedby="photo-help" />
                  <div role="status">
                    {readingPhoto && <p>{mr ? "फोटो जोडत आहे..." : "Adding photo..."}</p>}
                    {photoDataUrl && <p className="complaint-photo-confirmation"><FiCheck aria-hidden="true" />{mr ? "फोटो जोडला" : "Photo added"}: {photoName}<button type="button" onClick={clearPhoto}>{mr ? "काढा" : "Remove"}</button></p>}
                  </div>
                </div>
                {error && <p role="alert" className="complaint-error">{error}</p>}
                <button type="submit" disabled={submitting || readingPhoto} className="civic-button complaint-submit">{submitting ? (mr ? "पाठवत आहे..." : "Sending...") : (mr ? "तक्रार पाठवा" : "Submit Complaint")}</button>
              </form>
            </div>
          )}
        </section>

        <section className="complaint-next" aria-labelledby="complaint-next-title">
          <h2 id="complaint-next-title">{mr ? "पुढे काय होईल?" : "What Happens Next"}</h2>
          <ol>{nextSteps.map(([en, marathi, detailEn, detailMr], index) => <li key={en}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{mr ? marathi : en}</h3><p>{mr ? detailMr : detailEn}</p></div></li>)}</ol>
        </section>

        <section className="complaint-emergency" aria-labelledby="complaint-emergency-title">
          <div><h2 id="complaint-emergency-title">{mr ? "तातडीची मदत?" : "Emergency?"}</h2><p>{mr ? "जीवितास धोका, गुन्हा, आग किंवा वैद्यकीय आपत्कालीन परिस्थितीसाठी ११२ वर कॉल करा. ही तक्रार सेवा आपत्कालीन सेवा नाही." : "For immediate danger, crime, fire or a medical emergency, call 112. This complaint service is not an emergency service."}</p></div>
          <a href="tel:112">{mr ? "११२ वर कॉल करा" : "Call 112"} ↗</a>
        </section>

        <section className="complaint-service-options" aria-label={mr ? "नागरिक सेवा" : "Citizen services"}>
          <div className="complaint-report-option">
            <h2>{mr ? "नवीन समस्या नोंदवा" : "Report a New Issue"}</h2>
            <p>{mr ? "काय घडले, कुठे घडले ते सांगा. शक्य असल्यास फोटो जोडा." : "Tell us what happened, where it happened, and add a photo if available."}</p>
            <a href="#register" className="civic-text-action">{mr ? "तक्रार सुरू करा" : "Start Complaint"} <span>→</span></a>
          </div>
          <div id="track" className="complaint-track-option">
            <h2>{mr ? "आधीची तक्रार तपासा" : "Track Existing Complaint"}</h2>
            <p>{mr ? "तक्रार नोंदवल्यानंतर मिळालेला क्रमांक टाका." : "Enter the number you received after submission."}</p>
            <form onSubmit={track} className="complaint-track-form" aria-busy={tracking}>
              <label htmlFor="tracking-id">{mr ? "तक्रार क्रमांक" : "Complaint ID"}</label>
              <div>
                <input ref={trackInput} id="tracking-id" required value={trackId} onChange={event => setTrackId(event.target.value.toUpperCase())} placeholder="CMP-123456" autoCapitalize="characters" spellCheck={false} aria-invalid={Boolean(trackError)} aria-describedby={trackError ? "tracking-error" : undefined} />
                <button type="submit" disabled={tracking} className="civic-button"><FiSearch aria-hidden="true" />{tracking ? (mr ? "तपासत आहे..." : "Tracking...") : (mr ? "तक्रार तपासा" : "Track Complaint")}</button>
              </div>
            </form>
            {trackError && <p id="tracking-error" role="alert" className="complaint-error">{trackError}</p>}
          </div>
        </section>

        {result && <TrackingResult result={result} mr={mr} />}
      </div>
    </div>
  );
}

function Field({ label, wide = false, children }) {
  return <label className={`complaint-field ${wide ? "complaint-field-wide" : ""}`}><span>{label}</span>{children}</label>;
}

function TrackingResult({ result, mr }) {
  const activeStep = progressSteps.findIndex(([status]) => status === result.status);
  const rejected = result.status === "Rejected";
  const issueType = types.find(([en]) => en === result.complaintType);
  const updated = dateText(result.updatedAt, mr);

  return (
    <section className="complaint-tracking-result" aria-labelledby="tracking-result-title" aria-live="polite">
      <header>
        <div><p className="complaint-muted">{mr ? "तक्रार क्रमांक" : "Complaint number"}</p><h2 id="tracking-result-title">{result.complaintId}</h2></div>
        <div><p className="complaint-muted">{mr ? "सध्याची स्थिती" : "Current status"}</p><p className={`complaint-current-status ${rejected ? "complaint-rejected-status" : ""}`}>{mr ? statusLabels[result.status] || result.status : result.status}</p></div>
      </header>
      {activeStep >= 0 && <ol className="complaint-progress" aria-label={mr ? "तक्रारीची प्रगती" : "Complaint progress"}>
        {progressSteps.map(([en, marathi], index) => <li key={en} className={index < activeStep ? "is-complete" : index === activeStep ? "is-current" : ""} aria-current={index === activeStep ? "step" : undefined}><span className="complaint-progress-marker" aria-hidden="true">{index < activeStep ? <FiCheck /> : ""}</span><span>{mr ? marathi : en}</span></li>)}
      </ol>}
      {rejected && <p className="complaint-rejected-note">{mr ? "ही तक्रार नाकारण्यात आली आहे. उपलब्ध कारण किंवा अधिक माहितीसाठी खालील कार्यालयाचे अपडेट्स पहा." : "This complaint has been rejected. See the office updates below for any reason or further information."}</p>}
      <dl className="complaint-result-facts">
        <div><dt>{mr ? "समस्येचा प्रकार" : "Issue type"}</dt><dd>{mr ? issueType?.[1] || result.complaintType : result.complaintType}</dd></div>
        <div><dt>{mr ? "ठिकाण" : "Location"}</dt><dd>{result.location}</dd></div>
        {updated && <div><dt>{mr ? "शेवटचे अपडेट" : "Last updated"}</dt><dd><time dateTime={new Date(result.updatedAt).toISOString()}>{updated}</time></dd></div>}
      </dl>
      <section className="complaint-office-updates" aria-labelledby="office-updates-title">
        <h3 id="office-updates-title">{mr ? "कार्यालयाकडून अपडेट्स" : "Office Updates"}</h3>
        {result.comments?.length ? <ol>{result.comments.map((comment, index) => {
          const date = dateText(comment.createdAt, mr);
          return <li key={`${comment.createdAt}-${index}`}>{date && <time dateTime={new Date(comment.createdAt).toISOString()}>{date}</time>}<p>{comment.text}</p></li>;
        })}</ol> : <p className="complaint-muted">{mr ? "कार्यालयाकडून अद्याप कोणतेही अपडेट नाही." : "No office updates have been posted yet."}</p>}
      </section>
    </section>
  );
}
