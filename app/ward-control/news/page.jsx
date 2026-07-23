import ContentManager from "../../../components/admin/ContentManager";
export const metadata = { title: "Manage News | Admin", robots: { index: false } };
export default function ManageNewsPage() { return <ContentManager type="news" />; }
