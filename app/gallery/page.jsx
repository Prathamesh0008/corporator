import GalleryPageClient from "./GalleryPageClient";

export const metadata = {
  title: "Nerul BJP Nagarsevak | Development Work Photo Gallery",
  description:
    "View development work photos and project images by Nerul BJP Nagarsevak Sachin Lavate, showcasing ward progress and public works.",
  keywords: ["BJP Nagarsevak Nerul work photos"],
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
