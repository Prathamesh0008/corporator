"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { language } = useLanguage();

  const handleWhatsAppClick = () => {
    const phone = "919876543210";
    const text = message || (language === "en" 
      ? "Hello, I need assistance from Corporator Sachin Lavate office." 
      : "नमस्कार, मला नगरसेवक सचिन लवटे कार्यालयाकडून मदत हवी आहे.");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage("");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-green-200 animate-slideInLeft">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaWhatsapp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {language === "en" ? "WhatsApp Support" : "व्हाट्सएप समर्थन"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Get quick assistance" : "द्रुत मदत मिळवा"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "en" ? "Your Message (Optional)" : "तुमचे संदेश (पर्यायी)"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === "en" ? "Type your message here..." : "तुमचा संदेश येथे टाइप करा..."}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="w-5 h-5" />
                {language === "en" ? "Start WhatsApp Chat" : "व्हाट्सएप चॅट सुरू करा"}
              </button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                {language === "en" 
                  ? "We'll respond within 30 minutes"
                  : "आम्ही ३० मिनिटांत प्रतिसाद देऊ"}
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center"
        >
          {isOpen ? <FiX className="w-6 h-6" /> : <FaWhatsapp className="w-7 h-7" />}
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
    </>
  );
}