import { redirect } from "next/navigation";

export default function GlobalAdminRootPage() {
  // Redirect the global /admin page to the main fintech super admin hub
  redirect("/fintech/admin");
}
