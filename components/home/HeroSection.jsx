"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import styles from "./HeroSection.module.css";

export default function HeroSection({ image = "/photo.jpeg" }) {
  const { language } = useLanguage();
  const mr = language === "mr";
  // This saved CMS portrait predates the new banner composition. Keep the stored
  // record intact, but let the new design replace it; other CMS uploads still work.
  const supersededPortrait = image.split("?")[0].endsWith("/site-content/1792413454070-f988b5d5e8bb.jpg");
  const customBanner = image !== "/photo.jpeg" && !supersededPortrait;
  const backgroundImage = customBanner ? image : "/images/civic-hero-watercolor.webp";
  return (
    <section className={`${styles.hero} ${customBanner ? styles.uploaded : ""}`} aria-labelledby="home-hero-title">
      <Image className={styles.background} src={backgroundImage} alt="" fill priority unoptimized={backgroundImage.startsWith("http")} sizes="100vw" />
      <div className={`editorial-container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className={styles.context}>{mr ? "नगरसेवक · वॉर्ड२४ · नेरूळ" : "Corporator · Ward 24(D) · Nerul"}</p>
          <h1 id="home-hero-title" className={styles.name}>{mr ? "सचिन देवप्पा लवटे" : "Sachin Devappa Lavate"}</h1>
          <p className={styles.promise}>{mr ? "जनतेशी नातं. विकासाशी बांधिलकी." : "Connected to people. Committed to development."}</p>
          <p className={styles.party}><Image src="/lotus.webp" alt="BJP Lotus" width={38} height={38} sizes="38px" /><span>{mr ? "भारतीय जनता पार्टी • वॉर्ड २४, नेरूळ" : "Bharatiya Janata Party • Ward 24(D), Nerul"}</span></p>
          <div className={styles.actions}>
            <Link href="/complaints#register" className={`civic-button ${styles.primary}`}>{mr ? "समस्या नोंदवा" : "Report an issue"} <span aria-hidden="true">→</span></Link>
            <Link href="/complaints#track" className={`civic-text-action ${styles.secondary}`}>{mr ? "तक्रार तपासा" : "Track complaint"} <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        {!customBanner && <div className={styles.portrait}><Image src="/images/sachin-hero-portrait.png" alt={mr ? "नगरसेवक सचिन देवप्पा लवटे" : "Corporator Sachin Devappa Lavate"} fill priority sizes="(max-width: 767px) 75vw, 43vw" /></div>}
      </div>
    </section>
  );
}
