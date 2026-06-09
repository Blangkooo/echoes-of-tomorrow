import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth?.user;
  const isOnboarded = (req.auth?.user as { onboarded?: boolean })?.onboarded ?? false;

  const pathname = nextUrl.pathname;

  // Always allow: static files, api/auth, public pages
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/" ||
    pathname === "/signin"
  ) {
    // If already signed in and going to /signin → redirect appropriately
    if (isAuthenticated && pathname === "/signin") {
      return NextResponse.redirect(
        new URL(isOnboarded ? "/dashboard" : "/onboarding", nextUrl)
      );
    }
    return NextResponse.next();
  }

  // Not signed in → go to signin
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  // Signed in but not onboarded → only allow /onboarding
  if (!isOnboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  // Signed in and onboarded → don't let them go back to onboarding
  if (isOnboarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
