import ComplaintsPageClient from "./ComplaintsPageClient";

export const metadata = {
  title: "Register Ward Complaint | Corporator Sachin Lavate | Ward 24(D)",
  description:
    "Register and track Ward 24(D), Nerul civic complaints about roads, water, garbage, drainage, street lights, and public spaces.",
  keywords: [
    "Nerul BJP corporator complaint",
    "Water, road, drainage complaint Nerul"
  ],
  alternates: {
    canonical: "/complaints",
  },
};

export default function ComplaintsPage() {
  return <ComplaintsPageClient />;
}
