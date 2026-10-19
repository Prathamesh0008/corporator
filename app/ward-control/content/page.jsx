import SiteContentManager from "../../../components/admin/SiteContentManager";
export const metadata = {
  title: "Site Content | Admin",
  robots: { index: false },
};
export default function SiteContentPage() {
  return <SiteContentManager />;
}
