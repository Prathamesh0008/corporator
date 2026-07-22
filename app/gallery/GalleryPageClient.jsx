"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiGrid, FiImage, FiPlay, FiX } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "../../contexts/LanguageContext";

const PHOTOS = [
  [1, "Community Gathering", "सामुदायिक मेळावा", "Community", "समुदाय", "/gallery/support/1.png"],
  [2, "Cleanliness Drive", "स्वच्छता मोहीम", "Community", "समुदाय", "/gallery/support/2.png"],
  [3, "Health Camp", "आरोग्य शिबिर", "Health", "आरोग्य", "/gallery/support/3.png"],
  [4, "Road Work", "रस्त्याचे काम", "Development", "विकासकामे", "/gallery/support/4.png"],
  [5, "Drainage Upgrade", "ड्रेनेज सुधारणा", "Development", "विकासकामे", "/gallery/support/5.png"],
  [6, "Water Supply Work", "पाणीपुरवठा काम", "Development", "विकासकामे", "/gallery/support/6.png"],
  [7, "Women Safety Initiative", "महिला सुरक्षा उपक्रम", "Public Events", "सार्वजनिक कार्यक्रम", "/gallery/support/7.png"],
  [8, "Youth Engagement", "युवा सहभाग", "Public Events", "सार्वजनिक कार्यक्रम", "/gallery/support/8.png"],
  [9, "Ward Development", "वॉर्ड विकास", "Development", "विकासकामे", "/gallery/support-2.png"],
  [10, "Community Service", "समुदाय सेवा", "Community", "समुदाय", "/gallery/1.png"],
  [11, "Public Event", "सार्वजनिक कार्यक्रम", "Public Events", "सार्वजनिक कार्यक्रम", "/gallery/11.jpg"],
].map(([id, titleEn, titleMr, categoryEn, categoryMr, src]) => ({ id, titleEn, titleMr, categoryEn, categoryMr, src, date: "2024" }));

const VIDEOS = [
  [1, "Ward updates reel", "वॉर्ड अपडेट्स रील", "/gallery/support/3.png", "https://www.instagram.com/reel/DUVeWRGiL6R/"],
  [2, "Citizen services reel", "नागरिक सेवा रील", "/gallery/support/6.png", "https://www.instagram.com/reel/DTvuyTDDP7v/"],
  [3, "Community work reel", "समुदाय कार्य रील", "/gallery/support/4.png", "https://www.instagram.com/reel/DUV-a2AjNiH/"],
].map(([id, titleEn, titleMr, thumb, href]) => ({ id, titleEn, titleMr, thumb, href }));

const PAGE_SIZE = 12;

