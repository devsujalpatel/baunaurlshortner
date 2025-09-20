import { headers } from "next/headers";
import ShortenClientPage from "./shorten-client-page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UrlClient from "@/app/shorten/url-client";

export default async function Shorten() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }
  return (
    <div className="flex gap-4 w-full h-screen justify-around">
      <ShortenClientPage />
      <UrlClient />
    </div>
  );
}
