import { redirect } from "next/navigation";
import { API_BASE_URL } from "../api";
export default function AdminPage() {
  redirect(process.env.ADMIN_URL ?? API_BASE_URL.replace(/\/api\/?$/, "") + "/admin");
}