export default function GalleryPageClient() {
  const { language } = useLanguage();
  const mr = language === "mr";
  const [mediaType, setMediaType] = useState("photos");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [publishedItems, setPublishedItems] = useState([]);

  useEffect(() => { fetch("/api/gallery").then((response) => response.ok ? response.json() : Promise.reject()).then((data) => setPublishedItems(data.items || [])).catch(() => {}); }, []);
  const allPhotos = useMemo(() => [...publishedItems.filter((item) => item.type === "photo").map((item) => ({ ...item, src: item.image })), ...PHOTOS], [publishedItems]);
  const allVideos = useMemo(() => [...publishedItems.filter((item) => item.type === "video").map((item) => ({ ...item, thumb: item.image })), ...VIDEOS], [publishedItems]);
  const categories = ["All", ...new Set(allPhotos.map((photo) => photo.categoryEn))];
  const filteredPhotos = useMemo(() => allPhotos.filter((photo) => category === "All" || photo.categoryEn === category), [allPhotos, category]);
  const selectedPhoto = selectedIndex === null ? null : filteredPhotos[selectedIndex];

  useEffect(() => {
    if (!selectedPhoto) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") setSelectedIndex((index) => (index - 1 + filteredPhotos.length) % filteredPhotos.length);
      if (event.key === "ArrowRight") setSelectedIndex((index) => (index + 1) % filteredPhotos.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [selectedPhoto, filteredPhotos.length]);

  const chooseCategory = (value) => { setCategory(value); setVisibleCount(PAGE_SIZE); setSelectedIndex(null); };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-responsive px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-orange-600">{mr ? "वॉर्ड २४(ड), नेरूळ" : "WARD 24(D), NERUL"}</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">{mr ? "फोटो आणि व्हिडिओ गॅलरी" : "Photo & Video Gallery"}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{mr ? "विकासकामे, नागरिक सेवा आणि सार्वजनिक कार्यक्रमांतील निवडक क्षण." : "Selected moments from development works, citizen services and public events."}</p>
            </div>
            <div className="inline-flex self-start rounded-xl border border-slate-200 bg-slate-100 p-1">
              <Tab active={mediaType === "photos"} onClick={() => setMediaType("photos")} icon={<FiImage />} label={mr ? "फोटो" : "Photos"} />
              <Tab active={mediaType === "videos"} onClick={() => setMediaType("videos")} icon={<FiPlay />} label={mr ? "व्हिडिओ" : "Videos"} />
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive px-4 py-8 sm:px-6 lg:px-8">
        {mediaType === "photos" ? (
          <>
            <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((item) => {
                const sample = allPhotos.find((photo) => photo.categoryEn === item);
                const label = item === "All" ? (mr ? "सर्व" : "All") : (mr ? sample.categoryMr : item);
                return <button key={item} type="button" onClick={() => chooseCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${category === item ? "border-orange-600 bg-orange-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"}`}>{label}</button>;
              })}
            </div>

            <div className="mb-4 mt-2 flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 font-bold text-slate-700"><FiGrid className="text-orange-600" /> {mr ? `${filteredPhotos.length} फोटो` : `${filteredPhotos.length} photos`}</span>
              <span className="text-slate-500">{mr ? "फोटो पाहण्यासाठी क्लिक करा" : "Click a photo to view"}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filteredPhotos.slice(0, visibleCount).map((photo, index) => (
                <button key={photo.id} type="button" onClick={() => setSelectedIndex(index)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image src={photo.src} alt={mr ? photo.titleMr : photo.titleEn} fill unoptimized={String(photo.src).startsWith("http")} sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3 right-3 line-clamp-1 text-xs font-bold text-white sm:text-sm">{mr ? photo.titleMr : photo.titleEn}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-[11px] font-semibold text-slate-500">
                    <span className="truncate text-orange-700">{mr ? photo.categoryMr : photo.categoryEn}</span>
                    <span className="inline-flex items-center gap-1"><FiCalendar /> {photo.date}</span>
                  </div>
                </button>
              ))}
            </div>

            {visibleCount < filteredPhotos.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="rounded-xl border border-orange-200 bg-white px-6 py-3 text-sm font-black text-orange-700 hover:bg-orange-50">{mr ? "आणखी फोटो पहा" : "Show more photos"}</button></div>}
          </>
        ) : (
          <VideoGallery mr={mr} videos={allVideos} />
        )}
      </main>

      {selectedPhoto && <Lightbox photo={selectedPhoto} mr={mr} onClose={() => setSelectedIndex(null)} onPrevious={() => setSelectedIndex((selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length)} onNext={() => setSelectedIndex((selectedIndex + 1) % filteredPhotos.length)} />}
    </div>
  );
}

function Tab({ active, onClick, icon, label }) {
  return <button type="button" onClick={onClick} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-black transition ${active ? "bg-white text-orange-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>{icon}{label}</button>;
}

function VideoGallery({ mr, videos }) {
  return <section>
    <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.16em] text-orange-600">{mr ? "व्हिडिओ" : "VIDEOS"}</p><h2 className="mt-1 text-2xl font-black text-slate-900">{mr ? "इन्स्टाग्राम रील्स" : "Instagram Reels"}</h2></div><a href="https://www.instagram.com/samajsevaksachinlavate/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-xs font-black text-orange-700 hover:bg-orange-50"><FaInstagram /> {mr ? "इन्स्टाग्राम पहा" : "View Instagram"}</a></div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{videos.map((video) => <a key={video.id} href={video.href} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-video overflow-hidden"><Image src={video.thumb} alt={mr ? video.titleMr : video.titleEn} fill unoptimized={String(video.thumb).startsWith("http")} sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-black/35" /><span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-orange-600 shadow-lg"><FiPlay /></span></div><div className="p-4 font-black text-slate-900">{mr ? video.titleMr : video.titleEn}</div></a>)}</div>
  </section>;
}

function Lightbox({ photo, mr, onClose, onPrevious, onNext }) {
  return <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-3 sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={mr ? "फोटो पूर्वावलोकन" : "Photo preview"}>
    <button type="button" onClick={onClose} aria-label={mr ? "बंद करा" : "Close"} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"><FiX /></button>
    <button type="button" onClick={onPrevious} aria-label={mr ? "मागील फोटो" : "Previous photo"} className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-6"><FiChevronLeft /></button>
    <div className="w-full max-w-5xl"><div className="relative h-[70vh] overflow-hidden rounded-xl"><Image src={photo.src} alt={mr ? photo.titleMr : photo.titleEn} fill unoptimized={String(photo.src).startsWith("http")} sizes="90vw" className="object-contain" priority /></div><div className="mt-3 text-center"><h2 className="font-black text-white">{mr ? photo.titleMr : photo.titleEn}</h2><p className="mt-1 text-xs text-white/60">{mr ? photo.categoryMr : photo.categoryEn} · {photo.date}</p></div></div>
    <button type="button" onClick={onNext} aria-label={mr ? "पुढील फोटो" : "Next photo"} className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-6"><FiChevronRight /></button>
  </div>;
}
