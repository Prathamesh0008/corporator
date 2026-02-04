"use client";

import { useState } from "react";
import { 
  FiPhone, FiMail, FiMapPin, FiClock, 
  FiUser, FiMessageSquare, FiSend, FiHome
} from "react-icons/fi";
import { GiIndiaGate, GiLotusFlower } from "react-icons/gi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: t("contact.officeAddress", language),
      details: [
        "Ward Office 24(D)",
        "",
        "Navi Mumbai - 400706",
        "Maharashtra, India"
      ]
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: t("contact.phoneNumbers", language),
      details: [
        "Office: 022-12345678",
        "Mobile: +91 98765 43210",
        "WhatsApp: +91 98765 43210",
        "Fax: 022-12345679"
      ]
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      title: t("contact.email", language),
      details: [
        "sachin.lavate@nmmc.gov.in",
        "office.corporator24d@gmail.com",
        "support@corporatorlavate.in"
      ]
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: t("contact.officeHours", language),
      details: [
        language === "en" ? "Monday to Friday: 10:00 AM - 6:00 PM" : "सोमवार ते शुक्रवार: सकाळी १० - संध्याकाळी ६",
        language === "en" ? "Saturday: 10:00 AM - 2:00 PM" : "शनिवार: सकाळी १० - दुपारी २",
        language === "en" ? "Sunday: Closed" : "रविवार: बंद"
      ]
    }
  ];

  const emergencyContacts = [
    {
      name: language === "en" ? "Ambulance" : "एंब्युलन्स",
      number: "108",
      description: language === "en" ? "Medical Emergency" : "वैद्यकीय आपत्काल"
    },
    {
      name: language === "en" ? "Fire Brigade" : "फायर ब्रिगेड",
      number: "101",
      description: language === "en" ? "Fire Emergency" : "आगीचा आपत्काल"
    },
    {
      name: language === "en" ? "Police Control Room" : "पोलीस कंट्रोल रूम",
      number: "100",
      description: language === "en" ? "Police Assistance" : "पोलीस मदत"
    },
    {
      name: language === "en" ? "Women Helpline" : "महिला हेल्पलाइन",
      number: "1091",
      description: language === "en" ? "Women Safety" : "महिला सुरक्षा"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("contact.title", language)}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {language === "en" 
                ? "Get in touch with Corporator Sachin Lavate's office for any queries or assistance"
                : "कोणत्याही प्रश्न किंवा मदतीसाठी नगरसेवक सचिन लवटे कार्यालयाशी संपर्क साधा"}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="card">
                <div className="text-orange-500 mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === "en" ? "Send us a Message" : "आम्हाला संदेश पाठवा"}
              </h2>
              
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiSend className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {language === "en" ? "Message Sent Successfully!" : "संदेश यशस्वीरित्या पाठवला!"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en" 
                      ? "We'll get back to you within 24 hours."
                      : "आम्ही 24 तासांच्या आत तुमच्याशी संपर्क साधू."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "en" ? "Your Name" : "तुमचे नाव"} *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={language === "en" ? "Enter your name" : "तुमचे नाव प्रविष्ट करा"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "en" ? "Phone Number" : "फोन नंबर"} *
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder={language === "en" ? "Enter phone number" : "फोन नंबर प्रविष्ट करा"}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Email Address" : "ईमेल पत्ता"}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={language === "en" ? "Enter email address" : "ईमेल पत्ता प्रविष्ट करा"}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Subject" : "विषय"} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder={language === "en" ? "Enter subject" : "विषय प्रविष्ट करा"}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Message" : "संदेश"} *
                    </label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={language === "en" ? "Type your message here..." : "तुमचा संदेश येथे टाइप करा..."}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-5 h-5" />
                    {language === "en" ? "Send Message" : "संदेश पाठवा"}
                  </button>
                </form>
              )}
            </div>
            
            {/* Map & Emergency Contacts */}
            <div className="space-y-6">
              {/* Map */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === "en" ? "Office Location" : "कार्यालयाचे स्थान"}
                </h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {language === "en" ? "Interactive Map Coming Soon" : "इंटरएक्टिव्ह मॅप लवकरच येईल"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Ward Office 24(D), </p>
                  <p className="mt-1">
                    {language === "en" 
                      ? "Near Shivaji Chowk, Opposite Bank of Maharashtra"
                      : "शिवाजी चौक जवळ, महाराष्ट्र बँकेच्या समोर"}
                  </p>
                </div>
              </div>
              
              {/* Emergency Contacts */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t("contact.emergencyContact", language)}
                </h3>
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-600">{contact.description}</div>
                      </div>
                      <a 
                        href={`tel:${contact.number}`}
                        className="text-xl font-bold text-red-600 hover:text-red-700"
                      >
                        {contact.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Information */}
      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {language === "en" ? "Visit Our Office" : "आमच्या कार्यालयाला भेट द्या"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl mb-3">📅</div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === "en" ? "Schedule Appointment" : "अपॉइंटमेंट शेड्यूल करा"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "en" 
                    ? "Book an appointment for personalized meeting"
                    : "वैयक्तिक भेटीसाठी अपॉइंटमेंट बुक करा"}
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === "en" ? "Public Hearing" : "सार्वजनिक सुनावणी"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "en" 
                    ? "Every Friday, 4PM - 6PM at Ward Office"
                    : "प्रत्येक शुक्रवार, संध्याकाळी ४ - ६ वाजेपर्यंत वॉर्ड ऑफिसमध्ये"}
                </p>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-xl">
                <div className="text-3xl mb-3">📞</div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === "en" ? "Call Before Visiting" : "भेट देण्यापूर्वी कॉल करा"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "en" 
                    ? "Confirm availability before visiting office"
                    : "कार्यालयाला भेट देण्यापूर्वी उपलब्धता निश्चित करा"}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700">
              {language === "en" 
                ? "For any urgent matters, please contact the office directly during working hours."
                : "कोणत्याही तातडीच्या बाबींसाठी, कृपया कार्यालयीन वेळेत थेट कार्यालयाशी संपर्क साधा."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}