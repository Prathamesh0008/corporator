"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { FiAlertCircle, FiCheckCircle, FiPhone, FiSearch } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageContext";
import HeroSection from "../components/home/HeroSection";
import HomepageSections from "../components/home/HomepageSections";
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
  const [homeBanner, setHomeBanner] = useState("/photo.jpeg");
  const mapButton = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/site-content", { signal: controller.signal }).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (data.content?.homeBanner) setHomeBanner(data.content.homeBanner);
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!showMap) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = mapButton.current;
    closeButton.current?.focus();
    const close = event => {
      if (event.key === "Escape") setShowMap(false);
      if (event.key === "Tab") {
        const controls = [...document.getElementById("ward-map-dialog").querySelectorAll('button, a[href], input, [tabindex="0"]')].filter(el => el.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = previousOverflow; trigger?.focus(); };
  }, [showMap]);
  return <div className="home-ui" lang={language}>
    <HeroSection image={homeBanner} />
    <section className="home-citizen-actions" aria-label={mr ? "नागरिक सेवा" : "Citizen services"}>
      <ul className="editorial-container home-action-list">
        {[
          ["Report Issue", "समस्या नोंदवा", "/complaints#register", FiAlertCircle],
          ["Track Complaint", "तक्रार तपासा", "/complaints#track", FiSearch],
          ["Resolved Works", "पूर्ण झालेली कामे", "/works", FiCheckCircle],
          ["Contact Office", "कार्यालयाशी संपर्क", "/contact", FiPhone],
        ].map(([en, marathi, href, Icon]) => <li key={href}>
          <Link href={href}><Icon className="home-action-icon" aria-hidden="true" /><span>{mr ? marathi : en}</span><span className="home-action-arrow" aria-hidden="true">→</span></Link>
        </li>)}
      </ul>
    </section>
    <section className="civic-section civic-statement"><div className="editorial-container">
      <p className="civic-muted">{mr ? "सेवेचा विचार" : "A commitment to service"}</p>
      <h2>{mr ? "पदापेक्षा सेवा मोठी, आणि स्वतःपेक्षा जनता प्रथम." : "Service above position. People before self."}</h2>
    </div></section>
    <section className="home-party-identity" aria-labelledby="party-identity-title">
      <div className="editorial-container">
        <div className="party-identity-label"><Image src="/lotus.webp" alt="BJP Lotus" width={40} height={40} sizes="40px" /><h2 id="party-identity-title">{mr ? "भारतीय जनता पार्टी" : "Bharatiya Janata Party"}</h2></div>
        <div className="party-identity-person"><p>{mr ? "सचिन देवप्पा लवटे" : "Sachin Devappa Lavate"}</p><p>{mr ? "नगरसेवक • वॉर्ड २४, नेरूळ" : "Corporator • Ward 24(D), Nerul"}</p></div>
      </div>
    </section>
    <HomepageSections />
    <section className="civic-section"><div className="editorial-container ward-layout">
      <div><p className="ward-number">२४</p><h2 className="civic-title">{mr ? "आपला वॉर्ड" : "Our ward"}</h2><p>{mr ? "नेरूळ • नवी मुंबई" : "Nerul • Navi Mumbai"}</p><p className="civic-muted">{mr ? "नकाशावरील सीमा संदर्भासाठी दाखवली आहे." : "The ward boundary is shown for reference."}</p><button ref={mapButton} onClick={() => setShowMap(true)} className="civic-button civic-button-secondary">{mr ? "मोठा नकाशा उघडा" : "Open large map"} →</button></div>
      <div className="ward-map"><LeafletMap center={[19.0285, 73.012]} zoom={13} title={mr ? "वॉर्ड २४, नेरूळ" : "Ward 24(D), Nerul"} boundary={wardBoundary} /></div>
    </div></section>
    <section className="citizen-cta"><div className="editorial-container"><div><h2>{mr ? "आपल्या परिसरात काही समस्या आहे?" : "Is there a problem in your neighbourhood?"}</h2><p>{mr ? "रस्ता • पाणी • स्वच्छता • पथदिवे" : "Roads • Water • Sanitation • Street lights"}</p></div><Link href="/complaints#register" className="civic-button">{mr ? "समस्या नोंदवा" : "Report an issue"} →</Link></div></section>
    {showMap && <div className="map-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowMap(false)}><div id="ward-map-dialog" className="map-dialog" role="dialog" aria-modal="true" aria-labelledby="large-map-title"><header><h2 id="large-map-title">{mr ? "वॉर्ड २४, नेरूळ नकाशा" : "Ward 24(D), Nerul map"}</h2><button ref={closeButton} onClick={() => setShowMap(false)} aria-label={mr ? "नकाशा बंद करा" : "Close map"}>×</button></header><div className="large-map"><LeafletMap center={[19.0285, 73.012]} zoom={14} title={mr ? "वॉर्ड २४, नेरूळ" : "Ward 24(D), Nerul"} boundary={wardBoundary} /></div></div></div>}
  </div>;
}
