import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Middleware checking path:", path);

  // Skip middleware for HMR and development requests
  if (path.includes("_next") || path.includes("webpack-hmr") || path.includes("hot-reload")) {
    return NextResponse.next();
  }

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/api/auth/login", "/api/auth/simple-login", "/api/setup"];
  const isPublicPath = publicPaths.includes(path);

  // Get session token from cookies
  const sessionCookie = request.cookies.get("session");
  const token = sessionCookie?.value;
  const allCookies = request.cookies.getAll();
  
  console.log("🍪 Cookie check - path:", path, "has token:", !!token);
  console.log("🍪 All cookies:", allCookies.map(c => c.name).join(", "));
  if (token) {
    console.log("🍪 Token found:", token.substring(0, 20) + "...");
  }

  // If accessing a protected route without a token, redirect to login
  if (!isPublicPath && !token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If accessing login page with a valid token, redirect to dashboard
  if (isPublicPath && token) {
    const payload = await verifyToken(token);
    if (payload) {
      console.log("Valid token found, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Verify token for protected routes
  if (!isPublicPath && token) {
    const payload = await verifyToken(token);
    if (!payload) {
      console.log("Invalid token, redirecting to login");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - _next/webpack-hmr (HMR requests)
     */
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|public/).*)",
  ],
};