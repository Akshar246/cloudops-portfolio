/**
 * LOGOUT API
 *
 * What this file does:
 * - Clears the auth cookie (token)
 *
 * Why this matters:
 * - Ends user session safely
 * - Works instantly (no DB call needed)
 */

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

  // Clear cookie by setting it expired
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
