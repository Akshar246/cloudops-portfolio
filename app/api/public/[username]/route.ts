/**
 * PUBLIC PROFILE API
 *
 * What this file does:
 * - Fetches PUBLIC entries for a given username
 * - Does NOT require authentication
 * - Returns safe, read-only data
 *
 * Why this matters:
 * - Powers shareable portfolio links
 * - Ensures private entries stay private
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Entry from "@/models/Entry";

type Ctx = { params: Promise<{ username: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { username } = await ctx.params;

    await connectDB();

    // Username strategy: email prefix before "@"
    const emailRegex = new RegExp(`^${username}@`, "i");
    const user = await User.findOne({ email: emailRegex }).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const entries = await Entry.find({
      ownerId: user._id,
      visibility: "public",
    })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        user: { username },
        entries,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to load public profile" },
      { status: 500 }
    );
  }
}
