"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiAlertCircle
} from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function ContactPage() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to submit form.");
      }

      setFormData({ name: "", phone: "", email: "", message: "" });
      setSubmitStatus({
        type: "success",
        message:
          language === "en"
            ? "Message sent successfully. Our team will contact you soon."
            : "संदेश यशस्वीरित्या पाठवला. आमची टीम लवकरच तुमच्याशी संपर्क करेल.",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.message ||
          (language === "en"
            ? "Failed to send message. Please try again."
            : "संदेश पाठवण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-10">
        <div className="container-responsive px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("contact.title", language)}
          </h1>
          <p className="text-gray-700">
            {language === "en"
              ? "We are here to help you with ward services and citizen support."
              : "वॉर्डमधील सेवा व नागरिक सहाय्यासाठी आम्ही येथे आहोत."}
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-responsive px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Office Details" : "कार्यालय माहिती"}
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">{t("contact.officeAddress", language)}</div>
                    <div className="text-gray-600">
                      {language === "en"
                        ? "Radhamit Cooperative Housing Society, Plot No. 33, Sector 18 Nerul Rd, Sector 18A, Nerul, Navi Mumbai, Maharashtra 400706"
                        : "राधामित को-ऑपरेटिव्ह हाउसिंग सोसायटी, प्लॉट क्रमांक ३३, सेक्टर १८ नेरुळ रोड, सेक्टर १८ए, नेरुळ, नवी मुंबई, महाराष्ट्र ४००७०६"}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">{t("contact.phoneNumbers", language)}</div>
                    <div className="text-gray-600">022-12345678 / 1800 222 230</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">{t("contact.email", language)}</div>
                    <div className="text-gray-600">contact@ward24.in</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiClock className="w-5 h-5 text-gray-700 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">{t("contact.officeHours", language)}</div>
                    <div className="text-gray-600">
                      {language === "en" ? "24/7" : "२४/७"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Send Message" : "संदेश पाठवा"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Full Name" : "पूर्ण नाव"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Phone Number" : "फोन नंबर"}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Email" : "ईमेल"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Your Message" : "तुमचा संदेश"}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-5 h-5" />
                  {isSubmitting
                    ? language === "en"
                      ? "Sending..."
                      : "पाठवत आहे..."
                    : language === "en"
                      ? "Send Message"
                      : "संदेश पाठवा"}
                </button>
                {submitStatus.message && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Office Location" : "कार्यालयाचे स्थान"}
              </h2>
              <div className="rounded-lg overflow-hidden h-64 border border-gray-200">
                <iframe
                  title="Office location map"
                  src="https://maps.google.com/maps?q=Radhamit%20Cooperative%20Housing%20Society%20Plot%20No.%2033%20Sector%2018A%20Nerul%20Navi%20Mumbai%20400706&z=16&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="card bg-orange-50 border border-orange-200">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-orange-500 mt-1" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {language === "en" ? "Emergency Contact" : "आपत्कालीन संपर्क"}
                  </div>
                  <div className="text-gray-700">
                    {language === "en" ? "Dial 108 for ambulance." : "अॅम्ब्युलन्ससाठी १०८ कॉल करा."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
