"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiUser,
  FiMessageSquare,
  FiSend,
  FiHome
} from "react-icons/fi";
import { GiIndiaGate, GiLotusFlower } from "react-icons/gi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

const LeafletMap = dynamic(() => import("../../components/LeafletMap"), { ssr: false });

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
        language === "en" ? "Ward Office 24(D)" : "वॉर्ड ऑफिस २४(ड)",
        language === "en" ? "Nerul Sector 18" : "नेरुळ सेक्टर १८",
        "Navi Mumbai - 400706",
        language === "en" ? "Maharashtra, India" : "महाराष्ट्र, भारत"
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
        language === "en"
          ? "Monday to Friday: 10:00 AM - 6:00 PM"
          : "सोमवार ते शुक्रवार: सकाळी १० - सायंकाळी ६",
        language === "en" ? "Saturday: 10:00 AM - 2:00 PM" : "शनिवार: सकाळी १० - दुपारी २",
        language === "en" ? "Sunday: Closed" : "रविवार: बंद"
      ]
    }
  ];

  const emergencyContacts = [
    {
      name: language === "en" ? "Ambulance" : "ॲम्ब्युलन्स",
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
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("contact.title", language)}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {language === "en"
                ? "Get in touch with Corporator Sachin Lavate's office for any queries or assistance"
                : "कोणतीही माहिती किंवा मदतीसाठी नगरसेवक सचिन लवटे यांच्या कार्यालयाशी संपर्क साधा"}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="card">
                <div className="text-orange-500 mb-4">{info.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    {language === "en" ? "Message Sent Successfully!" : "संदेश यशस्वीरीत्या पाठवला!"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en"
                      ? "We'll get back to you within 24 hours."
                      : "आम्ही २४ तासांत संपर्क साधू."}
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === "en" ? "Enter your name" : "तुमचे नाव लिहा"}
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
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={language === "en" ? "Enter phone number" : "फोन नंबर लिहा"}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={language === "en" ? "Enter email address" : "ईमेल पत्ता लिहा"}
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
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={language === "en" ? "Enter subject" : "विषय लिहा"}
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
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === "en" ? "Type your message here..." : "तुमचा संदेश येथे लिहा..."}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    <FiSend className="w-5 h-5" />
                    {language === "en" ? "Send Message" : "संदेश पाठवा"}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === "en" ? "Office Location" : "कार्यालयाचे स्थान"}
                </h3>
                <div className="rounded-lg overflow-hidden h-64 border border-gray-200">
                  <LeafletMap
                    center={[19.033, 73.029]}
                    zoom={14}
                    title={language === "en" ? "Ward Office 24(D), Nerul" : "वॉर्ड ऑफिस २४(ड), नेरुळ"}
                    boundary={[
                      [19.1427494830839, 72.999750250304103],
                      [19.1428807493558, 72.999758651348699],
                      [19.143254233653, 73.000366212518003],
                      [19.143590784375899, 73.000136882507505],
                      [19.143894996269299, 73.000605864171206],
                      [19.143684873711699, 73.000754383535494],
                      [19.144189056229301, 73.001707436763098],
                      [19.1437395293643, 73.001933367548602],
                      [19.143431645123499, 73.002091835754598],
                      [19.1433101853208, 73.002146651851604],
                      [19.143050318937, 73.002229375011197],
                      [19.142719042274798, 73.001553278673796],
                      [19.1426692396732, 73.001574733137801],
                      [19.1425325860436, 73.001452518241607],
                      [19.1421406870504, 73.001129699661107],
                      [19.1418984596489, 73.000869904186004],
                      [19.141642493126898, 73.000520464032107],
                      [19.1416236234334, 73.000495090218607],
                      [19.141166523012799, 72.999846503888506],
                      [19.141107261728301, 72.999762417984599],
                      [19.140562958183502, 72.999066916240494],
                      [19.140175049985501, 72.999136199705106],
                      [19.1400099693901, 72.999149641196695],
                      [19.139872401252401, 72.999145160400104],
                      [19.1398353632983, 72.999140680501796],
                      [19.139785627719299, 72.999129479408495],
                      [19.1392586350368, 72.998959218119396],
                      [19.139238369872899, 72.999445471691104],
                      [19.138674338926201, 73.000012796420606],
                      [19.138561345290299, 73.000130309534498],
                      [19.138401686898401, 73.000320998513104],
                      [19.138242798940599, 73.000531201594697],
                      [19.1382187367212, 73.000557799811901],
                      [19.138188298471299, 73.000582346277099],
                      [19.138170612271999, 73.000591880995501],
                      [19.138107875472102, 73.000611967325298],
                      [19.137834837213799, 73.000663585419801],
                      [19.137801691642402, 73.000672829982406],
                      [19.137774358592001, 73.000685514194203],
                      [19.137736302614002, 73.000710381357905],
                      [19.1376930010073, 73.0007517433868],
                      [19.1375649861052, 73.000875358756403],
                      [19.137532448975499, 73.000891473634297],
                      [19.1374956022958, 73.000903327802803],
                      [19.1374531357169, 73.000905022025407],
                      [19.137392546628298, 73.000897007256498],
                      [19.137323011683002, 73.000875216822607],
                      [19.137227915592199, 73.000835530151704],
                      [19.137188407412001, 73.000809684722597],
                      [19.137136787833899, 73.000760205516798],
                      [19.137112072825001, 73.000723488676201],
                      [19.137096155142, 73.000670690195406],
                      [19.137092227490001, 73.000628314866802],
                      [19.1370949186276, 73.000507412409306],
                      [19.137118902932901, 73.000111837477405],
                      [19.137118902932901, 73.000056950413494],
                      [19.137106204261698, 73.000005423947101],
                      [19.137077632035599, 72.999933735692494],
                      [19.137004614007701, 72.999804919975702],
                      [19.136846937458898, 72.9995573703345],
                      [19.136825772405601, 72.999521525757999],
                      [19.136816248597501, 72.999499123571496],
                      [19.136796141835699, 72.999425194918601],
                      [19.1367221494062, 72.9989086753083],
                      [19.136560689197601, 72.998909701184303],
                      [19.136597458008001, 72.998248492626203],
                      [19.135961531685702, 72.998135259086396],
                      [19.136078559164201, 72.997594785898997],
                      [19.136215294517001, 72.996963290915502],
                      [19.136025953925099, 72.995741219209805],
                      [19.1353962895111, 72.990418796372694],
                      [19.134679101335099, 72.985062828646406],
                      [19.133051055191899, 72.984898494441595],
                      [19.131940478112998, 72.984880140063694],
                      [19.131137261531901, 72.984072251891106],
                      [19.1313714777068, 72.983593783119602],
                      [19.131579714847501, 72.98246596445],
                      [19.1344172659945, 72.979603582510194],
                      [19.134753284785202, 72.979399890417795],
                      [19.135476833494799, 72.979330182948402],
                      [19.1360306029779, 72.979400121284897],
                      [19.1376252594258, 72.979748925431593],
                      [19.138206883405701, 72.979835481702494],
                      [19.138914406969899, 72.979740683388897],
                      [19.139650778496399, 72.979488244217606],
                      [19.1400425102748, 72.979317787095795],
                      [19.140440323429601, 72.979170384337493],
                      [19.140837146097201, 72.979197238574599],
                      [19.1412883908962, 72.9793770022427],
                      [19.142179024612101, 72.979745002488698],
                      [19.142812820655902, 72.979940394147903],
                      [19.143158384840099, 72.980022161500003],
                      [19.143512264959099, 72.980171056360007],
                      [19.1438168147548, 72.980364354046202],
                      [19.145251813812202, 72.9812474285132],
                      [19.1458067971387, 72.981535698786203],
                      [19.1462751383167, 72.981594178212902],
                      [19.1464468463362, 72.984274943260203],
                      [19.1463754643563, 72.986062669727303],
                      [19.146240958269502, 72.986168842509102],
                      [19.146186484202499, 72.986208010852096],
                      [19.146143316349299, 72.986245002577206],
                      [19.146098092265799, 72.986297226136202],
                      [19.145784673437198, 72.986789203772901],
                      [19.145246605772101, 72.987632348125601],
                      [19.144866061974, 72.988155995867601],
                      [19.144438873844901, 72.9890042911601],
                      [19.143964135527799, 72.990047715803598],
                      [19.142968261277201, 72.990132665886804],
                      [19.1423050518049, 72.989536618424395],
                      [19.141333676551699, 72.991639387654999],
                      [19.141448649886001, 72.992411387233702],
                      [19.141502349003002, 72.993635249281894],
                      [19.141581448154199, 72.994443464441304],
                      [19.141641837121899, 72.994694580394096],
                      [19.141746900583101, 72.994971048600902],
                      [19.141832575784498, 72.9954348263242],
                      [19.1419890382506, 72.996550615653803],
                      [19.1420333358897, 72.996988157180894],
                      [19.1421389133811, 72.998880964078396],
                      [19.142166692945001, 72.9989300588053],
                      [19.142189714149598, 72.998970742606204],
                      [19.142210002713298, 72.999006597064195],
                      [19.142371984405202, 72.999292858704194],
                      [19.142741519422501, 72.999287460727601],
                      [19.142748951833699, 72.9997193904792],
                      [19.1427494830839, 72.999750250304103]
                    ]}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Ward Office 24(D)</p>
                  <p className="mt-1">
                    {language === "en"
                      ? "Near Shivaji Chowk, Opposite Bank of Maharashtra"
                      : "शिवाजी चौक जवळ, बँक ऑफ महाराष्ट्र समोर"}
                  </p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t("contact.emergencyContact", language)}</h3>
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
                : "तातडीच्या बाबींसाठी कार्यालयाशी कामकाजाच्या वेळेत थेट संपर्क साधा."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
