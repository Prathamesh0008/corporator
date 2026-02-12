import ComplaintsPageClient from "./ComplaintsPageClient";

export const metadata = {
  title: "Sachin Lavate | Nerul BJP Corporator Complaint and Solution Center",
  description:
    "Register water, road, and drainage complaints in Nerul at Sachin Lavate's BJP corporator complaint and solution center for quick public issue resolution.",
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
