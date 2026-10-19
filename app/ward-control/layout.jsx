import AdminShell from "../../components/admin/AdminShell";
import "./admin.css";

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
