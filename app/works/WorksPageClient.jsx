"use client";

import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiEye,
  FiMapPin,
  FiTool,
} from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import BeforeAfterShowcase from "../../components/BeforeAfterShowcase";
import { workItems } from "../../components/workData";

export default function WorksPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";

  const completedWorks = workItems.filter(
    (work) =>
      work.statusEn?.toLowerCase() === "completed"
  ).length;

  const stages = [
    {
      icon: <FiClipboard />,
      titleEn: "Issue received",
      titleMr: "समस्या प्राप्त",
      textEn:
        "Citizens report a civic issue with its location and details.",
      textMr:
        "नागरिक ठिकाण आणि माहितीसह नागरी समस्या नोंदवतात.",
    },
    {
      icon: <FiMapPin />,
      titleEn: "Location inspection",
      titleMr: "ठिकाणाची तपासणी",
      textEn:
        "The reported location and required work are inspected.",
      textMr:
        "नोंदवलेल्या ठिकाणाची आणि आवश्यक कामाची तपासणी केली जाते.",
    },
    {
      icon: <FiClock />,
      titleEn: "Department follow-up",
      titleMr: "विभागाकडे पाठपुरावा",
      textEn:
        "The responsible municipal department is contacted and followed up.",
      textMr:
        "संबंधित महानगरपालिका विभागाशी संपर्क साधून पाठपुरावा केला जातो.",
    },
    {
      icon: <FiTool />,
      titleEn: "Work begins",
      titleMr: "काम सुरू",
      textEn:
        "Repair or development work begins at the reported location.",
      textMr:
        "नोंदवलेल्या ठिकाणी दुरुस्ती किंवा विकासकाम सुरू केले जाते.",
    },
    {
      icon: <FiCheckCircle />,
      titleEn: "Work completed",
      titleMr: "काम पूर्ण",
      textEn:
        "The completed work is inspected and its information is updated.",
      textMr:
        "पूर्ण झालेले काम तपासून त्याची माहिती अद्ययावत केली जाते.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-[#082f49] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#082f49] via-[#0b4565] to-[#061f30]" />

        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-green-500/15 blur-3xl" />

        <div className="container-responsive relative px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            

            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              {mr
                ? "वॉर्डमध्ये पूर्ण झालेली विकासकामे"
                : "Civic Works Completed in the Ward"}
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100">
              {mr
                ? "रस्ता दुरुस्ती, गटार दुरुस्ती, पथदिवे, पदपथ आणि इतर नागरी कामांची माहिती कामापूर्वी आणि कामानंतरच्या फोटोंसह पाहा."
                : "View road repairs, drainage repairs, streetlight work, footpath repairs and other civic works with before and after photographs."}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#completed-works"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-700"
              >
                <FiEye />
                {mr ? "पूर्ण कामे पहा" : "View Completed Works"}
                <FiArrowRight />
              </a>

              <Link
                href="/complaints#register"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-white/70 bg-white/10 px-7 font-black text-white backdrop-blur transition hover:bg-white hover:text-[#082f49]"
              >
                <FiAlertCircle />
                {mr ? "समस्या नोंदवा" : "Report an Issue"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="section-padding">
        <div className="container-responsive">
          {/* Statistics */}
          <section className="-mt-8 relative z-10 grid gap-5 md:grid-cols-3">
            <InfoCard
              icon={<FiCheckCircle />}
              value={`${completedWorks}+`}
              title={mr ? "पूर्ण झालेली कामे" : "Completed Works"}
              description={
                mr
                  ? "वॉर्डमध्ये पूर्ण झालेल्या नागरी कामांची माहिती."
                  : "Information about completed civic works in the ward."
              }
              iconClass="bg-green-100 text-green-700"
            />

            <InfoCard
              icon={<FiMapPin />}
              value="24(D)"
              title={mr ? "वॉर्ड क्षेत्र" : "Ward Area"}
              description={
                mr
                  ? "वॉर्ड २४(ड), नेरूळमधील स्थानिक विकासकामे."
                  : "Local development works from Ward 24(D), Nerul."
              }
              iconClass="bg-blue-100 text-blue-700"
            />

            <InfoCard
              icon={<FiEye />}
              value="100%"
              title={mr ? "पारदर्शक माहिती" : "Transparent Information"}
              description={
                mr
                  ? "कामापूर्वी आणि कामानंतरचे स्पष्ट फोटो."
                  : "Clear before and after photographs of every work."
              }
              iconClass="bg-orange-100 text-orange-700"
            />
          </section>

          {/* Multiple works */}
          <div
            id="completed-works"
            className="scroll-mt-28"
          >
            <BeforeAfterShowcase mr={mr} />
          </div>

          {/* Work process */}
          <section className="mt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-700">
                {mr ? "कामाची प्रक्रिया" : "HOW THE WORK IS DONE"}
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                {mr
                  ? "समस्या नोंदवल्यापासून काम पूर्ण होईपर्यंत"
                  : "From Reported Issue to Completed Work"}
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {mr
                  ? "नागरिकांनी नोंदवलेल्या समस्येवर संबंधित विभागाशी पाठपुरावा करून काम पूर्ण केले जाते."
                  : "Reported civic issues are inspected, followed up with the responsible department and taken through to completion."}
              </p>
            </div>

            <ol className="relative mt-10 grid gap-5 md:grid-cols-5">
              <div
                aria-hidden="true"
                className="absolute left-[10%] right-[10%] top-7 hidden h-0.5 bg-orange-200 md:block"
              />

              {stages.map((stage, index) => (
                <li
                  key={stage.titleEn}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                >
                  <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-xl text-white shadow-md">
                    {stage.icon}
                  </span>

                  <span className="mt-4 block text-xs font-black uppercase tracking-[0.15em] text-orange-700">
                    {mr
                      ? `टप्पा ${index + 1}`
                      : `STEP ${index + 1}`}
                  </span>

                  <h3 className="mt-2 text-lg font-black text-slate-900">
                    {mr ? stage.titleMr : stage.titleEn}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {mr ? stage.textMr : stage.textEn}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Complaint CTA */}
          <section className="relative mt-16 overflow-hidden rounded-[32px] bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-10 text-center text-white shadow-xl sm:px-10 lg:py-12">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-black/10" />

            <div className="relative mx-auto max-w-3xl">
              <FiAlertCircle className="mx-auto h-12 w-12" />

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                {mr
                  ? "आपल्या परिसरात नागरी समस्या आहे?"
                  : "Is There a Civic Issue in Your Area?"}
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-orange-50">
                {mr
                  ? "रस्ता, गटार, पथदिवे, पदपथ किंवा इतर नागरी समस्या अचूक ठिकाण आणि फोटोसह नोंदवा."
                  : "Report road, drainage, streetlight, footpath or other civic issues with the exact location and a photograph."}
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/complaints#register"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 font-black text-orange-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <FiAlertCircle />
                  {mr ? "समस्या नोंदवा" : "Report an Issue"}
                </Link>

                <Link
                  href="/complaints#track"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-white bg-white/10 px-7 font-black text-white transition hover:bg-white hover:text-orange-700"
                >
                  <FiEye />
                  {mr ? "स्थिती तपासा" : "Track Status"}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  value,
  title,
  description,
  iconClass,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${iconClass}`}
        >
          {icon}
        </span>

        <span className="text-3xl font-black text-slate-900">
          {value}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-black text-slate-900">
        {title}
      </h2>

      <p className="mt-2 leading-7 text-slate-600">
        {description}
      </p>
    </article>
  );
}