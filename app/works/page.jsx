"use client";

import { useState } from "react";
import { 
  FiMapPin, FiCalendar, FiCheckCircle, FiClock, 
  FiUsers, FiFilter, FiTrendingUp, FiEye
} from "react-icons/fi";
import { GiRoad, GiWaterTank, GiStreetLight, GiHealthNormal } from "react-icons/gi";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function WorksPage() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");

  const workCategories = [
    { id: "all", name: language === "en" ? "All Works" : "सर्व कार्ये" },
    { id: "roads", name: language === "en" ? "Roads" : "रस्ते" },
    { id: "drainage", name: language === "en" ? "Drainage" : "ड्रेनेज" },
    { id: "water", name: language === "en" ? "Water Supply" : "पाणीपुरवठा" },
    { id: "lights", name: language === "en" ? "Street Lights" : "स्ट्रीट लाइट" },
    { id: "cleaning", name: language === "en" ? "Cleanliness" : "स्वच्छता" }
  ];

  const developmentWorks = [
    {
      id: 1,
      title: language === "en" ? "Road Repair & Widening" : "रस्ता दुरुस्ती आणि रुंदीकरण",
      category: "roads",
      location: language === "en" ? "Main Road, Ward 45" : "मुख्य रस्ता, वॉर्ड ४५",
      date: language === "en" ? "15 Jan 2024" : "१५ जानेवारी २०२४",
      status: "completed",
      progress: 100,
      budget: language === "en" ? "₹38 Lakhs" : "३८ लाख रुपये",
      description: language === "en" 
        ? "Complete reconstruction of 2km road with proper drainage system"
        : "उचित ड्रेनेज सिस्टमसह 2 किमी रस्त्याचे संपूर्ण पुनर्बांधणी",
      icon: <GiRoad className="w-8 h-8" />
    },
    {
      id: 2,
      title: language === "en" ? "Drainage System Upgrade" : "ड्रेनेज सिस्टम अपग्रेड",
      category: "drainage",
      location: language === "en" ? "Ganesh Nagar" : "गणेश नगर",
      date: language === "en" ? "10 Feb 2024" : "१० फेब्रुवारी २०२४",
      status: "completed",
      progress: 100,
      budget: language === "en" ? "₹52 Lakhs" : "५२ लाख रुपये",
      description: language === "en"
        ? "New underground drainage system to prevent waterlogging"
        : "पाणी साचणे टाळण्यासाठी नवीन भूमिगत ड्रेनेज सिस्टम",
      icon: <GiWaterTank className="w-8 h-8" />
    },
    {
      id: 3,
      title: language === "en" ? "Water Pipeline Installation" : "पाणी पाईपलाइन स्थापना",
      category: "water",
      location: language === "en" ? "Shivaji Chowk Area" : "शिवाजी चौक क्षेत्र",
      date: language === "en" ? "5 Mar 2024" : "५ मार्च २०२४",
      status: "in-progress",
      progress: 65,
      budget: language === "en" ? "₹45 Lakhs" : "४५ लाख रुपये",
      description: language === "en"
        ? "24x7 water supply pipeline installation work"
        : "24x7 पाणीपुरवठा पाईपलाइन स्थापना काम",
      icon: <GiWaterTank className="w-8 h-8" />
    },
    {
      id: 4,
      title: language === "en" ? "LED Street Lights Installation" : "एलईडी स्ट्रीट लाइट स्थापना",
      category: "lights",
      location: language === "en" ? "Entire Ward 45" : "संपूर्ण वॉर्ड ४५",
      date: language === "en" ? "20 Dec 2023" : "२० डिसेंबर २०२३",
      status: "completed",
      progress: 100,
      budget: language === "en" ? "₹32 Lakhs" : "३२ लाख रुपये",
      description: language === "en"
        ? "Installation of 250 LED street lights for better visibility"
        : "चांगल्या दृश्यतेसाठी 250 एलईडी स्ट्रीट लाइटची स्थापना",
      icon: <GiStreetLight className="w-8 h-8" />
    },
    {
      id: 5,
      title: language === "en" ? "Garbage Management System" : "कचरा व्यवस्थापन प्रणाली",
      category: "cleaning",
      location: language === "en" ? "Market Area" : "बाजार क्षेत्र",
      date: language === "en" ? "28 Feb 2024" : "२८ फेब्रुवारी २०२४",
      status: "completed",
      progress: 100,
      budget: language === "en" ? "₹28 Lakhs" : "२८ लाख रुपये",
      description: language === "en"
        ? "New waste segregation and management system"
        : "नवीन कचरा वेगळे करणे आणि व्यवस्थापन प्रणाली",
      icon: <GiHealthNormal className="w-8 h-8" />
    },
    {
      id: 6,
      title: language === "en" ? "Park Renovation" : "पार्क रिनोव्हेशन",
      category: "all",
      location: language === "en" ? "Children's Park" : "बालवाडी पार्क",
      date: language === "en" ? "15 Mar 2024" : "१५ मार्च २०२४",
      status: "in-progress",
      progress: 25,
      budget: language === "en" ? "₹28 Lakhs" : "२८ लाख रुपये",
      description: language === "en"
        ? "Complete renovation of public park with new facilities"
        : "नवीन सुविधांसह सार्वजनिक पार्कचे संपूर्ण रिनोव्हेशन",
      icon: <GiHealthNormal className="w-8 h-8" />
    }
  ];

  const stats = [
    {
      title: language === "en" ? "Total Projects" : "एकूण प्रकल्प",
      value: "89",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: language === "en" ? "Completed" : "पूर्ण",
      value: "78",
      color: "bg-green-50 text-green-600"
    },
    {
      title: language === "en" ? "In Progress" : "चालू",
      value: "11",
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: language === "en" ? "Budget Utilized" : "बजेट वापर",
      value: "₹4.2 Cr",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const filteredWorks = activeFilter === "all" 
    ? developmentWorks 
    : developmentWorks.filter(work => work.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("nav.works", language)}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {language === "en" 
                ? "Transparent tracking of all development works in Ward 24(D)"
                : "वॉर्ड २४(ड) मधील सर्व विकास कार्यांची पारदर्शक ट्रॅकिंग"}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className={`p-6 rounded-xl ${stat.color}`}>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="font-medium">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-6 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {workCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === category.id
                    ? 'bg-gradient-to-r from-[#FF9933] to-[#FF6600] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => (
              <div key={work.id} className="card hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    {work.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    work.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {work.status === 'completed' 
                      ? (language === "en" ? "Completed" : "पूर्ण")
                      : (language === "en" ? "In Progress" : "चालू")}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{work.title}</h3>
                <p className="text-gray-600 mb-4">{work.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiMapPin className="w-4 h-4" />
                    {work.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4" />
                    {work.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiTrendingUp className="w-4 h-4" />
                    {work.budget}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{language === "en" ? "Progress" : "प्रगती"}</span>
                    <span>{work.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        work.progress < 30 ? 'bg-red-500' :
                        work.progress < 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${work.progress}%` }}
                    />
                  </div>
                </div>
                
                <Link 
                  href={`/works/${work.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FiEye className="w-4 h-4" />
                  {t("common.viewDetails", language)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Projects */}
      <section className="py-12 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {language === "en" ? "Upcoming Projects" : "आगामी प्रकल्प"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <div className="text-purple-600 text-2xl">🏥</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Community Health Center" : "समुदाय आरोग्य केंद्र"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === "en" ? "Estimated: June 2024" : "अंदाजित: जून २०२४"}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">
                {language === "en" 
                  ? "New community health center with basic medical facilities"
                  : "मूलभूत वैद्यकीय सुविधांसह नवीन समुदाय आरोग्य केंद्र"}
              </p>
            </div>
            
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <div className="text-green-600 text-2xl">🎯</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Smart Parking System" : "स्मार्ट पार्किंग सिस्टम"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === "en" ? "Estimated: August 2024" : "अंदाजित: ऑगस्ट २०२४"}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">
                {language === "en" 
                  ? "Automated parking system for market area"
                  : "बाजार क्षेत्रासाठी स्वयंचलित पार्किंग सिस्टम"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Report Issues */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Report Issues with Works" : "कार्यांशी संबंधित समस्या नोंदवा"}
            </h2>
            <p className="text-gray-700 mb-8">
              {language === "en" 
                ? "Found any issues with ongoing or completed development works? Report them directly to our office."
                : "चालू किंवा पूर्ण झालेल्या विकास कार्यांशी संबंधित काही समस्या आढळल्या? त्यांची थेट आमच्या कार्यालयात नोंद करा."}
            </p>
            <Link 
              href="/complaints" 
              className="btn-primary inline-flex items-center gap-2"
            >
              {t("complaints.title", language)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}