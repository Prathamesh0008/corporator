import AboutPageClient from "./AboutPageClient";

export const metadata = {
  title: "About Sachin Devappa Lavate | Biography & Public Service in Nerul",
  description:
    "Learn about Sachin Devappa Lavate's life journey, biography, social work, leadership, and dedication to public service in Nerul.",
  keywords: ["About Sachin Devappa Lavate"],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
