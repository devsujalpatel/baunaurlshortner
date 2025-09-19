import { headers } from "next/headers";
import ShortenClientPage from "./shorten-client-page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Shorten() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }
  return <ShortenClientPage />;
}
