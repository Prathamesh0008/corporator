"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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

const LeafletMap = dynamic(() => import("../../components/LeafletMap"), { ssr: false });

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // demo only
    setFormData({ name: "", phone: "", email: "", message: "" });
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
                        ? "Ward Office 24(D), Nerul Sector 18, Navi Mumbai"
                        : "वॉर्ड ऑफिस २४(ड), नेरुळ सेक्टर १८, नवी मुंबई"}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Full Name" : "पूर्ण नाव"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Phone Number" : "फोन नंबर"}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Email" : "ईमेल"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={language === "en" ? "Your Message" : "तुमचा संदेश"}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiSend className="w-5 h-5" />
                  {language === "en" ? "Send Message" : "संदेश पाठवा"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Office Location" : "कार्यालयाचे स्थान"}
              </h2>
              <div className="rounded-lg overflow-hidden h-64 border border-gray-200">
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
