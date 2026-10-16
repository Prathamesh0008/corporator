"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { workItems } from "../workData";
import { newsData } from "../../data/siteContent";

function Photo({ src, alt, sizes = "(max-width: 767px) 100vw, 55vw" }) {
  return <Image src={src} alt={alt} fill unoptimized={src.startsWith("http")} sizes={sizes} className="editorial-photo" />;
}

function FeaturedNewsImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return <div className="news-photo"><Image
    src={src}
    alt={alt}
    fill
    loading="eager"
    unoptimized={src.startsWith("http")}
    sizes="(max-width: 767px) 100vw, 55vw"
    className="editorial-photo"
    onError={() => setFailed(true)}
  /></div>;
}
const galleryFallback = ["/gallery/support/1.png", "/gallery/support/2.png", "/gallery/support/3.png"].map((image, i) => ({ id: `existing-${i}`, image, titleMr: "नागरिक सेवा आणि सार्वजनिक कार्यक्रम", titleEn: "Citizen services and public events" }));
export default function HomepageSections() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const [published, setPublished] = useState({ works: [], news: [], gallery: [] });
  useEffect(() => {
    const controller = new AbortController();
    const sources = [["works", "/api/works", "works"], ["news", "/api/news", "news"], ["gallery", "/api/gallery", "items"]];
    sources.forEach(([key, url, field]) => {
      fetch(url, { signal: controller.signal }).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        if (Array.isArray(data[field])) setPublished(current => ({ ...current, [key]: data[field] }));
      }).catch(() => {});
    });
    return () => controller.abort();
  }, []);
  const text = (item, field) => mr ? item[`${field}Mr`] || item[`${field}En`] : item[`${field}En`];
  const works = [...published.works, ...workItems].slice(0, 2);
  const news = [...published.news, ...newsData].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)).slice(0, 4);
  const gallery = [...published.gallery.filter(item => item.type === "photo"), ...galleryFallback].slice(0, 3);
  const heading = (id, title, href, action) => <header className="editorial-section-head"><h2 id={id} className="civic-title">{title}</h2><Link href={href} className="civic-text-action">{action} <span>→</span></Link></header>;
  const issues = [["रस्ते आणि पदपथ", "Roads and footpaths"], ["पाणीपुरवठा", "Water supply"], ["गटारे आणि स्वच्छता", "Drainage and sanitation"], ["पथदिवे", "Street lights"], ["उद्याने आणि सार्वजनिक जागा", "Parks and public spaces"]];
  return <>
    <section className="civic-section" aria-labelledby="works-title"><div className="editorial-container">
      {heading("works-title", mr ? "विकासकामे" : "Development works", "/works", mr ? "सर्व विकासकामे पहा" : "All development works")}
      <div className="editorial-works">{works.map(work => <article className="editorial-work" key={work.id}>
        <div className="work-photographs"><figure className="work-after"><Photo src={work.afterImage} alt={`${text(work, "title")} — ${mr ? "नंतर" : "After"}`} /><figcaption>{mr ? "नंतर" : "After"}</figcaption></figure>{work.beforeImage && <figure className="work-before"><Photo src={work.beforeImage} alt={`${text(work, "title")} — ${mr ? "पूर्वी" : "Before"}`} sizes="(max-width: 767px) 35vw, 18vw" /><figcaption>{mr ? "पूर्वी" : "Before"}</figcaption></figure>}</div>
        <div className="work-copy"><h3>{text(work, "title")}</h3><p className="work-location">{text(work, "location")}</p><p className="civic-muted">{text(work, "description")}</p><p className="work-status">{text(work, "status")}</p><Link className="civic-text-action" href="/works#completed-works">{mr ? "कामाची माहिती पहा" : "View work details"} <span>→</span></Link></div>
      </article>)}</div>
    </div></section>
    <section className="civic-section citizen-help" aria-labelledby="help-title"><div className="editorial-container help-layout"><div><h2 id="help-title" className="civic-title">{mr ? "नागरिक सहाय्य" : "Citizen help"}</h2><p className="civic-muted">{mr ? "आपल्या परिसरातील नागरी समस्या आम्हाला कळवा." : "Tell us about civic issues in your neighbourhood."}</p><Link href="/complaints#track" className="civic-text-action">{mr ? "तक्रारीची स्थिती तपासा" : "Track your complaint"} <span>→</span></Link></div><div><ol className="issue-list">{issues.map(([marathi, english], index) => <li key={english}><Link href="/complaints#register"><span className="civic-muted">{String(index + 1).padStart(2, "0")}</span><span>{mr ? marathi : english}</span><span aria-hidden="true">→</span></Link></li>)}</ol><Link href="/complaints#register" className="civic-text-action help-action">{mr ? "नागरी समस्या नोंदवा" : "Report a civic issue"} <span>→</span></Link><p className="emergency-note civic-muted">{mr ? "आपत्कालीन मदतीसाठी ११२ वर कॉल करा. ही सेवा आपत्कालीन सेवा नाही." : "For emergencies, call 112. This complaint service is not an emergency service."}</p></div></div></section>
    <section className="civic-section" aria-labelledby="news-title"><div className="editorial-container">
      {heading("news-title", mr ? "बातम्या आणि घडामोडी" : "News and updates", "/news", mr ? "सर्व बातम्या पहा" : "All news")}
      <div className="editorial-news">{news.slice(0, 3).map((item, index) => <article className={index === 0 ? "news-feature" : "news-brief"} key={item.id || item.slug}>
        {index === 0 && <FeaturedNewsImage key={item.image || "no-image"} src={item.image?.trim()} alt={text(item, "title")} />}
        <div><p className="news-meta"><time dateTime={item.date}>{Number.isNaN(Date.parse(item.date)) ? item.date : new Date(item.date).toLocaleDateString(mr ? "mr-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}</time><span>{text(item, "category")}</span></p><h3><Link href={item.externalUrl || `/news/${item.slug}`} target={item.externalUrl ? "_blank" : undefined} rel={item.externalUrl ? "noopener noreferrer" : undefined}>{text(item, "title")}</Link></h3>{index === 0 && <p className="civic-muted">{text(item, "summary")}</p>}<Link href={item.externalUrl || `/news/${item.slug}`} target={item.externalUrl ? "_blank" : undefined} rel={item.externalUrl ? "noopener noreferrer" : undefined} className="civic-text-action">{mr ? "अधिक वाचा" : "Read more"} <span>→</span></Link></div>
      </article>)}</div>
    </div></section>
    <section className="civic-section" aria-labelledby="gallery-title"><div className="editorial-container">
      {heading("gallery-title", mr ? "लोकांमध्ये, लोकांसाठी" : "With people, for people", "/gallery", mr ? "संपूर्ण गॅलरी पहा" : "View full gallery")}
      <div className="editorial-gallery">{gallery.map(item => <Link href="/gallery" key={item.id} aria-label={mr ? "गॅलरी पहा" : "View gallery"}><Photo src={item.image} alt={text(item, "title")} sizes="(max-width: 767px) 100vw, 60vw" /></Link>)}</div>
    </div></section>
  </>;
}
