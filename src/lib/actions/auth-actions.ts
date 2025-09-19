"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};

export const signInSocial = async (provider: "google" | "github") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/shorten",
    },
  });

  if(url) {
    redirect(url);
  }
};
