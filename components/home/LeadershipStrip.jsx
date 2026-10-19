"use client";

import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import styles from "./LeadershipStrip.module.css";

export default function LeadershipStrip() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <section className={styles.strip} aria-labelledby="leadership-strip-title">
      <div className={`editorial-container ${styles.layout}`}>
        <div className={styles.content}>
          <p className={styles.label}>{mr ? "प्रेरणास्थान" : "Our inspiration"}</p>
          <h2 id="leadership-strip-title">{mr ? "सार्वजनिक जीवनातील नेतृत्व" : "Leadership in public life"}</h2>
          <p className={styles.name}>{mr ? "मा. गणेश नाईक" : "Hon. Ganesh Naik"}</p>
          <p className={styles.role}>{mr ? "वनमंत्री, महाराष्ट्र" : "Minister of Forests, Maharashtra"}</p>
        </div>
        <div className={styles.photograph}>
          <Image
            src="/images/leadership-cutout.webp"
            alt={mr ? "गणेश नाईक आणि सचिन लवटे यांचे छायाचित्र" : "Ganesh Naik and Sachin Lavate"}
            fill
            sizes="(max-width: 767px) 100vw, 46vw"
          />
        </div>
      </div>
    </section>
  );
}
