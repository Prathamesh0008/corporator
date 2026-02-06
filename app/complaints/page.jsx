"use client";

import { useState } from "react";
import { 
  FiAlertCircle, FiUpload, FiSend, FiCheckCircle, 
  FiMapPin, FiCamera, FiUser, FiPhone, FiMail, 
  FiHome, FiCalendar, FiClock
} from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/translations";

export default function ComplaintsPage() {
  const { language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    ward: "",
    complaintType: "general",
    location: "",
    description: "",
    urgency: "medium"
  });

  const complaintTypes = [
    { id: "roads", label: language === "en" ? "Road & Footpath" : "रस्ता आणि फुटपाथ" },
    { id: "water", label: language === "en" ? "Water Supply" : "पाणीपुरवठा" },
    { id: "drainage", label: language === "en" ? "Drainage/Sewage" : "ड्रेनेज/सीवरेज" },
    { id: "electricity", label: language === "en" ? "Electricity" : "वीज" },
    { id: "garbage", label: language === "en" ? "Garbage Collection" : "कचरा संकलन" },
    { id: "streetlights", label: language === "en" ? "Street Lights" : "स्ट्रीट लाइट" },
    { id: "noise", label: language === "en" ? "Noise Pollution" : "ध्वनी प्रदूषण" },
    { id: "other", label: language === "en" ? "Other Issues" : "इतर समस्या" }
  ];

  const stats = [
    {
      title: language === "en" ? "Resolved" : "सोडवल्या",
      value: "1,247",
      color: "bg-green-50 text-green-700",
      icon: <FiCheckCircle className="w-6 h-6" />
    },
    {
      title: language === "en" ? "In Progress" : "चालू आहेत",
      value: "23",
      color: "bg-blue-50 text-blue-700",
      icon: <FiClock className="w-6 h-6" />
    },
    {
      title: language === "en" ? "Under Review" : "तपासणीत",
      value: "48",
      color: "bg-yellow-50 text-yellow-700",
      icon: <FiAlertCircle className="w-6 h-6" />
    },
    {
      title: language === "en" ? "Avg. Resolution Time" : "सरासरी निराकरण वेळ",
      value: "3-7 Days",
      color: "bg-orange-50 text-orange-700",
      icon: <FiCalendar className="w-6 h-6" />
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setComplaintSubmitted(true);
      setShowForm(false);
      // Reset form after 3 seconds
      setTimeout(() => {
        setComplaintSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          ward: "",
          complaintType: "general",
          location: "",
          description: "",
          urgency: "medium"
        });
        setSelectedPhoto(null);
      }, 3000);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-orange-50 py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("complaints.title", language)}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {language === "en" 
                ? "Your voice matters. Report issues and we'll resolve them promptly."
                : "तुमचा आवाज महत्त्वाचा आहे. समस्या नोंदवा आणि आम्ही त्या लगेच सोडवू."}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}


      {/* Main Content */}
      <section className="py-12">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Statistics */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiAlertCircle className="text-orange-500" />
                  {language === "en" ? "Complaint Statistics" : "तक्रार आकडेवारी"}
                </h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">1,247+</div>
                    <div className="text-sm text-green-600">
                      {language === "en" ? "Complaints Resolved" : "तक्रारी सोडवल्या"}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">23</div>
                    <div className="text-sm text-blue-600">
                      {language === "en" ? "Currently in Progress" : "सध्या चालू आहेत"}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">48</div>
                    <div className="text-sm text-purple-600">
                      {language === "en" ? "Under Review" : "तपासणीत"}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-gray-900 mb-2">
                      {language === "en" ? "Average Resolution Time" : "सरासरी निराकरण वेळ"}
                    </h4>
                    <div className="text-2xl font-bold text-orange-600">3-7 Days</div>
                    <p className="text-sm text-gray-600 mt-2">
                      {language === "en" 
                        ? "Most complaints are resolved within a week"
                        : "बहुतांश तक्रारी एका आठवड्यात सोडवल्या जातात"}
                    </p>
                  </div>
                </div>
                
                {/* Emergency Contact */}
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                    <span>🚨</span>
                    {language === "en" ? "Emergency Contact" : "आपत्कालीन संपर्क"}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {language === "en" 
                      ? "For immediate assistance call:"
                      : "तत्काळ मदतीसाठी कॉल करा:"}
                  </p>
                  <a href="tel:1077" className="text-xl font-bold text-red-600 hover:text-red-700">
                    1077 ({language === "en" ? "Emergency" : "आपत्कालीन"})
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    {language === "en" 
                      ? "24/7 Helpline available"
                      : "24/7 हेल्पलाइन उपलब्ध"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Complaint Form */}
            <div className="lg:col-span-2">
              {!showForm && !complaintSubmitted ? (
                <div className="card">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiAlertCircle className="w-10 h-10 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {language === "en" ? "How to Register Complaint?" : "तक्रार कशी नोंदवायची?"}
                    </h3>
                    <p className="text-gray-600">
                      {language === "en" 
                        ? "Three simple steps to get your issue resolved"
                        : "तुमची समस्या सोडवण्याचे तीन सोपे चरण"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 font-bold text-xl">1</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        {language === "en" ? "Fill Details" : "तपशील भरा"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Enter your complaint details"
                          : "तुमचे तक्रारीचे तपशील प्रविष्ट करा"}
                      </p>
                    </div>
                    
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 font-bold text-xl">2</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        {language === "en" ? "Upload Photo" : "फोटो अपलोड करा"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Add photo evidence (optional)"
                          : "फोटो पुरावा जोडा (पर्यायी)"}
                      </p>
                    </div>
                    
                    <div className="text-center p-6 bg-orange-50 rounded-xl">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 font-bold text-xl">3</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        {language === "en" ? "Track Status" : "स्थिती ट्रॅक करा"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Get updates on your complaint"
                          : "तुमच्या तक्रारीवर अपडेट्स मिळवा"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                  >
                    <FiAlertCircle className="w-6 h-6" />
                    {t("complaints.submitComplaint", language)}
                  </button>
                </div>
              ) : showForm ? (
                <div className="card">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {t("complaints.formTitle", language)}
                  </h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("complaints.name", language)} *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder={language === "en" ? "Enter your full name" : "तुमचे पूर्ण नाव प्रविष्ट करा"}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("complaints.phone", language)} *
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
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === "en" ? "Ward Number *" : "वॉर्ड नंबर *"}
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={formData.ward}
                          onChange={(e) => setFormData({...formData, ward: e.target.value})}
                        >
                          <option value="">{language === "en" ? "Select Ward" : "वॉर्ड निवडा"}</option>
                          {[24, 25, 26, 27, 28].map(ward => (
                            <option key={ward} value={ward}>
                              {language === "en" ? `Ward ${ward}` : `वॉर्ड ${ward}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("complaints.complaintType", language)} *
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={formData.complaintType}
                          onChange={(e) => setFormData({...formData, complaintType: e.target.value})}
                        >
                          <option value="">{language === "en" ? "Select Type" : "प्रकार निवडा"}</option>
                          {complaintTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {language === "en" ? "Exact Location *" : "नक्की स्थान *"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === "en" ? "Street, Landmark, Area" : "रस्ता, लँडमार्क, क्षेत्र"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("complaints.description", language)} *
                      </label>
                      <textarea
                        required
                        rows="4"
                        placeholder={language === "en" ? "Describe your issue in detail..." : "तुमची समस्या तपशीलवार वर्णन करा..."}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <FiCamera className="w-4 h-4" />
                        {t("complaints.uploadPhoto", language)}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                        {selectedPhoto ? (
                          <div className="relative">
                            <img 
                              src={selectedPhoto} 
                              alt="Preview" 
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setSelectedPhoto(null)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div>
                            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 mb-2">
                              {language === "en" 
                                ? "Drag & drop or click to upload"
                                : "ड्रॅग आणि ड्रॉप करा किंवा अपलोड करण्यासाठी क्लिक करा"}
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              id="photo-upload"
                            />
                            <label
                              htmlFor="photo-upload"
                              className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                            >
                              {language === "en" ? "Choose File" : "फाइल निवडा"}
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === "en" ? "Urgency Level" : "गतिमानता पातळी"}
                        </label>
                        <select
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                          value={formData.urgency}
                          onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                        >
                          <option value="low">{language === "en" ? "Low" : "कमी"}</option>
                          <option value="medium">{language === "en" ? "Medium" : "मध्यम"}</option>
                          <option value="high">{language === "en" ? "High" : "उच्च"}</option>
                          <option value="emergency">{language === "en" ? "Emergency" : "आपत्कालीन"}</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          {language === "en" ? "Cancel" : "रद्द करा"}
                        </button>
                        <button
                          type="submit"
                          className="btn-primary flex items-center gap-2"
                        >
                          <FiSend className="w-5 h-5" />
                          {t("complaints.submitComplaint", language)}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="card text-center border-green-200">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {language === "en" ? "Complaint Registered Successfully!" : "तक्रार यशस्वीरित्या नोंदवली!"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === "en" 
                      ? "Your complaint ID is: COMP-2024-1247"
                      : "तुमचा तक्रार आयडी आहे: COMP-2024-1247"}
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-700">
                      {language === "en" 
                        ? "We'll contact you within 24 hours. You can track your complaint status using the complaint ID."
                        : "आम्ही 24 तासांच्या आत तुमच्याशी संपर्क साधू. तुम्ही तक्रार आयडी वापरून तुमच्या तक्रारीची स्थिती ट्रॅक करू शकता."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setComplaintSubmitted(false);
                      setShowForm(false);
                    }}
                    className="btn-primary"
                  >
                    {language === "en" ? "Register Another Complaint" : "आणखी एक तक्रार नोंदवा"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Track Complaint */}
      <section className="py-12 bg-gray-50">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Track Your Complaint" : "तुमची तक्रार ट्रॅक करा"}
            </h2>
            <p className="text-gray-700 mb-8">
              {language === "en" 
                ? "Enter your complaint ID to check the status of your complaint"
                : "तुमच्या तक्रारीची स्थिती तपासण्यासाठी तुमचा तक्रार आयडी प्रविष्ट करा"}
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder={language === "en" ? "Enter Complaint ID" : "तक्रार आयडी प्रविष्ट करा"}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                {language === "en" ? "Track" : "ट्रॅक करा"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}