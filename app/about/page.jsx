"use client";

import Image from "next/image";
import {
  FiUser,
  FiBook,
  FiBriefcase,
  FiHome,
  FiAward,
  FiUsers,
  FiHeart,
  FiMapPin,
  FiCalendar,
  FiCheckCircle
} from "react-icons/fi";
import { GiFamilyHouse, GiIndiaGate } from "react-icons/gi";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function AboutPage() {
  const { language } = useLanguage();

  const personalInfo = [
    {
      icon: <FiHome />,
      label: t("about.residence", language),
      value: language === "en" ? "Nerul Sector 18, Navi Mumbai" : "नेरुळ सेक्टर १८, नवी मुंबई"
    },
    {
      icon: <FiBook />,
      label: t("about.education", language),
      value: "MBA Finance"
    },
    {
      icon: <FiBriefcase />,
      label: t("about.profession", language),
      value:
        language === "en"
          ? "Businessman (Fire Fighting Services)"
          : "व्यावसायिक (फायर फायटिंग सेवा)"
    },
    {
      icon: <GiFamilyHouse />,
      label: t("about.background", language),
      value:
        language === "en"
          ? "Son of small shopkeeper ('Tapriwala')"
          : "छोट्या दुकानदाराचा मुलगा ('टपरीवाला')"
    },
    {
      icon: <FiCalendar />,
      label: language === "en" ? "Social Service" : "सामाजिक सेवा",
      value: language === "en" ? "12+ years experience" : "१२+ वर्षांचा अनुभव"
    },
    {
      icon: <FiAward />,
      label: language === "en" ? "Position" : "पद",
      value: language === "en" ? "Corporator, Ward 24(D)" : "नगरसेवक, वॉर्ड २४(ड)"
    }
  ];

  const socialWork = [
    {
      category: language === "en" ? "Educational Work" : "शैक्षणिक कार्य",
      works: [
        language === "en"
          ? "Educational material assistance through Vidya Bhavan School"
          : "विद्याभवन शाळेत शैक्षणिक साहित्य मदत",
        language === "en" ? "Honoring meritorious students" : "गुणवंत विद्यार्थ्यांचा सन्मान",
        language === "en"
          ? "Financial help for economically weak students"
          : "आर्थिकदृष्ट्या दुर्बल विद्यार्थ्यांना मदत"
      ]
    },
    {
      category: language === "en" ? "Cultural Programs" : "सांस्कृतिक कार्यक्रम",
      works: [
        language === "en" ? "Kite competition, Rangoli competition" : "पतंग स्पर्धा, रांगोळी स्पर्धा",
        language === "en" ? "Diwali Deepotsav and sweet distribution" : "दिवाळी दीपोत्सव व मिठाई वाटप",
        language === "en"
          ? "Ganesh Visarjan flower shower program"
          : "गणपती विसर्जन पुष्पवृष्टी सोहळा"
      ]
    },
    {
      category: language === "en" ? "Religious Work" : "धार्मिक कार्य",
      works: [
        language === "en" ? "Public Ganeshotsav assistance" : "सार्वजनिक गणेशोत्सव मदत",
        language === "en" ? "Mahashivratri programs" : "महाशिवरात्री कार्यक्रम",
        language === "en"
          ? "Sai Bhandara and Mahaprasad support"
          : "साई भंडारा व महाप्रसाद सहाय्य"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-[#0b3d91] text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff9933] via-[#59a6ca] to-[#ff9933]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#138808]/30" />
          <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
        </div>
        <div className="relative container-responsive px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/80 font-semibold">
                {t("about.title", language)}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mt-3">
                {language === "en" ? "Sachin Devappa Lavate" : "सचिन देवाप्पा लवटे"}
              </h1>
              <p className="text-white/90 text-lg mt-3">
                {language === "en"
                  ? "Elected Representative of Ward 24(D) | Navi Mumbai Municipal Corporation"
                  : "वॉर्ड २४(ड) चे निवडून आलेले प्रतिनिधी | नवी मुंबई महानगरपालिका"}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm font-semibold">
                  {language === "en" ? "12+ Years Social Service" : "१२+ वर्षे समाजसेवा"}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm font-semibold">
                  {language === "en" ? "Ward 24(D), Nerul" : "वॉर्ड २४(ड), नेरूळ"}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/30 text-sm font-semibold">
                  {language === "en" ? "Citizen First" : "नागरिक प्रथम"}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#ff9933] text-[#0b3d91] font-semibold hover:bg-[#ffb866] transition"
                >
                  {language === "en" ? "Contact" : "संपर्क"}
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
                >
                  {language === "en" ? "Services" : "सेवा"}
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-white/10 border border-white/20 p-4 shadow-2xl">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white">
                  <Image
                    src="/BJP.jpeg"
                    alt={language === "en" ? "Sachin Devappa Lavate" : "सचिन देवाप्पा लवटे"}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 360px, 80vw"
                    priority
                  />
                </div>
             
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8">
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-white">
                    <Image
                      src="/BJP.jpeg"
                      alt={language === "en" ? "Sachin Devappa Lavate" : "सचिन देवाप्पा लवटे"}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {language === "en" ? "Sachin Devappa Lavate" : "सचिन देवाप्पा लवटे"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === "en" ? "Corporator, Ward 24(D)" : "नगरसेवक, वॉर्ड २४(ड)"}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">
                  {language === "en"
                    ? "Committed to Ward 24(D) with citizen-first governance, reliable services, and transparent public support."
                    : "नागरिक-केंद्री प्रशासन, विश्वसनीय सेवा आणि पारदर्शक सार्वजनिक सहाय्यासाठी वॉर्ड २४(ड) बद्दल कटिबद्ध."}
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personalInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="text-orange-500 mt-1">{info.icon}</div>
                      <div>
                        <div className="font-medium text-gray-900">{info.label}</div>
                        <div className="text-gray-600 text-sm">{info.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <h3 className="font-bold text-gray-900 mb-3">{t("contact.title", language)}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-orange-500" />
                    <span>
                      {language === "en" ? "Ward Office 24(D), Nerul Sector 18" : "वॉर्ड ऑफिस २४(ड), नेरुळ सेक्टर १८"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-blue-500" />
                    <span>
                      {language === "en" ? "Office: 022-12345678" : "ऑफिस: ०२२-१२३४५६७८"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="text-blue-600" />
                  {t("about.background", language)}
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {language === "en"
                      ? "I am Sachin Devappa Lavate, son of Shri Devappa Sitaram Lavate. My parents have been living in Nerul Sector 18, Navi Mumbai for 30 years, and my childhood was spent here. My father worked in a private company."
                      : "मी सचिन देवाप्पा लवटे, स्व. देवाप्पा सीताराम लवटे यांचा मुलगा. माझे आई-वडील गेली ३० वर्षे नेरुळ सेक्टर १८, नवी मुंबई येथे राहतात आणि माझे बालपण येथेच गेले. माझे वडील खाजगी कंपनीत कार्यरत होते."}
                  </p>
                  <p className="text-gray-700">
                    {language === "en"
                      ? "To complete our education, my father managed a private job while my mother managed the household. For 20 years, they ran a small shop (tapri) and small home businesses. We both brothers worked at that shop while studying. Later, I completed my MBA in Finance and got a job in a bank."
                      : "आमचे शिक्षण पूर्ण व्हावे म्हणून वडिलांनी खाजगी नोकरी केली आणि आईने घर सांभाळून छोटा व्यवसाय केला. साधारण २० वर्षे आम्ही छोटी टपरी व घरगुती व्यवसाय चालवला. मी आणि भाऊ शिकत असताना त्या व्यवसायात हातभार लावला. पुढे मी MBA (Finance) पूर्ण करून बँकेत नोकरी केली."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiHeart className="text-green-600" />
                  {t("about.socialWork", language)}
                </h2>
                <p className="text-gray-700 mb-6">
                  {language === "en"
                    ? "My father was also doing small social work since that time. Following in his footsteps, I have been doing social work in the fields of sports, social, religious, educational, and medical for the last 12 years under the leadership of Navi Mumbai's architect Ganeshji Naik Saheb."
                    : "माझे वडीलही त्या काळापासून छोटे-मोठे समाजकार्य करत होते. त्यांच्याच पावलावर पाऊल ठेवत गेली १२ वर्षे मी क्रीडा, सामाजिक, धार्मिक, शैक्षणिक आणि वैद्यकीय क्षेत्रात समाजकार्य करत आहे. नवी मुंबईचे शिल्पकार गणेशजी नाईक साहेब यांच्या नेतृत्वात हा प्रवास सुरू आहे."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {socialWork.map((work, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-gray-900 mb-3">{work.category}</h3>
                      <ul className="space-y-2">
                        {work.works.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUsers className="text-orange-600" />
                  {language === "en" ? "Connection with People" : "जनतेशी संबंध"}
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {language === "en"
                      ? "My father taught me that hard work always bears fruit. Because of this mantra, we are achieving success in public and business fields today without any pride. Therefore, our connection is with the common people."
                      : "माझ्या वडिलांनी शिकवले की कष्टाचे फळ नक्की मिळते. म्हणूनच आम्ही सार्वजनिक आणि व्यावसायिक क्षेत्रात यश मिळवले तरी अहंकार नाही. त्यामुळेच आमचे नाते सर्वसामान्य लोकांशी घट्ट आहे."}
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {language === "en" ? "'Tapriwala's Son'" : "‘टपरीवाल्याचा मुलगा’"}
                    </h3>
                    <p className="text-gray-700">
                      {language === "en"
                        ? "That's why the beloved people of the division address me as 'Tapriwala's son'. May God always keep me connected with the common people."
                        : "म्हणूनच माझ्या विभागातील आपले लोक मला ‘टपरीवाल्याचा मुलगा’ म्हणतात. देव आणि जनता मला नेहमीच सामान्य लोकांशी जोडून ठेवो."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  {language === "en" ? "Vision for Ward 24(D)" : "वॉर्ड २४(ड) साठी दृष्टी"}
                </h2>
                <p className="mb-6">
                  {language === "en"
                    ? "With the principle of 'Service is Commitment', I am committed to making Ward 24(D) a model ward of Navi Mumbai. The development of every citizen, the welfare of every family, and the progress of the entire ward is my goal."
                    : "‘सेवा ही संकल्प’ या तत्त्वानुसार वॉर्ड २४(ड) हा नवी मुंबईतील आदर्श वॉर्ड बनवणे हे माझे ध्येय आहे. प्रत्येक नागरिकाचा विकास, प्रत्येक कुटुंबाचे कल्याण आणि संपूर्ण वॉर्डची प्रगती हा माझा संकल्प आहे."}
                </p>
                <div className="flex items-center gap-2">
                  <GiIndiaGate className="w-6 h-6" />
                  <span className="font-medium">
                    {language === "en" ? "Development for All, Trust for All" : "सर्वांचा विकास, सर्वांचा विश्वास"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/works"
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <FiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("nav.works", language)}</h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Detailed information of development works"
                  : "विकास कार्यांची तपशीलवार माहिती"}
              </p>
            </Link>

            <Link
              href="/gallery"
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <FiAward className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("nav.gallery", language)}</h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Before-After photos of completed works"
                  : "पूर्ण झालेल्या कार्यांचे आधी-नंतर फोटो"}
              </p>
            </Link>

            <Link
              href="/contact"
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <FiUsers className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("nav.contact", language)}</h3>
              <p className="text-gray-600">
                {language === "en" ? "Contact me directly" : "माझ्याशी थेट संपर्क साधा"}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
