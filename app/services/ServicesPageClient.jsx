"use client";

import { 
  FiSettings, FiFileText, FiShield, FiDroplet, 
  FiZap, FiHeart, FiPhone
} from "react-icons/fi";
import { 
  GiWaterTank, GiRoad, GiStreetLight, GiHealthNormal,
  GiTreehouse, GiAmbulance
} from "react-icons/gi";
import { GoPeople } from "react-icons/go";
import { MdLocalHospital, MdSchool, MdCleaningServices } from "react-icons/md";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function ServicesPage() {
  const { language } = useLanguage();

  const services = [
    {
      icon: <GiWaterTank className="w-8 h-8" />,
      title: language === "en" ? "Water Supply" : "पाणीपुरवठा",
      description: language === "en" 
        ? "New connections, complaint resolution, water quality testing"
        : "नवीन कनेक्शन, तक्रार निवारण, पाण्याची गुणवत्ता चाचणी",
      category: "essential",
      link: "#water"
    },
    {
      icon: <GiRoad className="w-8 h-8" />,
      title: language === "en" ? "Road Maintenance" : "रस्ते देखभाल",
      description: language === "en" 
        ? "Pothole repair, road widening, footpath construction"
        : "खड्डे दुरुस्ती, रस्ता रुंदीकरण, फुटपाथ बांधकाम",
      category: "essential",
      link: "#roads"
    },
    {
      icon: <GiStreetLight className="w-8 h-8" />,
      title: language === "en" ? "Street Lights" : "स्ट्रीट लाइट",
      description: language === "en" 
        ? "New installations, repairs, complaints for non-working lights"
        : "नवीन स्थापना, दुरुस्ती, न काम करणाऱ्या लाइटसाठी तक्रारी",
      category: "essential",
      link: "#lights"
    },
    {
      icon: <GiHealthNormal className="w-8 h-8" />,
      title: language === "en" ? "Health Services" : "आरोग्य सेवा",
      description: language === "en" 
        ? "Medical camps, vaccination drives, health checkups"
        : "वैद्यकीय शिबिरे, लसीकरण मोहीम, आरोग्य तपासणी",
      category: "health",
      link: "#health"
    },
    {
      icon: <MdSchool className="w-8 h-8" />,
      title: language === "en" ? "Education" : "शिक्षण",
      description: language === "en" 
        ? "School admissions, scholarship assistance, study materials"
        : "शाळा प्रवेश, शिष्यवृत्ती सहाय्य, अभ्यास साहित्य",
      category: "education",
      link: "#education"
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: language === "en" ? "Safety & Security" : "सुरक्षा",
      description: language === "en" 
        ? "Police assistance, CCTV installation, women safety"
        : "पोलीस मदत, सीसीटीव्ही स्थापना, महिला सुरक्षा",
      category: "security",
      link: "#security"
    },
    {
      icon: <MdCleaningServices className="w-8 h-8" />,
      title: language === "en" ? "Sanitation" : "स्वच्छता",
      description: language === "en" 
        ? "Garbage collection, drain cleaning, public toilet maintenance"
        : "कचरा संकलन, ड्रेनेज सफाई, सार्वजनिक शौचालय देखभाल",
      category: "essential",
      link: "#sanitation"
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: language === "en" ? "Documentation" : "दस्तऐवजीकरण",
      description: language === "en" 
        ? "Birth/Death certificates, Property documents, Legal assistance"
        : "जन्म/मृत्यू प्रमाणपत्रे, मालमत्ता दस्तऐवज, कायदेशीर मदत",
      category: "documentation",
      link: "#documents"
    }
  ];

  const governmentSchemes = [
    {
      name: language === "en" ? "PM Awas Yojana" : "पीएम आवास योजना",
      icon: "🏠",
      description: language === "en" ? "Housing for all" : "सर्वांसाठी घरे",
      beneficiaries: "250+ families",
      link: "https://pmay-urban.gov.in/"
    },
    {
      name: language === "en" ? "Ayushman Bharat" : "आयुष्मान भारत",
      icon: "🏥",
      description: language === "en" ? "Health insurance" : "आरोग्य विमा",
      beneficiaries: "500+ cards issued",
      link: "https://pmjay.gov.in/"
    },
    {
      name: language === "en" ? "Ujjwala Yojana" : "उज्ज्वला योजना",
      icon: "🔥",
      description: language === "en" ? "Free LPG connections" : "मोफत एलपीजी कनेक्शन",
      beneficiaries: "300+ connections",
      link: "https://www.pmuy.gov.in/"
    },
    {
      name: language === "en" ? "Kisan Samman Nidhi" : "किसान सम्मान निधी",
      icon: "👨‍🌾",
      description: language === "en" ? "Farmer support" : "शेतकरी समर्थन",
      beneficiaries: "150+ farmers",
      link: "https://pmkisan.gov.in/"
    }
  ];

  const emergencyServices = [
    {
      name: language === "en" ? "Ambulance" : "एंब्युलन्स",
      number: "108",
      icon: <GiAmbulance className="w-6 h-6" />
    },
    {
      name: language === "en" ? "Fire Brigade" : "फायर ब्रिगेड",
      number: "101",
      icon: <FiZap className="w-6 h-6" />
    },
    {
      name: language === "en" ? "Police" : "पोलीस",
      number: "100",
      icon: <FiShield className="w-6 h-6" />
    },
    {
      name: language === "en" ? "Women Helpline" : "महिला हेल्पलाइन",
      number: "1091",
      icon: <FiHeart className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("nav.services", language)}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {language === "en" 
                ? "Access all public services and government schemes at your doorstep"
                : "तुमच्या दारातून सर्व सार्वजनिक सेवा आणि सरकारी योजनांचा उपयोग करा"}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-xl">
                <div className={`w-16 h-16 rounded-2xl ${
                  service.category === 'essential' ? 'bg-blue-50 text-blue-600' :
                  service.category === 'health' ? 'bg-red-50 text-red-600' :
                  service.category === 'education' ? 'bg-green-50 text-green-600' :
                  'bg-purple-50 text-purple-600'
                } flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link 
                  href={service.link}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {language === "en" ? "Access Service" : "सेवा मिळवा"} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes */}
      <section className="py-12 bg-gradient-to-r from-[#FF9933] to-[#138808]">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-white text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {language === "en" ? "Government Schemes" : "सरकारी योजना"}
            </h2>
            <p className="opacity-90 max-w-2xl mx-auto">
              {language === "en" 
                ? "Apply for various central and state government schemes"
                : "विविध केंद्र आणि राज्य सरकारी योजनांसाठी अर्ज करा"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {governmentSchemes.map((scheme, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="text-3xl mb-3">{scheme.icon}</div>
                <h4 className="font-bold text-lg mb-2">{scheme.name}</h4>
                <p className="text-sm opacity-90 mb-3">{scheme.description}</p>
                <div className="text-sm opacity-80">
                  {language === "en" ? "Beneficiaries" : "लाभार्थी"}: {scheme.beneficiaries}
                </div>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors inline-flex items-center justify-center"
                >
                  {language === "en" ? "Apply Now" : "आता अर्ज करा"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {language === "en" ? "Emergency Services" : "आपत्कालीन सेवा"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyServices.map((service, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <div className="text-red-600">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <div className="text-2xl font-bold text-red-600 mb-4">{service.number}</div>
                <p className="text-gray-600 text-sm">
                  {language === "en" ? "24/7 Available" : "२४/७ उपलब्ध"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Need Help with Services?" : "सेवांसाठी मदत हवी आहे?"}
            </h2>
            <p className="text-gray-700 mb-8">
              {language === "en" 
                ? "Our team is available to help you with any service-related queries or issues."
                : "कोणत्याही सेवा-संबंधित प्रश्न किंवा समस्यांसाठी आमची टीम तुमच्या मदतीसाठी उपलब्ध आहे."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn-primary flex items-center gap-2"
              >
                <FiPhone className="w-5 h-5" />
                {t("nav.contact", language)}
              </Link>
              <Link 
                href="/complaints" 
                className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <FiSettings className="w-5 h-5" />
                {t("nav.complaints", language)}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

