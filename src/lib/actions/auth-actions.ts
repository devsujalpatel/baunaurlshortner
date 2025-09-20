"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const signOut = async () => {
  return await auth.api.signOut({ headers: await headers() });
};

export const signInSocial = async (provider: "google" | "github") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/shorten", // after login, send user here
      requestSignUp: true,
    },
    headers: await headers(),
  });

  if (url) redirect(url);
};
