"use client";

import Link from "next/link";
import { GiLotus } from "react-icons/gi";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";

export default function PoliticalIdentitySections() {
  const { language } = useLanguage();
  const mr = language === "mr";

  return (
    <div className="overflow-hidden rounded-[32px] border border-[#ead9b9] bg-[#fff5df] shadow-sm">
      <section className="relative px-6 py-12 sm:px-10 md:py-16 lg:px-16" aria-labelledby="ideology-title">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div className="flex justify-center" aria-hidden="true">
            <div className="relative flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
              <div className="absolute inset-3 rounded-full bg-gradient-to-b from-orange-100 to-white shadow-inner" />
              <GiLotus className="relative h-52 w-52 text-orange-500 drop-shadow-[0_10px_0_rgba(19,136,8,.9)] sm:h-64 sm:w-64" />
            </div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[.18em] text-orange-600">{mr ? "राष्ट्र प्रथम" : "Nation First"}</p>
            <h2 id="ideology-title" className="mt-2 text-3xl font-black text-[#4a210d] sm:text-4xl">{mr ? "भाजपा विचारधारा" : "BJP Ideology"}</h2>
            <h3 className="mt-6 text-2xl font-black text-[#063d73] sm:text-3xl">{mr ? "संकल्प से सिद्धी तक" : "From resolve to achievement"}</h3>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-[#765f4d]">{mr ? "राष्ट्रहित, अंत्योदय आणि सर्वसमावेशक विकास या मूल्यांवर विश्वास ठेवून हाती घेतलेला प्रत्येक जनसेवेचा संकल्प पूर्णत्वास नेण्यासाठी आम्ही कटिबद्ध आहोत. समाजातील शेवटच्या व्यक्तीपर्यंत विकास पोहोचवणे हेच आमच्या कार्याचे ध्येय आहे." : "Guided by national interest, Antyodaya and inclusive development, we are committed to carrying every public-service resolve through to completion. Our purpose is to ensure that progress reaches the last person in society."}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#ead9b9] bg-[#fff8e9] px-6 py-12 text-center sm:px-10 md:py-16 lg:px-16" aria-labelledby="nerul-title">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl text-white"><FiMapPin /></span>
        <h2 id="nerul-title" className="mt-5 text-3xl font-black text-[#4a210d] sm:text-5xl">{mr ? "नेरूळकर — एक नातं जिव्हाळ्याचं" : "Nerul — a bond close to the heart"}</h2>
        <p className="mx-auto mt-6 max-w-5xl text-lg leading-8 text-[#765f4d]">{mr ? "नेरूळने मला ओळख, संस्कार आणि जनसेवेची दिशा दिली. येथील प्रत्येक कुटुंबाचे सुख-दुःख, परिसरातील प्रत्येक प्रश्न आणि वॉर्डच्या विकासाची प्रत्येक संधी माझ्यासाठी वैयक्तिक जबाबदारी आहे. नागरिकांचा विश्वास आणि सहभाग हीच या सेवाप्रवासाची खरी ताकद आहे." : "Nerul gave me my identity, my values and my direction in public service. Every family’s well-being, every neighbourhood concern and every opportunity for ward development is a personal responsibility. The trust and participation of citizens remain the true strength of this journey."}</p>
        <Link href="/about" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl">{mr ? "माझा जीवनप्रवास" : "My Journey"}<FiArrowRight /></Link>
      </section>
    </div>
  );
}
