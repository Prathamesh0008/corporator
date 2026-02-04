"use client";

import { 
  FiUser, FiBook, FiBriefcase, FiHome, 
  FiAward, FiUsers, FiHeart, FiMapPin,
  FiCalendar, FiCheckCircle
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
      value: language === "en" ? ", Navi Mumbai" : "नेरूळ सेक्टर १८, नवी मुंबई" 
    },
    { 
      icon: <FiBook />, 
      label: t("about.education", language), 
      value: "MBA Finance" 
    },
    { 
      icon: <FiBriefcase />, 
      label: t("about.profession", language), 
      value: language === "en" ? "Businessman (Fire Fighting Services)" : "व्यावसायिक (फायर फायटिंग सेवा)" 
    },
    { 
      icon: <GiFamilyHouse />, 
      label: t("about.background", language), 
      value: language === "en" ? "Son of small shopkeeper ('Tapriwala')" : "छोट्या दुकानदाराचा मुलगा ('टपरीवाला')" 
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
        language === "en" ? "Educational material assistance through Vidya Bhavan School" : "विद्याभवन शाळा अंतर्गत शैक्षणिक साहित्य मदत",
        language === "en" ? "Honoring meritorious students" : "गुणवंत विद्यार्थ्यांचा सन्मान",
        language === "en" ? "Financial help for economically weak students" : "आर्थिक दुर्बल विद्यार्थ्यांना मदत"
      ]
    },
    { 
      category: language === "en" ? "Cultural Programs" : "सांस्कृतिक कार्यक्रम", 
      works: [
        language === "en" ? "Kite competition, Rangoli competition" : "कित्ते स्पर्धा, रांगोळी स्पर्धा",
        language === "en" ? "Diwali Deepotsav and sweet distribution" : "दिवाळी दीपोत्सव व मिठाई वाटप",
        language === "en" ? "Ganesh Visarjan flower shower program" : "गणपती विसर्जन पुष्पवृष्टी सोहळा"
      ]
    },
    { 
      category: language === "en" ? "Religious Work" : "धार्मिक कार्य", 
      works: [
        language === "en" ? "Public Ganeshotsav assistance" : "सार्वजनिक गणेशोत्सव मदत",
        language === "en" ? "Mahashivratri programs" : "महाशिवरात्री उपक्रम",
        language === "en" ? "Sai Bhandara and Mahaprasad support" : "साई भंडारा आणि महाप्रसाद सहाय्य"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("about.title", language)}
            </h1>
            <p className="text-xl text-gray-700">
              {language === "en" 
                ? "Elected Representative of Ward 24(D) | Navi Mumbai Municipal Corporation" 
                : "वॉर्ड २४(ड) चे निवडून आलेले प्रतिनिधी | नवी मुंबई महानगरपालिका"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-orange-100 to-orange-300 p-2 mb-4">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="text-4xl">👨‍💼</div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === "en" ? "Sachin Devappa Lavate" : "सचिन देवाप्पा लवटे"}
                  </h2>
                  <div className="mt-3 px-4 py-2 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-full inline-block">
                    {language === "en" ? "Corporator Ward 24(D)" : "नगरसेवक वॉर्ड २४(ड)"}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {personalInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-orange-500 mt-1">
                        {info.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{info.label}</div>
                        <div className="text-gray-600">{info.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Contact Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">
                    {t("contact.title", language)}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        {language === "en" ? "Ward Office 24(D), " : "वॉर्ड ऑफिस २४(ड), नेरूळ सेक्टर १८"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        {language === "en" ? "Office: 022-12345678" : "ऑफिस: ०२२-१२३४५६७८"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Biography */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Personal Journey */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    {t("about.background", language)}
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      {language === "en" 
                        ? "I am Sachin Devappa Lavate, son of Shri Devappa Sitaram Lavate. My parents have been living in , Navi Mumbai for 30 years, and my childhood was spent here. My father worked in a private company."
                        : "मी सचिन देवाप्पा लवटे, श्री देवाप्पा सीताराम लवटे यांचा मुलगा आहे. माझे आई-वडील तीस वर्षापासून नेरूळ सेक्टर १८ नवी मुंबईमध्ये राहत असून माझे लहानपण इथेच गेले. माझे वडील एका खाजगी कंपनीमध्ये काम करत होते."}
                    </p>
                    
                    <p className="text-gray-700">
                      {language === "en" 
                        ? "To complete our education, my father managed a private job while my mother managed the household. For 20 years, they ran a small shop (tapri) and small home businesses. We both brothers worked at that shop while studying. Later, I completed my MBA in Finance and got a job in a bank."
                        : "आम्हा दोघा भावांचे शिक्षण आणि परिवार सांभाळत असताना सुरुवातीचा काळ खूप संघर्षात गेला. माझे आणि माझ्या भावाचे शिक्षण पूर्ण करण्यासाठी वडिलांनी खाजगी नोकरी सांभाळून व आईने घर संसार सांभाळून २० वर्षापासून एक छोटीशी टपरी व छोटे-मोठे गृह व्यवसाय करून त्याच टपरीवर माझे आई-वडील व आम्ही दोघे भावेंडे काम करत शिक्षण घेत राहिलो. पुढे मी MBA Finance हे शिक्षण पूर्ण केले आणि बँकेत नोकरीला लागलो."}
                    </p>
                  </div>
                </div>
                
                {/* Social Work Experience */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiHeart className="text-green-600" />
                    {t("about.socialWork", language)}
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-gray-700">
                      {language === "en" 
                        ? "My father was also doing small social work since that time. Following in his footsteps, I have been doing social work in the fields of sports, social, religious, educational, and medical for the last 12 years under the leadership of Navi Mumbai's architect Ganeshji Naik Saheb."
                        : "माझे वडीलही त्या काळापासून छोटे–मोठे सामाजिक कार्य करत होते. त्याच पावलांवर पाऊल ठेवून मी ही गेल्या बारा वर्षापासून नवी मुंबईचे शिल्पकार गणेशजी नाईक साहेब यांच्या नेतृत्वात क्रीडा, सामाजिक, धार्मिक, शैक्षणिक व वैद्यकीय क्षेत्रात समाजकार्य करीत आहे."}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
                
                {/* Connection with People */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiUsers className="text-orange-600" />
                    {language === "en" ? "Connection with People" : "जनतेशी संबंध"}
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      {language === "en" 
                        ? "My father taught me that hard work always bears fruit. Because of this mantra, we are achieving success in public and business fields today without any pride. Therefore, our connection is with the common people."
                        : "माझ्या वडिलांनी सांगितले होते, कोणत्याही क्षेत्रात प्रामाणिक कष्ट केल्यावर कष्टाचे फळ हे नक्की भेटतेच या गुरु मंत्रामुळेच आम्ही आज सार्वजनिक व व्यावसायिक क्षेत्रात यश संपादन करत असताना आम्हाला कोणत्याही गोष्टीचा गर्वही नाही. त्यामुळे आमची नाळ ही सर्वसामान्य लोकांशी जोडलेली आहे."}
                    </p>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {language === "en" ? "'Tapriwala's Son'" : "'टपरीवाल्याचा मुलगा'"}
                      </h3>
                      <p className="text-gray-700">
                        {language === "en" 
                          ? "That's why the beloved people of the division address me as 'Tapriwala's son'. May God always keep me connected with the common people."
                          : "म्हणूनच विभागातील माझ्या जिवाभावाची लोक 'टपरीवाली चा मुलगा' म्हणून संबोधतात. देव करो आणि मला नेहमी असेच सामान्य जनतेशी जोडलेले ठेवो."}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Vision for Ward */}
                <div className="bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">
                    {language === "en" ? "Vision for Ward 24(D)" : "वॉर्ड २४(ड) साठी दृष्टी"}
                  </h2>
                  <p className="mb-6">
                    {language === "en" 
                      ? "With the principle of 'Service is Commitment', I am committed to making Ward 24(D) a model ward of Navi Mumbai. The development of every citizen, the welfare of every family, and the progress of the entire ward is my goal."
                      : "'सेवा ही संकल्प' या तत्वासह, मी वॉर्ड २४(ड) ला नवी मुंबईचा आदर्श वॉर्ड बनवण्यासाठी कटिबद्ध आहे. प्रत्येक नागरिकाचा विकास, प्रत्येक कुटुंबाचे कल्याण, आणि संपूर्ण वॉर्डची प्रगती हे माझे ध्येय आहे."}
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
        </div>
      </section>
      
      {/* Quick Links */}
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
                {language === "en" ? "Detailed information of development works" : "विकास कार्यांची तपशीलवार माहिती"}
              </p>
            </Link>
            
            <Link 
              href="/gallery" 
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <FiAward className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("nav.gallery", language)}</h3>
              <p className="text-gray-600">
                {language === "en" ? "Before-After photos of completed works" : "पूर्ण झालेल्या कार्यांचे आधी-नंतर फोटो"}
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