"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiGrid, FiImage, FiPlay, FiX } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";

const PHOTO_ITEMS = [
  {
    id: 1,
    title: { en: "Community Gathering", mr: "समुदायिक मेळावा" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/1.png"
  },
  {
    id: 2,
    title: { en: "Cleanliness Drive", mr: "स्वच्छता मोहीम" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/2.png"
  },
  {
    id: 3,
    title: { en: "Health Camp", mr: "आरोग्य शिबिर" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/3.png"
  },
  {
    id: 4,
    title: { en: "Road Work", mr: "रस्ते काम" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/4.png"
  },
  {
    id: 5,
    title: { en: "Drainage Upgrade", mr: "ड्रेनेज सुधारणा" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/5.png"
  },
  {
    id: 6,
    title: { en: "Water Supply", mr: "पाणीपुरवठा" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/6.png"
  },
  {
    id: 7,
    title: { en: "Women Safety", mr: "महिला सुरक्षा" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/7.png"
  },
  {
    id: 8,
    title: { en: "Youth Engagement", mr: "युवा सहभाग" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support/8.png"
  },
  {
    id: 9,
    title: { en: "Ward Development", mr: "वॉर्ड विकास" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/support-2.png"
  },
  {
    id: 10,
    title: { en: "Community Work", mr: "समुदाय कार्य" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/1.png"
  },
  {
    id: 11,
    title: { en: "Public Event", mr: "सार्वजनिक कार्यक्रम" },
    date: { en: "2024", mr: "२०२४" },
    src: "/gallery/11.jpg"
  }
];

const VIDEO_ITEMS = [
  {
    id: 1,
    title: { en: "Ward updates reel", mr: "वॉर्ड अपडेट्स रील" },
    date: { en: "Latest", mr: "नवीनतम" },
    thumb: "/gallery/support/3.png",
    href: "https://www.instagram.com/reel/DUVeWRGiL6R/"
  },
  {
    id: 2,
    title: { en: "Citizen services reel", mr: "नागरिक सेवा रील" },
    date: { en: "Latest", mr: "नवीनतम" },
    thumb: "/gallery/support/6.png",
    href: "https://www.instagram.com/reel/DTvuyTDDP7v/"
  },
  {
    id: 3,
    title: { en: "Community work reel", mr: "समुदाय कार्य रील" },
    date: { en: "Latest", mr: "नवीनतम" },
    thumb: "/gallery/support/4.png",
    href: "https://www.instagram.com/reel/DUV-a2AjNiH/"
  }
];

export default function GalleryPage() {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const galleryPhotos = useMemo(
    () =>
      PHOTO_ITEMS.map((item) => ({
        id: item.id,
        src: item.src,
        title: item.title[language],
        date: item.date[language]
      })),
    [language]
  );

  const galleryVideos = useMemo(
    () =>
      VIDEO_ITEMS.map((item) => ({
        id: item.id,
        thumb: item.thumb,
        href: item.href,
        title: item.title[language],
        date: item.date[language]
      })),
    [language]
  );

  const featuredVideo = galleryVideos[0] ?? null;
  const spotlightPhotos = galleryPhotos.slice(0, 2);

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const closeModal = () => setSelectedImage(null);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#0B3D91] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,112,33,0.55),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(19,136,8,0.45),_transparent_55%)]" />
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#F37021]/45 blur-3xl" />
        <div className="absolute -right-16 top-16 h-64 w-64 rounded-full bg-[#138808]/35 blur-3xl" />
        <div className="container-responsive px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80">
                {language === "en" ? "Media Gallery" : "मीडिया गॅलरी"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-balance text-white/80 sm:text-5xl lg:text-6xl">
                {language === "en" ? "Ward 24(D) in Motion" : "वॉर्ड २४(ड) गतिमान"}
              </h1>
              <p className="max-w-2xl text-lg text-white/80">
                {language === "en"
                  ? "Moments from citizen services, development work, and public outreach captured in photos and reels."
                  : "नागरिक सेवा, विकासकामे आणि जनसंपर्कातील क्षण फोटो व रील्समध्ये टिपलेले."}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl" />
              <div className="relative grid gap-4">
                {featuredVideo ? (
                  <a
                    href={featuredVideo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={featuredVideo.title}
                    className="group relative overflow-hidden rounded-[28px] border border-white/15 bg-black/20 shadow-2xl shadow-black/30"
                  >
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={featuredVideo.thumb}
                        alt={featuredVideo.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#0B3D91]">
                        {language === "en" ? "Featured Reel" : "विशेष रील"}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
                        <div className="text-sm font-semibold text-white">{featuredVideo.title}</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#F97316] shadow-lg">
                          <FiPlay className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="rounded-[28px] border border-white/15 bg-black/20 p-6 text-sm text-white/80">
                    {language === "en" ? "Video highlights will be added soon." : "व्हिडिओ हायलाइट्स लवकरच जोडले जातील."}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {spotlightPhotos.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedImage(photo)}
                      aria-label={photo.title}
                      className="group relative overflow-hidden rounded-[24px] border border-white/15 bg-black/20"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={photo.src}
                          alt={photo.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
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

      <section id="gallery-content" className="bg-white py-10">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F97316]">
                {language === "en" ? "Browse" : "ब्राउझ करा"}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
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
                  type="button"
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-[#F97316] text-white shadow-md"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
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
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
                <FiImage className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F97316]">
                  {language === "en" ? "Photos" : "फोटो"}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {language === "en" ? "Community Moments" : "समुदायिक क्षण"}
                </h3>
              </div>
            </div>

            {galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {galleryPhotos.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedImage(item)}
                    aria-label={item.title}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                        <FiCalendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-600">
                {language === "en" ? "No photos available right now." : "सध्या फोटो उपलब्ध नाहीत."}
              </div>
            )}
          </div>
        </section>
      )}

      {(activeTab === "all" || activeTab === "videos") && (
        <section className="bg-[#fff7ed] py-12">
          <div className="container-responsive px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F97316] text-white">
                  <FiPlay className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F97316]">
                    {language === "en" ? "Videos" : "व्हिडिओ"}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {language === "en" ? "Instagram Reels" : "इन्स्टाग्राम रील्स"}
                  </h3>
                </div>
              </div>
              <a
                href="https://www.instagram.com/samajsevaksachinlavate/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#F97316] px-5 py-2 text-sm font-semibold text-[#F97316] transition hover:bg-[#F97316] hover:text-white"
              >
                <FaInstagram className="h-4 w-4" />
                {language === "en" ? "View Instagram" : "इन्स्टाग्राम पहा"}
              </a>
            </div>

            {galleryVideos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {galleryVideos.map((video) => (
                  <a
                    key={video.id}
                    href={video.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={video.title}
                    className="group overflow-hidden rounded-3xl border border-[#FBD8B0] bg-white shadow-sm transition hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image
                        src={video.thumb}
                        alt={video.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#F97316] shadow-lg">
                          <FiPlay className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                        <FiCalendar className="h-4 w-4" />
                        <span>{video.date}</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{video.title}</div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#FBD8B0] bg-white px-6 py-10 text-center text-gray-600">
                {language === "en" ? "No videos available right now." : "सध्या व्हिडिओ उपलब्ध नाहीत."}
              </div>
            )}
          </div>
        </section>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
            className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white"
          >
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <h3 id="gallery-modal-title" className="text-2xl font-bold text-gray-900">
                  {selectedImage.title}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label={language === "en" ? "Close image preview" : "प्रतिमा पूर्वावलोकन बंद करा"}
                  className="text-gray-500 transition hover:text-gray-700"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="h-auto w-full object-contain"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="h-4 w-4" />
                <span>{selectedImage.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-r from-[#fff7ed] via-white to-[#ecfdf5] py-14">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F97316] shadow">
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
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-[#e25f0d]"
              >
                <FaInstagram className="h-4 w-4" />
                {language === "en" ? "Follow on Instagram" : "इन्स्टाग्रामवर फॉलो करा"}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                {language === "en" ? "Contact Office" : "कार्यालयाशी संपर्क"}
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
