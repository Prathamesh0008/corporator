"use client";

import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiThumbsUp,
  FiEye,
  FiMapPin,
  FiCalendar,
  FiX
} from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function GalleryPage() {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const galleryCategories = [
    { id: "all", name: language === "en" ? "All Photos" : "सर्व फोटो" },
    { id: "before", name: language === "en" ? "Before" : "आधी" },
    { id: "after", name: language === "en" ? "After" : "नंतर" },
    { id: "roads", name: language === "en" ? "Roads" : "रस्ते" },
    { id: "drainage", name: language === "en" ? "Drainage" : "ड्रेनेज" },
    { id: "water", name: language === "en" ? "Water" : "पाणी" }
  ];

  const galleryItems = [
    {
      id: 1,
      title: language === "en" ? "Road Repair Work" : "रस्ता दुरुस्ती काम",
      category: "roads",
      before: "https://picsum.photos/id/1011/800/600",
      after: "https://picsum.photos/id/1015/800/600",
      location: language === "en" ? "Main Road, Ward 45" : "मुख्य रस्ता, वॉर्ड ४५",
      date: language === "en" ? "January 2024" : "जानेवारी २०२४",
      likes: 245,
      views: 1247,
      description:
        language === "en"
          ? "Complete reconstruction of 2km road with proper drainage system"
          : "योग्य ड्रेनेजसह २ किमी रस्त्याची पूर्ण पुनर्बांधणी"
    },
    {
      id: 2,
      title: language === "en" ? "Drainage System" : "ड्रेनेज सिस्टम",
      category: "drainage",
      before: "https://picsum.photos/id/103/800/600",
      after: "https://picsum.photos/id/104/800/600",
      location: language === "en" ? "Ganesh Nagar" : "गणेश नगर",
      date: language === "en" ? "February 2024" : "फेब्रुवारी २०२४",
      likes: 189,
      views: 987,
      description:
        language === "en"
          ? "Underground drainage system to prevent waterlogging"
          : "पाणी साचू नये म्हणून भूमिगत ड्रेनेज सिस्टम"
    },
    {
      id: 3,
      title: language === "en" ? "Water Pipeline" : "पाणी पाइपलाइन",
      category: "water",
      before: "https://picsum.photos/id/106/800/600",
      after: "https://picsum.photos/id/107/800/600",
      location: language === "en" ? "Shivaji Chowk Area" : "शिवाजी चौक परिसर",
      date: language === "en" ? "March 2024" : "मार्च २०२४",
      likes: 156,
      views: 756,
      description:
        language === "en"
          ? "24x7 water supply pipeline installation"
          : "२४x७ पाणीपुरवठ्यासाठी पाइपलाइन स्थापना"
    },
    {
      id: 4,
      title: language === "en" ? "LED Street Lights" : "एलईडी स्ट्रीट लाइट",
      category: "roads",
      before: "https://picsum.photos/id/108/800/600",
      after: "https://picsum.photos/id/109/800/600",
      location: language === "en" ? "Entire Ward 45" : "संपूर्ण वॉर्ड ४५",
      date: language === "en" ? "December 2023" : "डिसेंबर २०२३",
      likes: 312,
      views: 1543,
      description:
        language === "en"
          ? "Installation of 250 LED street lights"
          : "२५० एलईडी स्ट्रीट लाइट्सची स्थापना"
    },
    {
      id: 5,
      title: language === "en" ? "Garbage Management" : "कचरा व्यवस्थापन",
      category: "drainage",
      before: "https://picsum.photos/id/110/800/600",
      after: "https://picsum.photos/id/111/800/600",
      location: language === "en" ? "Market Area" : "बाजार परिसर",
      date: language === "en" ? "February 2024" : "फेब्रुवारी २०२४",
      likes: 278,
      views: 1321,
      description:
        language === "en"
          ? "New waste segregation and management system"
          : "नवीन कचरा वर्गीकरण व व्यवस्थापन प्रणाली"
    },
    {
      id: 6,
      title: language === "en" ? "Park Renovation" : "पार्क नूतनीकरण",
      category: "water",
      before: "https://picsum.photos/id/112/800/600",
      after: "https://picsum.photos/id/113/800/600",
      location: language === "en" ? "Children's Park" : "बालवाडी पार्क",
      date: language === "en" ? "March 2024" : "मार्च २०२४",
      likes: 198,
      views: 876,
      description:
        language === "en"
          ? "Complete renovation of public park"
          : "सार्वजनिक पार्कचे पूर्ण नूतनीकरण"
    }
  ];

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("nav.gallery", language)}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {language === "en"
                ? "Visual journey of transformation in Ward 24(D)"
                : "वॉर्ड २४(ड) मधील रूपांतराचा दृश्य प्रवास"}
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === category.id
                    ? "bg-gradient-to-r from-[#FF9933] to-[#FF6600] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                  <div className="flex w-[200%] h-full transition-transform duration-500 hover:-translate-x-1/2">
                    <div className="w-1/2 h-full relative">
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          {language === "en" ? "BEFORE" : "आधी"}
                        </span>
                      </div>
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.before})` }}
                      />
                    </div>

                    <div className="w-1/2 h-full relative">
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          {language === "en" ? "AFTER" : "नंतर"}
                        </span>
                      </div>
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.after})` }}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FiMapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    {item.date}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiThumbsUp className="w-4 h-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiEye className="w-4 h-4" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {t("common.viewDetails", language)} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedImage.title}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-2">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${selectedImage.before})` }}
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      {language === "en" ? "BEFORE" : "आधी"}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {language === "en" ? "Before work started" : "काम सुरू होण्यापूर्वी"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-2">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${selectedImage.after})` }}
                    />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      {language === "en" ? "AFTER" : "नंतर"}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {language === "en" ? "After completion" : "पूर्ण झाल्यानंतर"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">
                      {language === "en" ? "Location" : "स्थान"}
                    </div>
                    <div className="font-medium">{selectedImage.location}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">{language === "en" ? "Date" : "तारीख"}</div>
                    <div className="font-medium">{selectedImage.date}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">{language === "en" ? "Likes" : "लाईक्स"}</div>
                    <div className="font-medium">{selectedImage.likes}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">{language === "en" ? "Views" : "व्ह्यूज"}</div>
                    <div className="font-medium">{selectedImage.views}</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {language === "en" ? "Work Description" : "कामाचे वर्णन"}
                  </h4>
                  <p className="text-gray-700">{selectedImage.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Share Our Progress" : "आमची प्रगती शेअर करा"}
            </h2>
            <p className="text-gray-700 mb-8">
              {language === "en"
                ? "Help spread the word about development works in Ward 24(D). Share these photos with your friends and neighbors."
                : "वॉर्ड २४(ड) मधील विकास कामांबद्दल माहिती पसरवण्यात मदत करा. हे फोटो तुमच्या मित्रांना आणि शेजार्‍यांना शेअर करा."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
                <span>📱</span> WhatsApp
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
                <span>💬</span> Telegram
              </button>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
                <span>📸</span> Instagram
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
