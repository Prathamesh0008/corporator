"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiCheckCircle, FiClock, FiMapPin, FiSearch } from "react-icons/fi";
import { GiRoad, GiStreetLight, GiWaterTank } from "react-icons/gi";
import { MdCleaningServices } from "react-icons/md";
import { useLanguage } from "../contexts/LanguageContext";
import HeroSection from "../components/home/HeroSection";
import HomepageSections from "../components/home/HomepageSections";
import PoliticalIdentitySections from "../components/home/PoliticalIdentitySections";
import HomeFaqSection from "../components/home/HomeFaqSection";

const LeafletMap = dynamic(() => import("../components/LeafletMap"), { ssr: false });
const wardBoundary = [
  [19.03687319007652, 73.01730963706083], [19.03724752853904, 73.01464766140126],
  [19.036977173067413, 73.01431766441888], [19.03712274914534, 73.01235968232166],
  [19.035521405268398, 73.01240368191935], [19.035708576128798, 73.00877371511157],
  [19.03820416744351, 73.0095657078692], [19.037966476044545, 73.00342980420871],
  [19.038706184326614, 72.99968498495792], [19.037385292019053, 72.99946143113189],
  [19.03606438961647, 72.9997409115723], [19.02861437821869, 73.00186477885936],
  [19.02171686628266, 73.00069648544019], [19.02118459785426, 73.00860544550233],
  [19.022223787010574, 73.00863225553647], [19.022097056973564, 73.00943655655894],
  [19.022198441010914, 73.01045533785538], [19.023339007170307, 73.0116885994245],
  [19.02346573626025, 73.01284143089131], [19.024302145831015, 73.01391383225473],
  [19.02306020283227, 73.01541519416466], [19.02199567287434, 73.01431598276722],
  [19.021285982448248, 73.01289505095951], [19.02029748001773, 73.01380659211836],
  [19.01905550709236, 73.01313634126626], [19.01824441772456, 73.01214437000394],
  [19.015050714865694, 73.01565648447263], [19.02115925169612, 73.02150107190792],
  [19.0236685026031, 73.01769404706423], [19.024783713067407, 73.01697017614396],
  [19.026177715622225, 73.01667526576779], [19.028357405266974, 73.01734551662116],
  [19.030486376846014, 73.01814981764372], [19.033654438802998, 73.01863239825846],
  [19.03462061412918, 73.0189872071181], [19.036758273946504, 73.0184941011488],
  [19.036886493553524, 73.01702469218523], [19.03687319007652, 73.01730963706083],
];

