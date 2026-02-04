"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiArrowRight, FiArrowLeft, FiCheckCircle, FiClock, FiUsers, 
  FiAward, FiAlertCircle, FiPhone
} from "react-icons/fi";
import { 
  GiAmbulance, GiFireExtinguisher, GiWaterTank,
  GiRoad, GiStreetLight, GiHealthNormal
} from "react-icons/gi";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../lib/translations";

export default function HomePage() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: language === "en" ? "Service is Commitment" : "सेवा ही संकल्प",
      subtitle: language === "en" 
        ? "Corporator Sachin Lavate - Representative of Ward 24(D)" 
        : "नगरसेवक सचिन लवटे - वॉर्ड २४(ड) चे प्रतिनिधी",
      cta: language === "en" ? "Learn More About Me" : "माझ्याबद्दल अधिक",
      ctaLink: "/about",
      theme: {
        bg: "linear-gradient(135deg, #0F6F9C, #0B6E4F, #FF9933)"
      }
    },
    {
      title: language === "en" ? "A New Chapter of Development" : "विकासाचा नवा अध्याय",
      subtitle: language === "en" 
        ? "Transforming Ward 24(D) with focused development" 
        : "नेरूळ सेक्टर १८ चे रूपांतर",
      cta: language === "en" ? "View Development Works" : "विकास कार्ये पहा",
      ctaLink: "/works",
      theme: {
        bg: "linear-gradient(135deg, #1B4332, #0B6E4F, #2B9348)"
      }
    },
    {
      title: language === "en" ? "Development for All" : "सर्वांचा विकास",
      subtitle: language === "en" 
        ? "Sabka Saath, Sabka Vikas, Sabka Vishwas" 
        : "सबका साथ, सबका विकास, सबका विश्वास",
      cta: language === "en" ? "Access Services" : "सेवा मिळवा",
      ctaLink: "/services",
      theme: {
        bg: "linear-gradient(135deg, #0066B3, #0F6F9C, #FF6600)"
      }
    }
  ];

  const stats = [
    { number: "1,247+", label: "stats.complaintsResolved", icon: <FiCheckCircle /> },
    { number: "89+", label: "stats.worksCompleted", icon: <FiAward /> },
    { number: "23", label: "stats.ongoingProjects", icon: <FiClock /> },
    { number: "156", label: "stats.publicMeetings", icon: <FiUsers /> }
  ];

  const services = [
    { 
      icon: <GiWaterTank className="w-8 h-8" />, 
      title: language === "en" ? "Water Supply" : "पाणीपुरवठा", 
      description: language === "en" 
        ? "New connections, complaint resolution" 
        : "नवीन कनेक्शन, तक्रार निवारण",
      link: "/services#water"
    },
    { 
      icon: <GiRoad className="w-8 h-8" />, 
      title: language === "en" ? "Roads & Footpaths" : "रस्ते व फुटपाथ", 
      description: language === "en" 
        ? "Repair, widening, maintenance" 
        : "दुरुस्ती, रुंदीकरण, देखभाल",
      link: "/services#roads"
    },
    { 
      icon: <GiStreetLight className="w-8 h-8" />, 
      title: language === "en" ? "Street Lights" : "स्ट्रीट लाइट", 
      description: language === "en" 
        ? "LED installation, repairs" 
        : "एलईडी स्थापना, दुरुस्ती",
      link: "/services#lights"
    },
    { 
      icon: <GiHealthNormal className="w-8 h-8" />, 
      title: language === "en" ? "Health Services" : "आरोग्य सेवा", 
      description: language === "en" 
        ? "Medical camps, healthcare assistance" 
        : "वैद्यकीय शिबिरे, आरोग्य मदत",
      link: "/services#health"
    }
  ];

  const announcements = [
    { 
      title: language === "en" ? "Water Cut Schedule" : "पाणी कट व्यवस्थापन", 
      date: language === "en" ? "15 March 2024" : "१५ मार्च २०२४",
      description: language === "en" 
        ? "New water cut schedule announced" 
        : "पाणी कटचे नवीन वेळापत्रक जारी"
    },
    { 
      title: language === "en" ? "Cleanliness Drive" : "स्वच्छता मोहीम", 
      date: language === "en" ? "20 March 2024" : "२० मार्च २०२४",
      description: language === "en" 
        ? "Ward cleanliness campaign started" 
        : "वॉर्डमधील स्वच्छता अभियान सुरू"
    },
    { 
      title: language === "en" ? "Drainage Repair Work" : "गटार दुरुस्ती", 
      date: language === "en" ? "25 March 2024" : "२५ मार्च २०२४",
      description: language === "en" 
        ? "Main road drainage repair work" 
        : "मुख्य रस्त्यावरील गटार दुरुस्ती काम"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [language]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0" style={{ background: slide.theme.bg }} />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            </div>
          ))}
        </div>
        <div className="relative container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 py-10 md:py-16 md:grid-cols-[1.1fr_0.9fr] min-h-[420px] md:min-h-[520px]">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold tracking-wide">
                  {t("home.heroSubtitle", language)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                {slides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={slides[currentSlide].ctaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all"
                >
                  {slides[currentSlide].cta} <FiArrowRight />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  {t("contact.title", language)} <FiPhone />
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-10 h-10 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10 transition"
                >
                  <FiArrowLeft />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-10 h-10 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/10 transition"
                >
                  <FiArrowRight />
                </button>
                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentSlide ? "w-8 bg-white" : "w-2.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 text-white">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4"
                >
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="text-lg">{stat.icon}</div>
                    <span className="text-sm uppercase tracking-wide text-white/70">
                      {t(stat.label, language)}
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white">{stat.number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t("home.statsTitle", language)}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{t(stat.label, language)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-12 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t("home.servicesTitle", language)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index} 
                href={service.link}
                className="card hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <div className="text-blue-600">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-blue-600 font-medium flex items-center gap-1">
                  {t("common.viewDetails", language)} <FiArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
            {language === "en" ? "Notices & Announcements" : "सूचना व घोषणा"}
            </h2>
            <Link 
              href="/services" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t("common.viewAll", language)} →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((announcement, index) => (
              <div key={index} className="card">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <span>📅</span>
                  {announcement.date}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {announcement.title}
                </h3>
                <p className="text-gray-600">
                  {announcement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t("common.emergency", language)} {language === "en" ? "Services" : "सेवा"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <GiAmbulance className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === "en" ? "Ambulance Service" : "एंब्युलन्स सेवा"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en" ? "24/7 emergency medical service" : "२४/७ आपत्कालीन वैद्यकीय सेवा"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">📞</span>
                  <span className="font-medium">108 ({language === "en" ? "Emergency" : "आपत्कालीन"})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📞</span>
                  <span className="font-medium">022-12345678 ({language === "en" ? "Ward Office" : "वॉर्ड ऑफिस"})</span>
                </div>
              </div>
            </div>
            
            <div className="card shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <GiFireExtinguisher className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === "en" ? "Fire Service" : "फायर सेवा"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en" ? "Fire, accident, disaster management" : "आग, दुर्घटना, आपत्ती व्यवस्थापन"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <span className="font-medium">101 ({language === "en" ? "Fire Brigade" : "फायर ब्रिगेड"})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">📞</span>
                  <span className="font-medium">022-27456230 ({language === "en" ? "NMMC Fire" : "एनएमएमसी फायर"})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/complaints" 
              className="p-6 bg-red-50 rounded-xl text-center hover:bg-red-100 transition-colors"
            >
              <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("complaints.title", language)}
              </h3>
              <p className="text-gray-600">
                {language === "en" ? "Register your issues with us" : "तुमची समस्या आमच्याकडे नोंदवा"}
              </p>
            </Link>
            
            <Link 
              href="/works" 
              className="p-6 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors"
            >
              <FiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("nav.works", language)}
              </h3>
              <p className="text-gray-600">
                {language === "en" ? "View progress of development works" : "विकास कार्यांची प्रगती पहा"}
              </p>
            </Link>
            
            <Link 
              href="/gallery" 
              className="p-6 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors"
            >
              <FiAward className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("nav.gallery", language)}
              </h3>
              <p className="text-gray-600">
                {language === "en" ? "Before-After photos of works" : "कार्यांचे आधी-नंतर फोटो पहा"}
              </p>
            </Link>
            
            <Link 
              href="/contact" 
              className="p-6 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors"
            >
              <FiPhone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("nav.contact", language)}
              </h3>
              <p className="text-gray-600">
                {language === "en" ? "Contact Corporator office" : "नगरसेवक कार्यालयाशी संपर्क"}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


