"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Script from "next/script";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiAward,
  FiAlertCircle,
  FiPhone,
  FiPlay,
  FiSearch
} from "react-icons/fi";
import {
  GiAmbulance,
  GiFireExtinguisher,
  GiWaterTank,
  GiRoad,
  GiStreetLight,
  GiHealthNormal
} from "react-icons/gi";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../lib/translations";

const LeafletMap = dynamic(() => import("../components/LeafletMap"), { ssr: false });

export default function HomePage() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("news");
  const [showMobileServices, setShowMobileServices] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [isJourneyDragging, setIsJourneyDragging] = useState(false);
  const [journeyItemsPerView, setJourneyItemsPerView] = useState(5);
  const journeyWheelLock = useRef(0);
  const journeyDrag = useRef({ isDragging: false, startX: 0 });

  const slides = [
    {
      title: language === "en" ? "Service is Commitment" : "सेवा ही संकल्प",
      subtitle:
        language === "en"
          ? "Corporator Sachin Lavate - Representative of Ward 24(D)"
          : "नगरसेवक सचिन लवटे - वॉर्ड २४(ड) चे प्रतिनिधी",
      cta: language === "en" ? "Learn More About Me" : "माझ्याबद्दल अधिक",
      ctaLink: "/about",
      image: "/images/banner-1.jpg",
      theme: {
        bg: "linear-gradient(135deg, #0F6F9C, #0B6E4F, #FF9933)"
      }
    },
    {
      title: language === "en" ? "A New Chapter of Development" : "विकासाचा नवा अध्याय",
      subtitle:
        language === "en"
          ? "Transforming Ward 24(D) with focused development"
          : "नेरूळ सेक्टर १८ चे रूपांतर",
      cta: language === "en" ? "View Development Works" : "विकास कार्ये पहा",
      ctaLink: "/works",
      image: "/images/banner-2.jpg",
      theme: {
        bg: "linear-gradient(135deg, #1B4332, #0B6E4F, #2B9348)"
      }
    },
    {
      title: language === "en" ? "Development for All" : "सर्वांचा विकास",
      subtitle:
        language === "en"
          ? "Sabka Saath, Sabka Vikas, Sabka Vishwas"
          : "सबका साथ, सबका विकास, सबका विश्वास",
      cta: language === "en" ? "Access Services" : "सेवा मिळवा",
      ctaLink: "/services",
      image: "/images/banner-3.jpeg",
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
      description:
        language === "en"
          ? "New connections, complaint resolution"
          : "नवीन कनेक्शन, तक्रार निवारण",
      link: "/services#water"
    },
    {
      icon: <GiRoad className="w-8 h-8" />,
      title: language === "en" ? "Roads & Footpaths" : "रस्ते व फुटपाथ",
      description:
        language === "en"
          ? "Repair, widening, maintenance"
          : "दुरुस्ती, रुंदीकरण, देखभाल",
      link: "/services#roads"
    },
    {
      icon: <GiStreetLight className="w-8 h-8" />,
      title: language === "en" ? "Street Lights" : "स्ट्रीट लाइट",
      description:
        language === "en"
          ? "LED installation, repairs"
          : "एलईडी स्थापना, दुरुस्ती",
      link: "/services#lights"
    },
    {
      icon: <GiHealthNormal className="w-8 h-8" />,
      title: language === "en" ? "Health Services" : "आरोग्य सेवा",
      description:
        language === "en"
          ? "Medical camps, healthcare assistance"
          : "वैद्यकीय शिबिरे, आरोग्य मदत",
      link: "/services#health"
    }
  ];

  const announcements = [
    {
      title: language === "en" ? "Water Cut Schedule" : "पाणी कट व्यवस्थापन",
      date: language === "en" ? "15 March 2024" : "१५ मार्च २०२४",
      description:
        language === "en"
          ? "New water cut schedule announced"
          : "पाणी कटचे नवीन वेळापत्रक जारी"
    },
    {
      title: language === "en" ? "Cleanliness Drive" : "स्वच्छता मोहीम",
      date: language === "en" ? "20 March 2024" : "२० मार्च २०२४",
      description:
        language === "en"
          ? "Ward cleanliness campaign started"
          : "वॉर्डमधील स्वच्छता अभियान सुरू"
    },
    {
      title: language === "en" ? "Drainage Repair Work" : "गटार दुरुस्ती",
      date: language === "en" ? "25 March 2024" : "२५ मार्च २०२४",
      description:
        language === "en"
          ? "Main road drainage repair work"
          : "मुख्य रस्त्यावरील गटार दुरुस्ती काम"
    }
  ];

  const homeHighlights = [
    {
      title: language === "en" ? "Citizen Services First" : "नागरिक सेवा प्रथम",
      desc:
        language === "en"
          ? "Fast grievance handling, doorstep guidance, and reliable support."
          : "तक्रारींचा जलद निपटारा, दारापर्यंत मार्गदर्शन आणि विश्वासार्ह मदत.",
      icon: <FiCheckCircle className="w-5 h-5" />,
      accent: "saffron"
    },
    {
      title: language === "en" ? "Infrastructure Upgrades" : "पायाभूत सुधारणा",
      desc:
        language === "en"
          ? "Roads, drainage, street lights, and water supply improvements."
          : "रस्ते, ड्रेनेज, स्ट्रीट लाइट आणि पाणीपुरवठ्यातील सुधारणा.",
      icon: <GiRoad className="w-5 h-5" />,
      accent: "green"
    },
    {
      title: language === "en" ? "Health & Cleanliness" : "आरोग्य व स्वच्छता",
      desc:
        language === "en"
          ? "Health camps, sanitation drives, and waste management focus."
          : "आरोग्य शिबिरे, स्वच्छता मोहीम आणि कचरा व्यवस्थापनावर भर.",
      icon: <GiHealthNormal className="w-5 h-5" />,
      accent: "saffron"
    },
    {
      title: language === "en" ? "Women & Youth Safety" : "महिला व युवक सुरक्षा",
      desc:
        language === "en"
          ? "Community safety, awareness programs, and youth engagement."
          : "समुदाय सुरक्षा, जनजागृती उपक्रम आणि युवक सहभाग.",
      icon: <FiUsers className="w-5 h-5" />,
      accent: "green"
    }
  ];

  const citizenServices = [
    {
      label: language === "en" ? "Raise Grievance" : "तक्रार नोंदवा",
      color: "bg-[#d52b1e]",
      href: "/complaints"
    },
    {
      label: language === "en" ? "Feedback" : "अभिप्राय",
      color: "bg-[#00838f]",
      href: "/contact"
    },
    {
      label: language === "en" ? "Solid Waste" : "घनकचरा",
      color: "bg-[#2e7d32]",
      href: "/services"
    },
    {
      label: language === "en" ? "City Engineer" : "सिटी इंजिनियर",
      color: "bg-[#6a1b9a]",
      href: "/services"
    },
    {
      label: language === "en" ? "Licenses" : "परवाने",
      color: "bg-[#1565c0]",
      href: "/services"
    },
    {
      label: language === "en" ? "Water Supply" : "पाणीपुरवठा",
      color: "bg-[#0077b6]",
      href: "/services#water"
    },
    {
      label: language === "en" ? "Ward Offices" : "वॉर्ड ऑफिस",
      color: "bg-[#5d4037]",
      href: "/contact"
    }
  ];

  const mobileHeroCards = citizenServices.map((service) => ({
    title: service.label,
    desc:
      language === "en"
        ? "Quick access to citizen service"
        : "नागरिक सेवेसाठी त्वरित प्रवेश",
    href: service.href,
    color: service.color
  }));

  const journeyItems = [
    {
      title: language === "en" ? "Community Programs" : "समुदाय कार्यक्रम",
      desc: language === "en" ? "People-first initiatives" : "लोकाभिमुख उपक्रम",
      image: "/gallery/support/1.png"
    },
    {
      title: language === "en" ? "Cleanliness Drive" : "स्वच्छता मोहीम",
      desc: language === "en" ? "Clean streets, healthy ward" : "स्वच्छ रस्ते, निरोगी वॉर्ड",
      image: "/gallery/support/2.png"
    },
    {
      title: language === "en" ? "Health Camp" : "आरोग्य शिबिर",
      desc: language === "en" ? "Healthcare at your doorstep" : "दारात आरोग्य सेवा",
      image: "/gallery/support/3.png"
    },
    {
      title: language === "en" ? "Road Repairs" : "रस्ता दुरुस्ती",
      desc: language === "en" ? "Safer daily commute" : "सुरक्षित प्रवास",
      image: "/gallery/support/4.png"
    },
    {
      title: language === "en" ? "Water Supply" : "पाणीपुरवठा",
      desc: language === "en" ? "Reliable water access" : "विश्वसनीय पाणीपुरवठा",
      image: "/gallery/support/5.png"
    },
    {
      title: language === "en" ? "Ward Meetings" : "वॉर्ड सभा",
      desc: language === "en" ? "Listening to citizens" : "नागरिकांचा आवाज",
      image: "/gallery/support/6.png"
    },
    {
      title: language === "en" ? "Women Safety" : "महिला सुरक्षा",
      desc: language === "en" ? "Safety and support" : "सुरक्षा आणि मदत",
      image: "/gallery/support/7.png"
    },
    {
      title: language === "en" ? "Youth Engagement" : "युवा सहभाग",
      desc: language === "en" ? "Sports and guidance" : "क्रीडा व मार्गदर्शन",
      image: "/gallery/support/8.png"
    },
    {
      title: language === "en" ? "Public Awareness" : "जनजागृती",
      desc: language === "en" ? "Information drives" : "माहिती मोहीम",
      image: "/gallery/1.png"
    },
    {
      title: language === "en" ? "Ward Development" : "वॉर्ड विकास",
      desc: language === "en" ? "Ongoing improvements" : "सततची प्रगती",
      image: "/gallery/support-2.png"
    }
  ];

  const journeyMaxIndex = Math.max(0, journeyItems.length - journeyItemsPerView);
  const journeySteps = journeyMaxIndex + 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    const updateJourneyItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setJourneyItemsPerView(1);
      } else if (width < 1024) {
        setJourneyItemsPerView(2);
      } else {
        setJourneyItemsPerView(5);
      }
    };
    updateJourneyItemsPerView();
    window.addEventListener("resize", updateJourneyItemsPerView);
    return () => window.removeEventListener("resize", updateJourneyItemsPerView);
  }, []);

  useEffect(() => {
    setJourneyIndex((prev) => Math.min(prev, journeyMaxIndex));
  }, [journeyMaxIndex]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }
  }, [language]);

  useEffect(() => {
    if (!showMobileServices) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showMobileServices]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleInstagramLoad = () => {
    if (typeof window !== "undefined" && window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
    }
  };

  const handleJourneyWheel = (event) => {
    if (journeyMaxIndex <= 0) return;
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const now = Date.now();
    if (now - journeyWheelLock.current < 500) return;
    event.preventDefault();
    journeyWheelLock.current = now;
    setJourneyIndex((prev) => {
      const next = event.deltaY > 0 ? prev + 1 : prev - 1;
      return Math.min(journeyMaxIndex, Math.max(0, next));
    });
  };

  const startJourneyDrag = (clientX) => {
    if (journeyMaxIndex <= 0) return;
    journeyDrag.current = { isDragging: true, startX: clientX };
    setIsJourneyDragging(true);
  };

  const moveJourneyDrag = (clientX) => {
    if (!journeyDrag.current.isDragging || journeyMaxIndex <= 0) return false;
    const deltaX = clientX - journeyDrag.current.startX;
    if (Math.abs(deltaX) < 50) return false;
    journeyDrag.current.startX = clientX;
    setJourneyIndex((prev) => {
      const next = deltaX < 0 ? prev + 1 : prev - 1;
      return Math.min(journeyMaxIndex, Math.max(0, next));
    });
    return true;
  };

  const endJourneyDrag = () => {
    if (!journeyDrag.current.isDragging) return;
    journeyDrag.current.isDragging = false;
    setIsJourneyDragging(false);
  };

  const handleJourneyPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startJourneyDrag(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleJourneyPointerMove = (event) => {
    const moved = moveJourneyDrag(event.clientX);
    if (moved) event.preventDefault();
  };

  const handleJourneyPointerUp = (event) => {
    endJourneyDrag();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleJourneyMouseDown = (event) => {
    if (event.button !== 0) return;
    startJourneyDrag(event.clientX);
  };

  const handleJourneyMouseMove = (event) => {
    moveJourneyDrag(event.clientX);
  };

  const handleJourneyMouseUp = () => {
    endJourneyDrag();
  };

  const handleJourneyTouchStart = (event) => {
    if (!event.touches?.length) return;
    startJourneyDrag(event.touches[0].clientX);
  };

  const handleJourneyTouchMove = (event) => {
    if (!event.touches?.length) return;
    const moved = moveJourneyDrag(event.touches[0].clientX);
    if (moved) event.preventDefault();
  };

  const handleJourneyTouchEnd = () => {
    endJourneyDrag();
  };

  return (
    <div className="min-h-screen bg-[#f6f3ef]">
      {/* Top quick bar */}
      <section className="bg-[#0b3d91] text-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <span className="font-semibold">Navi Mumbai Municipal Corporation</span>
            <span className="hidden md:inline text-white/70">|</span>
            <span className="text-white/90">Helpline: 1800 222 230</span>
          </div>
         
        </div>
      </section>

      {/* Hero */}
     <section className="relative overflow-hidden bg-white">
  {/* ================= DESKTOP BACKGROUND SLIDER ================= */}
  <div className="absolute inset-0 hidden md:block">
    {slides.map((slide, index) => (
      <div
        key={slide.title}
        className={`absolute inset-0 transition-opacity duration-700 ${
          index === currentSlide ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0)), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
    ))}
  </div>

  {/* ================= MOBILE VIEW ================= */}
  <div className="relative md:hidden px-3 pt-2 pb-6">
    {/* Hero Image */}
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <div
        className="h-48 w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.35)), url(${slides[currentSlide].image})`
        }}
      />
    </div>

    {/* Mobile Side Tab */}
    <button
      type="button"
      onClick={() => setShowMobileServices(true)}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 md:hidden bg-orange-500  text-white text-xs font-semibold tracking-wide px-3 py-2 rounded-l-2xl shadow-lg"
      style={{ writingMode: "vertical-rl" }}
    >
      {language === "en" ? "Citizen Services" : "नागरिक सेवा"}
    </button>
  </div>

  {showMobileServices && (
    <div className="fixed inset-0 z-2000 md:hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowMobileServices(false)}
      />
      <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-gray-900">
            {language === "en" ? "Citizen Services" : "नागरिक सेवा"}
          </div>
          <button
            type="button"
            onClick={() => setShowMobileServices(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close services"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3 z-99">
          {mobileHeroCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              onClick={() => setShowMobileServices(false)}
              className={`flex items-center justify-between rounded-xl px-4 py-4 shadow-md active:scale-[0.98] transition text-white ${card.color}`}
            >
              <div className="leading-tight">
                <div className="text-base font-semibold">{card.title}</div>
                <div className="text-sm text-white/80">{card.desc}</div>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20">
                <FiArrowRight className="text-lg" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* ================= DESKTOP SIDE TAB ================= */}
  <div className="relative container-responsive px-4 sm:px-6 lg:px-8 hidden md:flex min-h-[560px] lg:min-h-[620px] xl:min-h-[680px] items-center">
    <div className="flex justify-end w-full">
      <button
        type="button"
        onClick={() => setShowMobileServices(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block bg-[#0b3d91] text-white text-xs font-semibold tracking-wide px-3 py-4 rounded-l-2xl shadow-lg"
        style={{ writingMode: "vertical-rl" }}
      >
        {language === "en" ? "Citizen Services" : "नागरिक सेवा"}
      </button>
    </div>
  </div>

  {showMobileServices && (
    <div className="fixed inset-0 z-2000  hidden md:block">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowMobileServices(false)}
      />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-gray-900">
            {language === "en" ? "Citizen Services" : "नागरिक सेवा"}
          </div>
          <button
            type="button"
            onClick={() => setShowMobileServices(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close services"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          {mobileHeroCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              onClick={() => setShowMobileServices(false)}
              className={`flex items-center justify-between rounded-xl px-4 py-4 shadow-md active:scale-[0.98] transition text-white ${card.color}`}
            >
              <div className="leading-tight">
                <div className="text-base font-semibold">{card.title}</div>
                <div className="text-sm text-white/80">{card.desc}</div>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20">
                <FiArrowRight className="text-lg" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )}
</section>

     


      {/* Notice ticker */}
      <section className="bg-[#0b3d91] text-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8 py-3 text-sm flex flex-col md:flex-row items-center gap-3">
          <span className="bg-white/15 px-3 py-1 rounded-full font-semibold">
            {language === "en" ? "What's New" : "नवीन"}
          </span>
          <div className="flex-1 text-white/90">
            {language === "en"
              ? "New notices, tenders, and service updates available for Ward 24(D)."
              : "वॉर्ड २४(ड) साठी नवीन सूचना, टेंडर्स व सेवा अपडेट्स उपलब्ध आहेत."}
          </div>
          <Link href="/services" className="text-white font-semibold">
            {t("common.viewAll", language)} →
          </Link>
        </div>
      </section>
      {/* Biography */}
      <section className="relative py-12 bg-gradient-to-br from-white via-[#f6f3ef] to-[#fff4e3] overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-20 -left-10 h-56 w-56 rounded-full bg-orange-200 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-blue-200 blur-3xl" />
        </div>
        <div className="relative container-responsive px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 rounded-3xl border border-white shadow-xl p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="text-xs uppercase tracking-[0.25em] text-orange-600 font-semibold">
                {language === "en" ? "Biography" : "परिचय"}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
                {language === "en" ? "Serving Ward 24(D)" : "वॉर्ड २४(ड) सेवा"}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.6fr] gap-8 items-start">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white max-w-sm mx-auto lg:mx-0 aspect-[4/5] lg:self-start">
                <img
                  src="/bjp.jpeg"
                  alt={language === "en" ? "Corporator Sachin Lavate" : "नगरसेवक सचिन लवटे"}
                  className="w-full  "
                  loading="lazy"
                />
                <div className="absolute bottom-0 inset-x-0  p-4">
                  <div className="text-black font-semibold">
                    {language === "en" ? "Corporator Sachin Lavate" : "नगरसेवक सचिन लवटे"}
                  </div>
                  <div className="text-black/80 text-xs">
                    {language === "en" ? "Ward 24(D), Nerul" : "वॉर्ड २४(ड), नेरूळ"}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 text-base md:text-lg leading-relaxed space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    {language === "en" ? "Citizen First" : "नागरिक प्रथम"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {language === "en" ? "Ward 24(D)" : "वॉर्ड २४(ड)"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {language === "en" ? "Nerul" : "नेरूळ"}
                  </span>
                </div>
                <p>
                  {language === "en"
                    ? "Corporator Sachin Lavate has been committed to the development of Ward 24(D), Nerul, with a clear focus on essential services, citizen welfare, and transparent governance."
                    : "नगरसेवक सचिन लवटे यांनी वॉर्ड २४(ड), नेरूळच्या विकासासाठी मूलभूत सुविधा, नागरिक कल्याण आणि पारदर्शक प्रशासन यावर सातत्याने लक्ष केंद्रित केले आहे."}
                </p>
                <p>
                  {language === "en"
                    ? "His approach blends on-ground problem solving with long-term planning—ensuring reliable water supply, safer streets, and better civic amenities for every household."
                    : "त्यांचा दृष्टिकोन प्रत्यक्ष कामगिरी आणि दीर्घकालीन नियोजन यांची सांगड घालतो—पाणीपुरवठा, सुरक्षित रस्ते आणि उत्तम नागरी सुविधा यासाठी सातत्यपूर्ण प्रयत्न."}
                </p>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    {language === "en" ? "Key focus areas" : "मुख्य लक्ष क्षेत्रे"}
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>
                      {language === "en"
                        ? "Grievance redressal with quick updates and follow-ups."
                        : "तक्रारींवर जलद प्रतिसाद आणि नियमित फॉलो-अप."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Road, drainage, and street-light maintenance."
                        : "रस्ते, ड्रेनेज आणि स्ट्रीट-लाईट देखभाल."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Health camps, sanitation drives, and cleanliness awareness."
                        : "आरोग्य शिबिरे, स्वच्छता मोहीम आणि जनजागृती उपक्रम."}
                    </li>
                    <li>
                      {language === "en"
                        ? "Women and youth safety initiatives with community support."
                        : "महिला आणि युवक सुरक्षा उपक्रमांमध्ये समुदायाचा सहभाग."}
                    </li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 bg-orange-50/70 p-4 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900">
                    {language === "en"
                      ? "“A stronger ward starts with listening to every citizen.”"
                      : "“प्रत्येक नागरिकाचा आवाज ऐकणे हेच मजबूत वॉर्डचे आधार आहे.”"}
                  </div>
                </div>
                <div>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition shadow-md"
                  >
                    {language === "en" ? "Read More" : "अधिक वाचा"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#F47216] font-semibold">
                {language === "en" ? "Focus Areas" : "लक्ष केंद्र"}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                {language === "en" ? "Ward 24(D) Priorities" : "वॉर्ड २४(ड) प्राधान्यक्रम"}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                {language === "en"
                  ? "BJP-inspired saffron & green theme with citizen-first initiatives."
                  : "भाजप प्रेरित केशरी-हिरवा थीम आणि नागरिक-केंद्रित उपक्रम."}
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition"
            >
              {language === "en" ? "View Services" : "सेवा पाहा"} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {homeHighlights.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div
                  className={`mb-4 h-11 w-11 rounded-2xl flex items-center justify-center ${
                    item.accent === "saffron"
                      ? "bg-[#F47216]/10 text-[#F47216]"
                      : "bg-[#00A650]/10 text-[#00A650]"
                  }`}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News / Events / Commissioner */}
      {/* <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.3fr_1fr_0.9fr] gap-6">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-4">
              {["news", "videos", "links"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    activeTab === tab
                      ? "bg-[#0b3d91] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tab === "news" && (language === "en" ? "News" : "बातम्या")}
                  {tab === "videos" && (language === "en" ? "Video Gallery" : "व्हिडिओ")}
                  {tab === "links" && (language === "en" ? "Quick Links" : "दुवे")}
                </button>
              ))}
            </div>
            {activeTab === "news" && (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div key={item.title} className="border-b border-gray-100 pb-3">
                    <div className="text-xs text-gray-500">{item.date}</div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "videos" && (
              <div className="text-sm text-gray-600">
                {language === "en"
                  ? "Video updates will appear here."
                  : "व्हिडिओ अपडेट्स येथे दिसतील."}
              </div>
            )}
            {activeTab === "links" && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {services.map((service) => (
                  <Link key={service.title} href={service.link} className="text-[#0b3d91] font-semibold">
                    {service.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              {language === "en" ? "Events & Archive" : "कार्यक्रम आणि संग्रह"}
            </h3>
            <div className="space-y-3">
              {announcements.map((item) => (
                <div key={item.title} className="border-b border-gray-100 pb-2">
                  <div className="text-xs text-gray-500">{item.date}</div>
                  <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section> */}

      {/* Journey */}
      <section className="py-16  ">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-center sm:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {language === "en" ? "Journey" : "प्रवास"}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                {language === "en"
                  ? "Highlights of public service and community work"
                  : "जनसेवा आणि समुदाय कार्याचे प्रमुख क्षण"}
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition"
            >
              {t("common.viewAll", language)} →
            </Link>
          </div>
          <div
            className={`overflow-hidden select-none ${isJourneyDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ touchAction: "pan-y" }}
            onWheel={handleJourneyWheel}
            onPointerDown={handleJourneyPointerDown}
            onPointerMove={handleJourneyPointerMove}
            onPointerUp={handleJourneyPointerUp}
            onPointerCancel={handleJourneyPointerUp}
            onPointerLeave={handleJourneyPointerUp}
            onMouseDown={handleJourneyMouseDown}
            onMouseMove={handleJourneyMouseMove}
            onMouseUp={handleJourneyMouseUp}
            onMouseLeave={handleJourneyMouseUp}
            onTouchStart={handleJourneyTouchStart}
            onTouchMove={handleJourneyTouchMove}
            onTouchEnd={handleJourneyTouchEnd}
            onTouchCancel={handleJourneyTouchEnd}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out -mx-2"
              style={{ transform: `translateX(-${journeyIndex * (100 / journeyItemsPerView)}%)` }}
            >
              {journeyItems.map((item) => (
                <div
                  key={item.title}
                  className="px-2 shrink-0"
                  style={{ flex: `0 0 ${100 / journeyItemsPerView}%` }}
                >
                  <div className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-white">
                    <div
                      className="h-40 sm:h-44 lg:h-40 bg-cover  bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-white/80 mt-1">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: journeySteps }).map((_, index) => (
              <button
                key={`journey-dot-${index}`}
                type="button"
                aria-label={`${language === "en" ? "Go to slide" : "स्लाइड"} ${index + 1}`}
                onClick={() => setJourneyIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === journeyIndex ? "bg-orange-500" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-12 bg-white">
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
          onLoad={handleInstagramLoad}
        />
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F47216]/10 text-[#F47216] flex items-center justify-center">
                <FiPlay className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-[#F47216] font-semibold">
                  {language === "en" ? "Videos" : "व्हिडिओ"}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {language === "en" ? "Instagram Updates" : "इन्स्टाग्राम अपडेट्स"}
                </h3>
              </div>
            </div>
            <Link
              href="https://www.instagram.com/samajsevaksachinlavate/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-[#F47216] text-white text-sm font-semibold rounded-md hover:bg-[#E85D00] transition"
            >
              {language === "en" ? "View All" : "सर्व पहा"}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "https://www.instagram.com/reel/DUVeWRGiL6R/",
              "https://www.instagram.com/reel/DTvuyTDDP7v/",
              "https://www.instagram.com/reel/DUV-a2AjNiH/"
            ].map((url) => (
              <div
                key={url}
                className="rounded-xl border border-gray-200 bg-white shadow-sm p-3"
              >
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                  style={{ background: "#fff", border: 0, margin: 0, padding: 0, width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ward Map */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="font-bold text-gray-900 text-xl">
              {language === "en" ? "Ward 24(D) Map" : "वॉर्ड २४(ड) नकाशा"}
            </h3>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="text-sm font-semibold text-[#0b3d91] hover:text-[#0b3d91]/80"
            >
              {language === "en" ? "Open Large Map" : "मोठा नकाशा उघडा"} →
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="rounded-2xl overflow-hidden h-72 md:h-96 border border-gray-200 w-full text-left cursor-pointer"
            aria-label={language === "en" ? "Open ward map" : "वॉर्ड नकाशा उघडा"}
          >
            {showMapModal ? (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                {language === "en" ? "Map opened in modal" : "नकाशा मोठ्या मोडलमध्ये उघडला आहे"}
              </div>
            ) : (
              <LeafletMap
                center={[19.0285, 73.012]}
                zoom={13}
                title={language === "en" ? "Ward Office 24(D), Nerul" : "वॉर्ड ऑफिस २४(ड), नेरुळ"}
                boundary={[
                  [19.03687319007652, 73.01730963706083],
                  [19.03724752853904, 73.01464766140126],
                  [19.036977173067413, 73.01431766441888],
                  [19.03712274914534, 73.01235968232166],
                  [19.035521405268398, 73.01240368191935],
                  [19.035708576128798, 73.00877371511157],
                  [19.03820416744351, 73.0095657078692],
                  [19.037966476044545, 73.00342980420871],
                  [19.038706184326614, 72.99968498495792],
                  [19.037385292019053, 72.99946143113189],
                  [19.03606438961647, 72.9997409115723],
                  [19.02861437821869, 73.00186477885936],
                  [19.02171686628266, 73.00069648544019],
                  [19.02118459785426, 73.00860544550233],
                  [19.022223787010574, 73.00863225553647],
                  [19.022097056973564, 73.00943655655894],
                  [19.022198441010914, 73.01045533785538],
                  [19.023339007170307, 73.0116885994245],
                  [19.02346573626025, 73.01284143089131],
                  [19.024302145831015, 73.01391383225473],
                  [19.02306020283227, 73.01541519416466],
                  [19.02199567287434, 73.01431598276722],
                  [19.021285982448248, 73.01289505095951],
                  [19.02029748001773, 73.01380659211836],
                  [19.01905550709236, 73.01313634126626],
                  [19.01824441772456, 73.01214437000394],
                  [19.015050714865694, 73.01565648447263],
                  [19.02115925169612, 73.02150107190792],
                  [19.0236685026031, 73.01769404706423],
                  [19.024783713067407, 73.01697017614396],
                  [19.026177715622225, 73.01667526576779],
                  [19.028357405266974, 73.01734551662116],
                  [19.030486376846014, 73.01814981764372],
                  [19.033654438802998, 73.01863239825846],
                  [19.03462061412918, 73.0189872071181],
                  [19.036758273946504, 73.0184941011488],
                  [19.036886493553524, 73.01702469218523],
                  [19.03687319007652, 73.01730963706083]
                ]}
              />
            )}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            {language === "en"
              ? "Ward boundary shown for reference."
              : "वॉर्डची सीमा संदर्भासाठी दाखवली आहे."}
          </p>
        </div>
      </section>

      {showMapModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="font-semibold text-gray-900">
                {language === "en" ? "Ward 24(D) Map" : "वॉर्ड २४(ड) नकाशा"}
              </div>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close map"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="h-[70vh] w-full rounded-xl overflow-hidden border border-gray-200">
                <LeafletMap
                  center={[19.0285, 73.012]}
                  zoom={13}
                  title={language === "en" ? "Ward Office 24(D), Nerul" : "वॉर्ड ऑफिस २४(ड), नेरुळ"}
                  boundary={[
                    [19.03687319007652, 73.01730963706083],
                    [19.03724752853904, 73.01464766140126],
                    [19.036977173067413, 73.01431766441888],
                    [19.03712274914534, 73.01235968232166],
                    [19.035521405268398, 73.01240368191935],
                    [19.035708576128798, 73.00877371511157],
                    [19.03820416744351, 73.0095657078692],
                    [19.037966476044545, 73.00342980420871],
                    [19.038706184326614, 72.99968498495792],
                    [19.037385292019053, 72.99946143113189],
                    [19.03606438961647, 72.9997409115723],
                    [19.02861437821869, 73.00186477885936],
                    [19.02171686628266, 73.00069648544019],
                    [19.02118459785426, 73.00860544550233],
                    [19.022223787010574, 73.00863225553647],
                    [19.022097056973564, 73.00943655655894],
                    [19.022198441010914, 73.01045533785538],
                    [19.023339007170307, 73.0116885994245],
                    [19.02346573626025, 73.01284143089131],
                    [19.024302145831015, 73.01391383225473],
                    [19.02306020283227, 73.01541519416466],
                    [19.02199567287434, 73.01431598276722],
                    [19.021285982448248, 73.01289505095951],
                    [19.02029748001773, 73.01380659211836],
                    [19.01905550709236, 73.01313634126626],
                    [19.01824441772456, 73.01214437000394],
                    [19.015050714865694, 73.01565648447263],
                    [19.02115925169612, 73.02150107190792],
                    [19.0236685026031, 73.01769404706423],
                    [19.024783713067407, 73.01697017614396],
                    [19.026177715622225, 73.01667526576779],
                    [19.028357405266974, 73.01734551662116],
                    [19.030486376846014, 73.01814981764372],
                    [19.033654438802998, 73.01863239825846],
                    [19.03462061412918, 73.0189872071181],
                    [19.036758273946504, 73.0184941011488],
                    [19.036886493553524, 73.01702469218523],
                    [19.03687319007652, 73.01730963706083]
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
