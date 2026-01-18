/**
 * AUTH MIDDLEWARE
 *
 * What this file does:
 * - Runs before requests to protected routes
 * - Checks for JWT cookie named "token"
 * - If missing → redirects to /login
 *
 * Why this matters:
 * - Protects private pages (dashboard + entries)
 * - Keeps public pages accessible
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If not logged in, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run middleware on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/entries/:path*"],
};
