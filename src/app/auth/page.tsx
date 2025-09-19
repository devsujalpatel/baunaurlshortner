import { auth } from "@/lib/auth";
import AuthClientPage from "./auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Auth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/shorten");
  }
  return <AuthClientPage />;
}
