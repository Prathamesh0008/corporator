"use client";

import { useState } from "react";
import { FiAlertCircle, FiCamera, FiCheckCircle, FiCopy, FiMapPin, FiSearch, FiSend, FiUser } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

const initialForm = { name: "", phone: "", address: "", ward: "24(D)", complaintType: "", location: "", description: "", urgency: "normal", website: "" };

export default function ComplaintsPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const [form, setForm] = useState(initialForm);
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complaintId, setComplaintId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState("");
  const [result, setResult] = useState(null);

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

  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }));

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError(mr ? "फक्त फोटो निवडा." : "Please choose an image file.");
    if (file.size > 1_500_000) return setError(mr ? "फोटो १.५ MB पेक्षा लहान असावा." : "Photo must be smaller than 1.5 MB.");
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/complaints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, photoDataUrl }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit complaint.");
      setComplaintId(data.complaintId); setForm(initialForm); setPhotoDataUrl("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  const track = async (event) => {
    event.preventDefault(); setTracking(true); setTrackError(""); setResult(null);
    try {
      const response = await fetch(`/api/complaints?complaintId=${encodeURIComponent(trackId.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Complaint not found.");
      setResult(data.complaint);
    } catch (err) { setTrackError(err.message); } finally { setTracking(false); }
  };

  if (complaintId) return (
    <section className="section-padding min-h-[70vh] bg-green-50">
      <div className="mx-auto max-w-xl rounded-3xl border border-green-200 bg-white p-7 text-center shadow-xl sm:p-10">
        <FiCheckCircle className="mx-auto h-20 w-20 text-green-600" />
        <h1 className="mt-5 text-3xl font-black">{mr ? "तक्रार नोंदवली आहे" : "Complaint registered"}</h1>
        <p className="mt-3 text-lg text-slate-600">{mr ? "हा क्रमांक लिहून ठेवा किंवा त्याचा फोटो घ्या." : "Write down this number or take a screenshot."}</p>
        <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-2xl font-black tracking-wide text-white">{complaintId}</div>
        <button onClick={() => navigator.clipboard?.writeText(complaintId)} className="mt-3 inline-flex items-center gap-2 font-bold text-blue-700"><FiCopy /> {mr ? "क्रमांक कॉपी करा" : "Copy number"}</button>
        <p className="mt-6 rounded-xl bg-blue-50 p-4 text-left text-blue-950">{mr ? "कार्यालय तक्रार तपासून संबंधित महानगरपालिका विभागाशी पाठपुरावा करेल. हा आपत्कालीन प्रतिसादाचा हमी कालावधी नाही." : "The office will review the complaint and follow up with the relevant municipal department. This is not an emergency response guarantee."}</p>
        <button onClick={() => setComplaintId("")} className="complaint-cta mt-6">{mr ? "दुसरी तक्रार नोंदवा" : "Register another complaint"}</button>
      </div>
    </section>
  );

  return (
    <div className="bg-slate-50">
      <section className="bg-[#082f49] px-4 py-12 text-center text-white">
        <p className="font-bold text-orange-300">{mr ? "वॉर्ड २४(ड), नेरूळ" : "WARD 24(D), NERUL"}</p>
        <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-black text-white sm:text-5xl">{t("complaints.title", language)}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">{mr ? "रस्ता, पाणी, कचरा, गटार किंवा पथदिव्याची समस्या असल्यास खाली माहिती भरा." : "For roads, water, garbage, drains, street lights, and other ward civic issues, fill in the simple form below."}</p>
      </section>

      <section id="register" className="section-padding scroll-mt-24">
        <form onSubmit={submit} className="container-responsive grid gap-7 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center gap-3"><span className="step-badge">1</span><div><h2 className="text-2xl font-black">{mr ? "आपली माहिती" : "Your details"}</h2><p className="text-slate-600">{mr ? "* असलेली माहिती आवश्यक आहे." : "Fields marked * are required."}</p></div></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={`${t("complaints.name", language)} *`} icon={<FiUser />}><input required autoComplete="name" value={form.name} onChange={update("name")} /></Field>
              <Field label={`${t("complaints.phone", language)} *`}><input required inputMode="numeric" autoComplete="tel" minLength={10} maxLength={15} value={form.phone} onChange={update("phone")} placeholder="10 digit mobile number" /></Field>
              <Field label={t("complaints.address", language)} wide><input autoComplete="street-address" value={form.address} onChange={update("address")} /></Field>
            </div>

            <div className="my-8 border-t border-slate-200" />
            <div className="mb-7 flex items-center gap-3"><span className="step-badge">2</span><div><h2 className="text-2xl font-black">{mr ? "समस्येची माहिती" : "Problem details"}</h2><p className="text-slate-600">{mr ? "अचूक ठिकाण दिल्यास पाठपुरावा करणे सोपे होते." : "An exact location helps the office follow up."}</p></div></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={`${t("complaints.complaintType", language)} *`}><select required value={form.complaintType} onChange={update("complaintType")}><option value="">{mr ? "प्रकार निवडा" : "Choose problem type"}</option>{types.map(([en, marathi]) => <option key={en} value={en}>{mr ? marathi : en}</option>)}</select></Field>
              <Field label={`${mr ? "समस्येचे ठिकाण" : "Problem location"} *`} icon={<FiMapPin />}><input required value={form.location} onChange={update("location")} placeholder={mr ? "उदा. इमारत, रस्ता, जवळची खूण" : "Building, road, or nearby landmark"} /></Field>
              <Field label={`${t("complaints.description", language)} *`} wide><textarea required rows={5} minLength={10} value={form.description} onChange={update("description")} placeholder={mr ? "काय समस्या आहे आणि ती कुठे दिसते ते साध्या शब्दांत लिहा." : "In simple words, tell us what is wrong and where you see it."} /></Field>
              <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} /></label></div>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center">
              <FiCamera className="mx-auto h-8 w-8 text-orange-600" /><label htmlFor="photo" className="mt-2 block cursor-pointer font-bold text-slate-900">{t("complaints.uploadPhoto", language)}</label><p className="text-sm text-slate-500">JPG, PNG or WEBP · max 1.5 MB</p>
              <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="mx-auto mt-3 block max-w-full text-sm" />
              {photoDataUrl && <p className="mt-2 font-bold text-green-700">✓ {mr ? "फोटो जोडला" : "Photo added"}</p>}
            </div>

            {error && <div role="alert" className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-800"><FiAlertCircle className="mt-1 shrink-0" />{error}</div>}
            <button disabled={submitting} className="complaint-cta mt-7 w-full justify-center text-lg disabled:opacity-60"><FiSend />{submitting ? (mr ? "पाठवत आहे..." : "Sending...") : t("complaints.submitComplaint", language)}</button>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl bg-blue-50 p-6"><h2 className="text-xl font-black text-blue-950">{mr ? "ही सेवा कशासाठी?" : "Use this for"}</h2><ul className="mt-4 space-y-3 text-blue-950">{types.slice(0, 6).map(([en, marathi]) => <li key={en} className="flex gap-2"><FiCheckCircle className="mt-1 shrink-0 text-green-600" />{mr ? marathi : en}</li>)}</ul></div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6"><h2 className="text-xl font-black text-red-900">{mr ? "तातडीची मदत?" : "Emergency?"}</h2><p className="mt-2 text-red-900">{mr ? "जीवितास धोका, गुन्हा, आग किंवा वैद्यकीय आपत्कालीन परिस्थितीसाठी ११२ वर कॉल करा." : "For danger to life, crime, fire, or a medical emergency, call 112."}</p><a href="tel:112" className="mt-4 inline-flex rounded-xl bg-red-700 px-5 py-3 text-xl font-black text-white">Call 112</a></div>
          </aside>
        </form>
      </section>

      <section id="track" className="section-padding scroll-mt-24 bg-white">
        <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">{mr ? "स्थिती तपासा" : "CHECK PROGRESS"}</p><h2 className="mt-2 text-3xl font-black">{mr ? "आपली तक्रार कुठपर्यंत आली?" : "Track your complaint"}</h2><p className="mt-2 text-slate-600">{mr ? "तक्रार नोंदवल्यानंतर मिळालेला क्रमांक टाका." : "Enter the number you received after submission."}</p>
          <form onSubmit={track} className="mt-6 flex flex-col gap-3 sm:flex-row"><input required value={trackId} onChange={(e) => setTrackId(e.target.value.toUpperCase())} className="form-control flex-1 uppercase" placeholder="COMP-YYYYMMDD-XXXXXX" /><button disabled={tracking} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 font-black text-white"><FiSearch />{tracking ? "..." : (mr ? "तपासा" : "Track")}</button></form>
          {trackError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-800">{trackError}</p>}
          {result && <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5 text-left"><p className="text-sm text-green-800">{mr ? "तक्रार क्रमांक" : "Complaint number"}</p><p className="text-xl font-black">{result.complaintId}</p><p className="mt-4 text-sm text-green-800">{mr ? "सध्याची स्थिती" : "Current status"}</p><p className="text-xl font-black">{result.status}</p><p className="mt-2 text-slate-700">{result.complaintType} · {result.location}</p></div>}
        </div>
      </section>
    </div>
  );
}

function Field({ label, icon, wide = false, children }) {
  return <label className={`block ${wide ? "sm:col-span-2" : ""}`}><span className="mb-2 flex items-center gap-2 font-bold text-slate-800">{icon}{label}</span><span className="field-wrap">{children}</span></label>;
}
