/**
 * PUBLIC PROFILE API
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Entry from "@/models/Entry";

type Ctx = {
  params: Promise<{
    username: string;
  }>;
};

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { username } = await ctx.params;

    await connectDB();

    /**
     * Find user by matching email prefix
     * Example:
     *   username = "sak2"
     *   matches: sak2@gmail.com
     */
    const emailRegex = new RegExp(`^${username}@`, "i");

    const user = await User.findOne({ email: emailRegex }).lean();

    if (!user) {
      return NextResponse.json(
        { message: "Public profile not found" },
        { status: 404 }
      );
    }

    /**
     * Fetch ONLY public entries for this user
     */
    const entries = await Entry.find({
      ownerId: user._id,
      visibility: "public",
    })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        user: {
          publicId: username,
        },
        entries,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load public profile" },
      { status: 500 }
    );
  }
}
