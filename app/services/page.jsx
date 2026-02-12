import ServicesPageClient from "./ServicesPageClient";

export const metadata = {
  title: "BJP Nagarsevak in Nerul | Public & Citizen Services",
  description:
    "Get public and citizen services from Nerul BJP Nagarsevak Sachin Lavate, including complaint help, welfare support, and government assistance.",
  keywords: ["Nerul BJP corporator services", "Nagarsevak services in Nerul"],
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
