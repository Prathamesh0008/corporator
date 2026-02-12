import AdminPageClient from "./AdminPageClient";

export const metadata = {
  title: "Admin Dashboard | Submissions",
  description: "Admin dashboard for complaints and contact form submissions.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/admin",
  },
};

export default function AdminPage() {
  return <AdminPageClient />;
}