export default function HomePageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!showMap) return undefined;
    const close = (event) => event.key === "Escape" && setShowMap(false);
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [showMap]);

  const issues = [
    { icon: <GiRoad />, en: "Potholes & footpaths", mr: "खड्डे व पदपथ" },
    { icon: <GiWaterTank />, en: "Water supply", mr: "पाणीपुरवठा" },
    { icon: <GiStreetLight />, en: "Street lights", mr: "पथदिवे" },
    { icon: <MdCleaningServices />, en: "Garbage & drains", mr: "कचरा व गटारे" },
  ];

  const steps = [
    { icon: <FiCamera />, en: "Tell us the problem", mr: "समस्या सांगा", detailEn: "Add the location and a photo if possible.", detailMr: "ठिकाण आणि शक्य असल्यास फोटो जोडा." },
    { icon: <FiCheckCircle />, en: "Get a complaint number", mr: "तक्रार क्रमांक मिळवा", detailEn: "Save it to check your complaint later.", detailMr: "पुढे स्थिती पाहण्यासाठी तो जतन करा." },
    { icon: <FiClock />, en: "Office follows up", mr: "कार्यालय पाठपुरावा करेल", detailEn: "The ward office reviews and coordinates the issue.", detailMr: "वॉर्ड कार्यालय तक्रार पाहून संबंधित विभागाशी समन्वय करेल." },
    { icon: <FiSearch />, en: "Track the status", mr: "स्थिती तपासा", detailEn: "Use your complaint number on this website.", detailMr: "या संकेतस्थळावर तक्रार क्रमांक वापरा." },
  ];

  return (
    <div className="overflow-hidden bg-[#fffdf9]">
      <section className="relative h-[260px] overflow-hidden sm:h-[380px] lg:h-[690px]" aria-label={mr ? "मुख्य बॅनर" : "Main banner"}>
        <Image
          src="/main.png"
          alt={mr ? "सचिन देवप्पा लवटे मुख्य बॅनर" : "Sachin Devappa Lavate main banner"}
          fill
          priority
          className="object-contain "
          sizes="100vw"
        />
      </section>

      <section className="section-padding bg-white" aria-labelledby="issues-title">
        <div className="container-responsive">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{mr ? "आम्ही कशासाठी पाठपुरावा करतो" : "WHAT WE FOLLOW UP"}</p>
            <h2 id="issues-title" className="mt-2 text-3xl font-black sm:text-4xl">{mr ? "आपल्या परिसरातील रोजच्या समस्या" : "Everyday civic issues in your area"}</h2>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
            {issues.map((issue, index) => (
              <Link key={issue.en} href="/complaints#register" className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl" style={{ animationDelay: `${index * 80}ms` }}>
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl text-orange-600 transition group-hover:rotate-3 group-hover:scale-110">{issue.icon}</span>
                <span className="mt-3 block font-bold text-slate-800">{mr ? issue.mr : issue.en}</span>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl rounded-xl bg-blue-50 px-4 py-3 text-center text-sm text-blue-900">
            {mr ? "पोलीस, रुग्णवाहिका किंवा अग्निशमन आपत्कालीन मदतीसाठी कृपया ११२ वर कॉल करा. या संकेतस्थळावरील तक्रार सेवा आपत्कालीन सेवा नाही." : "For police, ambulance, or fire emergencies, call 112. This complaint service is not an emergency service."}
          </p>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-responsive">
          <div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow">{mr ? "अगदी सोपी पद्धत" : "A SIMPLE PROCESS"}</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">{mr ? "चार सोप्या टप्प्यांत तक्रार" : "Complaint help in four clear steps"}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">{mr ? "फॉर्म वाचायला आणि भरायला सोपा ठेवला आहे. आवश्यक ठिकाणी घरातील व्यक्तीची मदत घेऊ शकता." : "The form uses large labels and simple words. A family member can also help you submit it."}</p>
              <Link href="/complaints#register" className="complaint-cta mt-6">{mr ? "तक्रार सुरू करा" : "Start Your Complaint"} <FiArrowRight /></Link>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <li key={step.en} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b6e4f] text-xl font-black text-white">{index + 1}</span>
                    <div><h3 className="text-lg font-bold">{mr ? step.mr : step.en}</h3><p className="mt-1 leading-6 text-slate-600">{mr ? step.detailMr : step.detailEn}</p></div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
         
      </section>
       

      <section className="section-padding ">
        <div className="container-responsive space-y-8">
         
          <HomepageSections />
        </div>
      </section>

      <PoliticalIdentitySections />


      <section className="section-padding bg-white" aria-labelledby="ward-map-title">
        <div className="container-responsive">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="eyebrow">{mr ? "आपले सेवा क्षेत्र" : "OUR SERVICE AREA"}</p><h2 id="ward-map-title" className="mt-2 text-3xl font-black">{mr ? "वॉर्ड २४(ड), नेरूळ नकाशा" : "Ward 24(D), Nerul Map"}</h2><p className="mt-2 text-slate-600">{mr ? "नकाशावरील सीमा संदर्भासाठी दाखवली आहे." : "The ward boundary is shown for reference."}</p></div>
            <button type="button" onClick={() => setShowMap(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-blue-700 px-5 font-black text-blue-700 transition hover:bg-blue-700 hover:text-white"><FiMapPin />{mr ? "मोठा नकाशा उघडा" : "Open Large Map"}</button>
          </div>
          <div className="h-80 overflow-hidden rounded-3xl border border-slate-200 shadow-lg md:h-[430px]"><LeafletMap center={[19.0285, 73.012]} zoom={13} title={mr ? "वॉर्ड २४(ड), नेरूळ" : "Ward 24(D), Nerul"} boundary={wardBoundary} /></div>
        </div>
      </section>
      <HomeFaqSection />
      
      <section className="section-padding bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container-responsive flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div><h2 className="text-3xl font-black text-white">{mr ? "वॉर्ड २४(ड) अधिक स्वच्छ, सुरक्षित आणि सुविधायुक्त बनवूया" : "Let’s make Ward 24(D) cleaner, safer, and better maintained"}</h2><p className="mt-2 text-orange-50">{mr ? "समस्या दिसली? आम्हाला ठिकाणासह कळवा." : "See a civic problem? Report it with the exact location."}</p></div>
          <Link href="/complaints#register" className="inline-flex min-h-14 shrink-0 items-center gap-2 rounded-xl bg-white px-7 text-lg font-black text-orange-700 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">{mr ? "तक्रार नोंदवा" : "Register Complaint"} <FiArrowRight /></Link>
        </div>
      </section>

      

      {showMap && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && setShowMap(false)} role="dialog" aria-modal="true" aria-labelledby="large-map-title"><div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b px-5 py-4"><h2 id="large-map-title" className="text-xl font-black">{mr ? "वॉर्ड २४(ड), नेरूळ नकाशा" : "Ward 24(D), Nerul Map"}</h2><button type="button" onClick={() => setShowMap(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold hover:bg-slate-200" aria-label={mr ? "नकाशा बंद करा" : "Close map"}>×</button></div><div className="h-[72vh] p-3"><div className="h-full overflow-hidden rounded-xl"><LeafletMap center={[19.0285, 73.012]} zoom={14} title={mr ? "वॉर्ड २४(ड), नेरूळ" : "Ward 24(D), Nerul"} boundary={wardBoundary} /></div></div></div></div>}
    </div>
  );
}
