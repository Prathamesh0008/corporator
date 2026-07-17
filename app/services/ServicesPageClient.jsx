"use client";

import Link from "next/link";
import { FiAlertTriangle, FiArrowRight, FiCheckCircle, FiMapPin } from "react-icons/fi";
import { GiRoad, GiStreetLight, GiWaterTank } from "react-icons/gi";
import { MdCleaningServices, MdOutlinePark } from "react-icons/md";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ServicesPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const services = [
    { icon: <GiRoad />, en: "Roads, potholes & footpaths", mr: "रस्ते, खड्डे व पदपथ", detailEn: "Report damaged ward roads, unsafe footpaths, or local access problems.", detailMr: "वॉर्डमधील खराब रस्ते, असुरक्षित पदपथ किंवा स्थानिक ये-जा समस्या कळवा." },
    { icon: <GiWaterTank />, en: "Water supply & leakage", mr: "पाणीपुरवठा व गळती", detailEn: "Report irregular municipal water supply, leakage, or low pressure.", detailMr: "अनियमित महानगरपालिका पाणीपुरवठा, गळती किंवा कमी दाब कळवा." },
    { icon: <MdCleaningServices />, en: "Garbage, drains & cleanliness", mr: "कचरा, गटारे व स्वच्छता", detailEn: "Report missed garbage pickup, overflowing bins, blocked drains, or dirty public areas.", detailMr: "कचरा न उचलणे, भरलेली कचरापेटी, तुंबलेले गटार किंवा अस्वच्छ सार्वजनिक जागा कळवा." },
    { icon: <GiStreetLight />, en: "Street lights", mr: "पथदिवे", detailEn: "Report non-working or damaged municipal street lights.", detailMr: "बंद किंवा खराब महानगरपालिका पथदिवे कळवा." },
    { icon: <MdOutlinePark />, en: "Gardens & public spaces", mr: "उद्याने व सार्वजनिक जागा", detailEn: "Report maintenance, cleanliness, or safety issues in municipal public spaces.", detailMr: "महानगरपालिका सार्वजनिक जागांमधील देखभाल, स्वच्छता किंवा सुरक्षिततेची समस्या कळवा." },
  ];

  return <div className="bg-slate-50">
    <section className="bg-[#082f49] px-4 py-14 text-center text-white"><p className="font-bold text-orange-300">{mr ? "वॉर्ड २४(ड), नेरूळ" : "WARD 24(D), NERUL"}</p><h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">{mr ? "नगरसेवक कार्यालयाची मदत" : "How the Corporator Office Can Help"}</h1><p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-blue-100">{mr ? "नगरसेवक कार्यालय महानगरपालिकेच्या वॉर्ड-स्तरीय नागरी समस्यांचा पाठपुरावा आणि समन्वय करते." : "The corporator office follows up and coordinates on municipal civic issues affecting the ward."}</p></section>
    <section className="section-padding"><div className="container-responsive"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <article key={service.en} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl text-orange-600 transition group-hover:rotate-3">{service.icon}</span><h2 className="mt-4 text-xl font-black">{mr ? service.mr : service.en}</h2><p className="mt-2 leading-7 text-slate-600">{mr ? service.detailMr : service.detailEn}</p><Link href="/complaints#register" className="mt-5 inline-flex items-center gap-2 font-black text-blue-700">{mr ? "समस्या नोंदवा" : "Report this issue"}<FiArrowRight /></Link></article>)}</div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl bg-green-50 p-6"><h2 className="flex items-center gap-2 text-xl font-black text-green-950"><FiCheckCircle />{mr ? "कार्यालय काय करेल" : "What the office will do"}</h2><ul className="mt-4 space-y-3 text-green-950"><li>• {mr ? "तक्रारीची माहिती तपासेल" : "Review the complaint details"}</li><li>• {mr ? "संबंधित महानगरपालिका विभागाकडे पाठपुरावा करेल" : "Follow up with the relevant municipal department"}</li><li>• {mr ? "तक्रार स्थिती अद्ययावत करेल" : "Update the complaint status"}</li></ul></div><div className="rounded-2xl bg-amber-50 p-6"><h2 className="flex items-center gap-2 text-xl font-black text-amber-950"><FiAlertTriangle />{mr ? "या कार्यालयाच्या कार्यक्षेत्राबाहेर" : "Outside the corporator office scope"}</h2><p className="mt-3 leading-7 text-amber-950">{mr ? "पोलीस तपास, न्यायालयीन प्रकरणे, वैयक्तिक आर्थिक व्यवहार, खासगी मालमत्तेचे वाद आणि आपत्कालीन सेवा नगरसेवक कार्यालयाच्या थेट कार्यक्षेत्रात नाहीत. योग्य प्राधिकरणाशी संपर्क साधा." : "Police investigations, court matters, private financial transactions, private property disputes, and emergency response are not directly controlled by the corporator office. Contact the appropriate authority."}</p></div></div>
      <div className="mt-10 rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-7 text-center text-white"><FiMapPin className="mx-auto h-9 w-9"/><h2 className="mt-2 text-3xl font-black text-white">{mr ? "समस्या वॉर्ड २४(ड) मध्ये आहे?" : "Is the issue in Ward 24(D)?"}</h2><p className="mt-2 text-orange-50">{mr ? "अचूक ठिकाण आणि फोटो दिल्यास पाठपुरावा सोपा होतो." : "An exact location and photo make follow-up easier."}</p><Link href="/complaints#register" className="mt-5 inline-flex min-h-14 items-center gap-2 rounded-xl bg-white px-7 font-black text-orange-700">{mr ? "तक्रार नोंदवा" : "Register complaint"}<FiArrowRight /></Link></div>
    </div></section>
  </div>;
}
