"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiAward,
  FiAlertCircle,
  FiPhone,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiHeart,
  FiPlusSquare,
  FiBookOpen,
  FiHome,
  FiActivity,
  FiMapPin,
  FiTool,
  FiFlag,
  FiUserCheck
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
  const [activeGalleryItem, setActiveGalleryItem] = useState(null);
  const [showMobileServices, setShowMobileServices] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const workGallery = [
    {
      title: language === "en" ? "Cultural Programs" : "सांस्कृतिक कार्यक्रम",
      items: [
        {
          label: language === "en" ? "Diwali Celebration" : "दिवाळी उत्सव",
          image: "/gallery/support/1.png",
          modalImages: [
            "/gallery/support/3.png",
            "/gallery/support/8.png",
            "/gallery/support/2.png"
          ]
        },
        {
          label: language === "en" ? "Rangoli Competition" : "रांगोळी स्पर्धा",
          image: "/gallery/support/2.png",
          modalImages: [
            "/gallery/support/8.png",
            "/gallery/support/6.png",
            "/gallery/support/2.png"
          ]
        },
        {
          label: language === "en" ? "Ganeshotsav Support" : "गणेशोत्सव सहाय्य",
          image: "/gallery/support/3.png",
          modalImages: [
            "/gallery/support/5.png",
            "/gallery/support/3.png",
            "/gallery/support/5.png"
          ]
        }
      ]
    },
    {
      title: language === "en" ? "Health & Cleanliness" : "आरोग्य व स्वच्छता",
      items: [
        {
          label: language === "en" ? "Health Camp" : "आरोग्य शिबिर",
          image: "/gallery/support/6.png",
          modalImages: [
            "/gallery/support/2.png",
            "/gallery/support/1.png",
            "/gallery/support/7.png"
          ]
        },
        {
          label: language === "en" ? "Cleanliness Drive" : "स्वच्छता मोहीम",
          image: "/gallery/support/3.png",
          modalImages: [
            "/gallery/support/7.png",
            "/gallery/support/4.png",
            "/gallery/support/3.png"
          ]
        },
        {
          label: language === "en" ? "Ayushman Support" : "आयुष्मान सहाय्य",
          image: "/gallery/11.jpg",
          modalImages: [
            "/gallery/support/5.png",
            "/gallery/support/3.png",
            "/gallery/support/1.png"
          ]
        }
      ]
    },
    {
      title: language === "en" ? "Development Works" : "विकासकामे",
      items: [
        {
          label: language === "en" ? "Road Repair" : "रस्ता दुरुस्ती",
          image: "/gallery/support/4.png",
          modalImages: [
            "/gallery/support/3.png",
            "/gallery/support/2.png",
            "/gallery/support/1.png"
          ]
        },
        {
          label: language === "en" ? "Drainage Upgrade" : "गटार सुधारणा",
          image: "/gallery/support/5.png",
          modalImages: [
            "/gallery/support/7.png",
            "/gallery/support/5.png",
            "/gallery/support/2.png"
          ]
        },
        {
          label: language === "en" ? "Water Supply" : "पाणीपुरवठा",
          image: "/gallery/support/6.png",
          modalImages: [
            "/gallery/support/8.png",
            "/gallery/support/8.png",
            "/gallery/support/8.png"
          ]
        }
      ]
    },
    {
      title: language === "en" ? "Sports & Youth" : "क्रीडा व युवक",
      items: [
        {
          label: language === "en" ? "Yuva Cup" : "युवा कप",
          image: "/gallery/support/6.png",
          modalImages: [
            "/gallery/support/7.png",
            "/gallery/support/8.png",
            "/gallery/support/5.png"
          ]
        },
        {
          label: language === "en" ? "Community Sports" : "समुदाय क्रीडा",
          image: "/gallery/support/7.png",
          modalImages: [
            "/gallery/support/1.png",
            "/gallery/support/2.png",
            "/gallery/support/1.png"
          ]
        },
        {
          label: language === "en" ? "Youth Guidance" : "युवक मार्गदर्शन",
          image: "/gallery/support/8.png",
          modalImages: [
            "/gallery/support/7.png",
            "/gallery/support/6.png",
            "/gallery/support/3.png"
          ]
        }
      ]
    }
  ];

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

  const utilities = [
    { title: language === "en" ? "Primary Health Centre" : "प्राथमिक आरोग्य केंद्र", value: "26", icon: <FiHeart className="w-6 h-6" /> },
    { title: language === "en" ? "General Hospitals" : "सामान्य रुग्णालये", value: "3", icon: <FiPlusSquare className="w-6 h-6" /> },
    { title: language === "en" ? "Mother & Child" : "माता‑बाल रुग्णालय", value: "2", icon: <FiUserCheck className="w-6 h-6" /> },
    { title: language === "en" ? "Primary Schools" : "प्राथमिक शाळा", value: "57", icon: <FiBookOpen className="w-6 h-6" /> },
    { title: language === "en" ? "Secondary Schools" : "माध्यमिक शाळा", value: "23", icon: <FiBookOpen className="w-6 h-6" /> },
    { title: language === "en" ? "Recreation Centres" : "मनोरंजन केंद्रे", value: "35", icon: <FiActivity className="w-6 h-6" /> },
    { title: language === "en" ? "Libraries" : "ग्रंथालय", value: "1", icon: <FiBookOpen className="w-6 h-6" /> },
    { title: language === "en" ? "Night Shelters" : "रात्र निवारे", value: "2", icon: <FiHome className="w-6 h-6" /> },
    { title: language === "en" ? "Fire Stations" : "फायर स्टेशन्स", value: "5", icon: <FiFlag className="w-6 h-6" /> },
    { title: language === "en" ? "Training Centres" : "प्रशिक्षण केंद्रे", value: "2", icon: <FiTool className="w-6 h-6" /> }
  ];

  const gallery = [
    { title: language === "en" ? "Amusement Park" : "मनोरंजन उद्यान" },
    { title: language === "en" ? "Wonder Park" : "वंडर पार्क" },
    { title: language === "en" ? "Jewel of Navi Mumbai" : "ज्वेल ऑफ नवी मुंबई" }
  ];

  const schemes = [
    { title: "Majhi Vasundhara", desc: language === "en" ? "Environment awareness initiative" : "पर्यावरण जनजागृती उपक्रम" },
    { title: "AMRUT 2.0", desc: language === "en" ? "Urban transformation mission" : "शहरी परिवर्तन मिशन" },
    { title: "NCAP", desc: language === "en" ? "Clean air program" : "स्वच्छ हवा कार्यक्रम" },
    { title: language === "en" ? "Waste Segregation" : "कचरा वर्गीकरण", desc: language === "en" ? "Dry & wet segregation" : "ओला व सुका कचरा वर्गीकरण" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdModal(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full w-full md:w-72">
              <FiSearch className="text-white/80" />
              <input
                className="bg-transparent placeholder-white/70 text-white text-sm outline-none w-full"
                placeholder={language === "en" ? "Search" : "शोधा"}
              />
            </div>
            <Link
              href="/contact"
              className="hidden md:inline-flex px-4 py-2 bg-white text-[#0b3d91] rounded-full text-sm font-semibold"
            >
              {language === "en" ? "Contact" : "संपर्क"}
            </Link>
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
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${slide.image})`,
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
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/40"
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
    <div className="fixed inset-0 z-50 hidden md:block">
      <div
        className="absolute inset-0 bg-black/40"
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

      {/* News / Events / Commissioner */}
      <section className="py-12">
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

          <div className="bg-white  shadow-md p-4">
            <h3 className="font-bold text-gray-900 mb-4">
              {language === "en" ? "Ward 24(D) Map" : "वॉर्ड २४(ड) नकाशा"}
            </h3>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="rounded-xl overflow-hidden h-56 border border-gray-200 w-full text-left cursor-pointer"
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
        </div>
      </section>

      {/* Public Utilities */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0b3d91] text-white rounded-xl px-4 py-2 text-center font-semibold mb-6">
            {language === "en" ? "Public Utilities" : "सार्वजनिक सुविधा"}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {utilities.map((item) => (
              <div key={item.title} className="bg-[#0b3d91] text-white rounded-xl p-4 text-center shadow-md">
                <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{item.value}</div>
                <div className="text-xs font-semibold">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === "en" ? "Work Gallery" : "कार्य गॅलरी"}
            </h2>
            <Link href="/gallery" className="text-[#0b3d91] font-semibold">
              {t("common.viewAll", language)} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workGallery.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl shadow-md p-5">
                <div className="text-lg font-bold text-gray-900 mb-4">{section.title}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveGalleryItem(item);
                      }}
                      className="rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow"
                    >
                      <div
                        className="h-30 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800">
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {language === "en"
              ? "Demo images loaded online (Picsum). Replace with your own later."
              : "डेमो फोटो ऑनलाइन (Picsum) वापरले आहेत. नंतर तुमचे फोटो लावा."}
          </div>
        </div>
      </section>

      {/* Schemes */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {schemes.map((scheme) => (
              <div key={scheme.title} className="bg-[#f0f4ff] rounded-xl p-4 border border-[#d9e2ff]">
                <div className="h-12 bg-white rounded-lg mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">{scheme.title}</h4>
                <p className="text-sm text-gray-600">{scheme.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  {activeGalleryItem && (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={() => setActiveGalleryItem(null)}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{activeGalleryItem.label}</h3>
          <button
            onClick={() => setActiveGalleryItem(null)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close gallery"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeGalleryItem.modalImages.map((src, idx) => (
            <div
              key={`${activeGalleryItem.label}-${idx}`}
              className="h-40 rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
            <div className="mt-4 text-sm text-gray-600">
              {language === "en"
                ? "Demo online photos. Replace with your own photos later."
                : "डेमो ऑनलाइन फोटो. नंतर तुमचे फोटो लावा."}
            </div>
          </div>
        </div>
      )}
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

      {showAdModal && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowAdModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="font-semibold text-gray-900">Advertisement</div>
              <button
                type="button"
                onClick={() => setShowAdModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close advertisement"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <img
                src="/advertising.jpeg"
                alt="Advertisement"
                className="w-full h-auto rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
