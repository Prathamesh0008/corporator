"use client";

import { useState } from "react";
import { 
  FiChevronLeft, FiChevronRight, FiThumbsUp, 
  FiEye, FiMapPin, FiCalendar, FiX
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
      before: "/images/road-before.jpg",
      after: "/images/road-after.jpg",
      location: language === "en" ? "Main Road, Ward 45" : "मुख्य रस्ता, वॉर्ड ४५",
      date: language === "en" ? "January 2024" : "जानेवारी २०२४",
      likes: 245,
      views: 1247,
      description: language === "en" 
        ? "Complete reconstruction of 2km road with proper drainage system"
        : "उचित ड्रेनेज सिस्टमसह २ किमी रस्त्याचे संपूर्ण पुनर्बांधणी"
    },
    {
      id: 2,
      title: language === "en" ? "Drainage System" : "ड्रेनेज सिस्टम",
      category: "drainage",
      before: "/images/drainage-before.jpg",
      after: "/images/drainage-after.jpg",
      location: language === "en" ? "Ganesh Nagar" : "गणेश नगर",
      date: language === "en" ? "February 2024" : "फेब्रुवारी २०२४",
      likes: 189,
      views: 987,
      description: language === "en"
        ? "Underground drainage system to prevent waterlogging"
        : "पाणी साचणे टाळण्यासाठी भूमिगत ड्रेनेज सिस्टम"
    },
    {
      id: 3,
      title: language === "en" ? "Water Pipeline" : "पाणी पाईपलाइन",
      category: "water",
      before: "/images/water-before.jpg",
      after: "/images/water-after.jpg",
      location: language === "en" ? "Shivaji Chowk Area" : "शिवाजी चौक क्षेत्र",
      date: language === "en" ? "March 2024" : "मार्च २०२४",
      likes: 156,
      views: 756,
      description: language === "en"
        ? "24x7 water supply pipeline installation"
        : "24x7 पाणीपुरवठा पाईपलाइन स्थापना"
    },
    {
      id: 4,
      title: language === "en" ? "LED Street Lights" : "एलईडी स्ट्रीट लाइट",
      category: "roads",
      before: "/images/lights-before.jpg",
      after: "/images/lights-after.jpg",
      location: language === "en" ? "Entire Ward 45" : "संपूर्ण वॉर्ड ४५",
      date: language === "en" ? "December 2023" : "डिसेंबर २०२३",
      likes: 312,
      views: 1543,
      description: language === "en"
        ? "Installation of 250 LED street lights"
        : "250 एलईडी स्ट्रीट लाइटची स्थापना"
    },
    {
      id: 5,
      title: language === "en" ? "Garbage Management" : "कचरा व्यवस्थापन",
      category: "drainage",
      before: "/images/garbage-before.jpg",
      after: "/images/garbage-after.jpg",
      location: language === "en" ? "Market Area" : "बाजार क्षेत्र",
      date: language === "en" ? "February 2024" : "फेब्रुवारी २०२४",
      likes: 278,
      views: 1321,
      description: language === "en"
        ? "New waste segregation and management system"
        : "नवीन कचरा वेगळे करणे आणि व्यवस्थापन प्रणाली"
    },
    {
      id: 6,
      title: language === "en" ? "Park Renovation" : "पार्क रिनोव्हेशन",
      category: "water",
      before: "/images/park-before.jpg",
      after: "/images/park-after.jpg",
      location: language === "en" ? "Children's Park" : "बालवाडी पार्क",
      date: language === "en" ? "March 2024" : "मार्च २०२४",
      likes: 198,
      views: 876,
      description: language === "en"
        ? "Complete renovation of public park"
        : "सार्वजनिक पार्कचे संपूर्ण रिनोव्हेशन"
    }
  ];

  const filteredItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      {/* Filter Buttons */}
      <section className="py-6 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((category) => (
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

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="card hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                {/* Before-After Comparison */}
                <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                  <div className="flex w-[200%] h-full transition-transform duration-500 hover:-translate-x-1/2">
                    {/* Before Image */}
                    <div className="w-1/2 h-full relative">
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          {language === "en" ? "BEFORE" : "आधी"}
                        </span>
                      </div>
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    </div>
                    
                    {/* After Image */}
                    <div className="w-1/2 h-full relative">
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          {language === "en" ? "AFTER" : "नंतर"}
                        </span>
                      </div>
                      <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400" />
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

      {/* Image Modal */}
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
              
              {/* Before-After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-2">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      {language === "en" ? "BEFORE" : "आधी"}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {language === "en" ? "Before work started" : "कार्य सुरू होण्यापूर्वी"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="relative h-64 rounded-lg overflow-hidden mb-2">
                    <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-400" />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      {language === "en" ? "AFTER" : "नंतर"}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {language === "en" ? "After completion" : "पूर्ण झाल्यानंतर"}
                  </p>
                </div>
              </div>
              
              {/* Image Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">{language === "en" ? "Location" : "स्थान"}</div>
                    <div className="font-medium">{selectedImage.location}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">{language === "en" ? "Date" : "तारीख"}</div>
                    <div className="font-medium">{selectedImage.date}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">{language === "en" ? "Likes" : "लाइक्स"}</div>
                    <div className="font-medium">{selectedImage.likes}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">{language === "en" ? "Views" : "व्ह्यूज"}</div>
                    <div className="font-medium">{selectedImage.views}</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {language === "en" ? "Work Description" : "कार्याचे वर्णन"}
                  </h4>
                  <p className="text-gray-700">{selectedImage.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Gallery */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Share Our Progress" : "आमची प्रगती शेअर करा"}
            </h2>
            <p className="text-gray-700 mb-8">
              {language === "en" 
                ? "Help spread the word about development works in Ward 24(D). Share these photos with your friends and neighbors."
                : "वॉर्ड २४(ड) मधील विकास कार्यांबद्दल माहिती पसरवण्यात मदत करा. हे फोटो तुमच्या मित्रांना आणि शेजाऱ्यांना शेअर करा."}
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