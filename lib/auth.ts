import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserDTO } from "@/types/domain";
export const cookieName = "library_session";
export function backendUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  return base.replace(/\/$/, "") + path;
}
export async function session() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  const response = await fetch(backendUrl("/api/users/profile"), {
    headers: { Authorization: "Bearer " + token },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok)
    throw new Error("The library service is unavailable. Please try again.");
  return (await response.json()) as UserDTO;
}
export async function requireUser(admin = false) {
  const user = await session();
  if (!user) redirect("/login");
  if (admin && user.role !== "ROLE_ADMIN") redirect("/forbidden");
  return user;
}
