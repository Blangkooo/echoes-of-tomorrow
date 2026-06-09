import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/signin"];
const ONBOARDING_PATH = "/onboarding";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuthenticated = !!session?.user;
  const isPublicPath = PUBLIC_PATHS.includes(nextUrl.pathname);
  const isOnboarding = nextUrl.pathname === ONBOARDING_PATH;
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");

  // Always allow auth API routes
  if (isApiAuth) return NextResponse.next();

  // Redirect unauthenticated users to sign in
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  // Redirect authenticated users away from sign in
  if (isAuthenticated && nextUrl.pathname === "/signin") {
    const isOnboarded = (session.user as { onboarded?: boolean }).onboarded;
    return NextResponse.redirect(
      new URL(isOnboarded ? "/dashboard" : "/onboarding", nextUrl)
    );
  }

  // Redirect non-onboarded users to onboarding
  if (isAuthenticated && isDashboard) {
    const isOnboarded = (session.user as { onboarded?: boolean }).onboarded;
    if (!isOnboarded) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }
  }

  // Redirect onboarded users away from onboarding
  if (isAuthenticated && isOnboarding) {
    const isOnboarded = (session.user as { onboarded?: boolean }).onboarded;
    if (isOnboarded) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
