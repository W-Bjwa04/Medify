import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Public routes — middleware runs but won't redirect unauthenticated users
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/auth/error"];

export default auth((req) => {
  const session = req.auth;
  const pathname = req.nextUrl.pathname;
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  // Redirect logged-in users away from the home/login page to their dashboard
  if (session && (pathname === "/" || pathname.startsWith("/auth"))) {
    const role = (session.user as any)?.role;
    if (role === "patient") return NextResponse.redirect(new URL("/", req.url));
    if (role === "doctor") return NextResponse.redirect(new URL("/", req.url));
    if (role === "admin") return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const role = (session?.user as any)?.role;

  // Role-based access control for authenticated users
  if (pathname.startsWith("/patient") && role !== "patient") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/doctor") && role !== "doctor") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  // Run middleware on all routes except Next.js internals, static files, and Auth.js API routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.png$|.*\\.svg$).*)"],
};
