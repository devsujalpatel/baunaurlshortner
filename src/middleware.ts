import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (
    req.nextUrl.pathname.startsWith("/shorten") ||
    req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/shorten/:path*", "/dashboard/:path*", "/shorten", "/dashboard"],
};
