import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PAGES = ["/login", "/forgot-password", "/verify-otp", "/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = AUTH_PAGES.some((route) => pathname.startsWith(route));
  const hasAccessToken = Boolean(token?.accessToken);

  if (isAuthPage && hasAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthPage && !hasAccessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isAuthPage && hasAccessToken) {
    const normalizedRole = String(token?.role || "").toLowerCase();
    const allowedRoles = ["admin", "vendor"];

    if (!allowedRoles.includes(normalizedRole)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
