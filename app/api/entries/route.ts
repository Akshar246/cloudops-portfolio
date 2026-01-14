/**
 * ENTRIES API (Private)
 *
 * What this file does:
 * - GET: returns entries owned by the logged-in user
 * - POST: creates a new entry for the logged-in user
 *
 * Security:
 * - Uses JWT from httpOnly cookie
 * - Ensures user can only access their own entries
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Entry from "@/models/Entry";
import { getAuthUserId } from "@/lib/getAuthUser";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    await connectDB();
    const entries = await Entry.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error: any) {
    const msg = error?.message || "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await req.json();

    const { type, title, description, tags, visibility, date } = body;

    if (!type || !title || !description || !date) {
      return NextResponse.json(
        { message: "type, title, description, and date are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const entry = await Entry.create({
      ownerId: userId,
      type,
      title,
      description,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      visibility: visibility === "public" ? "public" : "private",
      date,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: any) {
    const msg = error?.message || "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
