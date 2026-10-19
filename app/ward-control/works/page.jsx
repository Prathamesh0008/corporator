import ContentManager from "../../../components/admin/ContentManager";
export const metadata = {
  title: "Manage Works | Admin",
  robots: { index: false },
};
export default function ManageWorksPage() {
  return <ContentManager type="works" />;
}
