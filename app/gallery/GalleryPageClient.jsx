"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiGrid,
  FiImage,
  FiPlay,
  FiX
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";

export default function GalleryPage() {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const galleryPhotos = [
    {
      id: 1,
      title: language === "en" ? "Community Gathering" : "समुदायिक मेळावा",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/1.png"
    },
    {
      id: 2,
      title: language === "en" ? "Cleanliness Drive" : "स्वच्छता मोहीम",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/2.png"
    },
    {
      id: 3,
      title: language === "en" ? "Health Camp" : "आरोग्य शिबिर",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/3.png"
    },
    {
      id: 4,
      title: language === "en" ? "Road Work" : "रस्ते काम",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/4.png"
    },
    {
      id: 5,
      title: language === "en" ? "Drainage Upgrade" : "ड्रेनेज सुधारणा",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/5.png"
    },
    {
      id: 6,
      title: language === "en" ? "Water Supply" : "पाणीपुरवठा",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/6.png"
    },
    {
      id: 7,
      title: language === "en" ? "Women Safety" : "महिला सुरक्षा",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/7.png"
    },
    {
      id: 8,
      title: language === "en" ? "Youth Engagement" : "युवा सहभाग",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support/8.png"
    },
    {
      id: 9,
      title: language === "en" ? "Ward Development" : "वॉर्ड विकास",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/support-2.png"
    },
    {
      id: 10,
      title: language === "en" ? "Community Work" : "समुदाय कार्य",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/1.png"
    },
    {
      id: 11,
      title: language === "en" ? "Public Event" : "सार्वजनिक कार्यक्रम",
      date: language === "en" ? "2024" : "२०२४",
      src: "/gallery/11.jpg"
    }
  ];

  const galleryVideos = [
    {
      id: 1,
      title: language === "en" ? "Ward updates reel" : "वॉर्ड अपडेट्स रील",
      date: language === "en" ? "Latest" : "नवीनतम",
      thumb: "/gallery/support/3.png",
      href: "https://www.instagram.com/reel/DUVeWRGiL6R/"
    },
    {
      id: 2,
      title: language === "en" ? "Citizen services reel" : "नागरिक सेवा रील",
      date: language === "en" ? "Latest" : "नवीनतम",
      thumb: "/gallery/support/6.png",
      href: "https://www.instagram.com/reel/DTvuyTDDP7v/"
    },
    {
      id: 3,
      title: language === "en" ? "Community work reel" : "समुदाय कार्य रील",
      date: language === "en" ? "Latest" : "नवीनतम",
      thumb: "/gallery/support/4.png",
      href: "https://www.instagram.com/reel/DUV-a2AjNiH/"
    }
  ];

  const featuredVideo = galleryVideos[0];
  const spotlightPhotos = galleryPhotos.slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#0B3D91] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,112,33,0.55),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(19,136,8,0.45),_transparent_55%)]" />
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#F37021]/45 blur-3xl" />
        <div className="absolute -right-16 top-16 h-64 w-64 rounded-full bg-[#138808]/35 blur-3xl" />
        <div className="container-responsive px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80">
                {language === "en" ? "Media Gallery" : "मीडिया गॅलरी"}
              </div>
              <h1 className="text-4xl sm:text-5xl text-white/80 lg:text-6xl font-semibold leading-tight text-balance">
                {language === "en" ? "Ward 24(D) in Motion" : "वॉर्ड २४(ड) गतिमान"}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                {language === "en"
                  ? "Moments from citizen services, development work, and public outreach captured in photos and reels."
                  : "नागरिक सेवा, विकासकामे आणि जनसंपर्कातील क्षण फोटो व रील्समध्ये टिपलेले."}
              </p>
              
             
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl" />
              <div className="relative grid gap-4">
                <a
                  href={featuredVideo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-[28px] border border-white/15 bg-black/20 shadow-2xl shadow-black/30"
                >
                  <div className="relative aspect-[16/9]">
                    <img
                      src={featuredVideo.thumb}
                      alt={featuredVideo.title}
                      className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#0B3D91]">
                      {language === "en" ? "Featured Reel" : "विशेष रील"}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white">{featuredVideo.title}</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-white/90 text-[#F97316] flex items-center justify-center shadow-lg">
                        <FiPlay className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </a>
                <div className="grid sm:grid-cols-2 gap-4">
                  {spotlightPhotos.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedImage(photo)}
                      className="group relative overflow-hidden rounded-[24px] border border-white/15 bg-black/20"
                    >
                      <div className="relative aspect-[4/3]">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white">
                          {photo.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery-content" className="py-10 bg-white">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#F97316] font-semibold">
                {language === "en" ? "Browse" : "ब्राउझ करा"}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {language === "en" ? "Gallery Highlights" : "गॅलरीतील ठळक क्षण"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: language === "en" ? "All" : "सर्व", icon: <FiGrid /> },
                { id: "photos", label: language === "en" ? "Photos" : "फोटो", icon: <FiImage /> },
                { id: "videos", label: language === "en" ? "Videos" : "व्हिडिओ", icon: <FiPlay /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-[#F97316] text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {(activeTab === "all" || activeTab === "photos") && (
        <section className="py-10">
          <div className="container-responsive px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                <FiImage className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-[#F97316] font-semibold">
                  {language === "en" ? "Photos" : "फोटो"}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {language === "en" ? "Community Moments" : "समुदायिक क्षण"}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryPhotos.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="group text-left rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {(activeTab === "all" || activeTab === "videos") && (
        <section className="py-12 bg-[#fff7ed]">
          <div className="container-responsive px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#F97316] text-white flex items-center justify-center">
                  <FiPlay className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-[#F97316] font-semibold">
                    {language === "en" ? "Videos" : "व्हिडिओ"}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {language === "en" ? "Instagram Reels" : "इन्स्टाग्राम रील्स"}
                  </h3>
                </div>
              </div>
              <a
                href="https://www.instagram.com/samajsevaksachinlavate/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F97316] px-5 py-2 text-sm font-semibold text-[#F97316] hover:bg-[#F97316] hover:text-white transition"
              >
                <FaInstagram className="w-4 h-4" />
                {language === "en" ? "View Instagram" : "इन्स्टाग्राम पहा"}
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-3xl overflow-hidden border border-[#FBD8B0] bg-white shadow-sm hover:shadow-lg transition"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={video.thumb}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/90 text-[#F97316] flex items-center justify-center shadow-lg">
                        <FiPlay className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>{video.date}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{video.title}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>{selectedImage.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-14 bg-gradient-to-r from-[#fff7ed] via-white to-[#ecfdf5]">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#F97316] font-semibold shadow">
              {language === "en" ? "Stay Connected" : "जोडलेले राहा"}
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              {language === "en" ? "Follow the Journey" : "प्रवासाचा मागोवा घ्या"}
            </h2>
            <p className="mt-3 text-gray-700">
              {language === "en"
                ? "See the latest updates, community events, and service milestones on Instagram."
                : "इन्स्टाग्रामवर ताजे अपडेट्स, समुदाय कार्यक्रम आणि सेवा टप्प्यांची माहिती पाहा."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="https://www.instagram.com/samajsevaksachinlavate/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:bg-[#e25f0d] transition"
              >
                <FaInstagram className="w-4 h-4" />
                {language === "en" ? "Follow on Instagram" : "इन्स्टाग्रामवर फॉलो करा"}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                {language === "en" ? "Contact Office" : "कार्यालयाशी संपर्क"}
                <FiArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

