import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/admin/AdminLogin";

export default async function AdminPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }
  return <AdminLogin />;
}
