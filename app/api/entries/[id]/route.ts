/**
 * ENTRY DETAILS API (Owner-only)
 *
 * What this file does:
 * - GET: fetch one entry by id (only if owned by logged-in user)
 * - PUT: update one entry by id (only if owned by logged-in user)
 * - DELETE: delete one entry by id (only if owned by logged-in user)
 *
 * Why this matters:
 * - Enables real Edit/Delete in your UI
 * - Prevents users from editing others' data
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Entry from "@/models/Entry";
import { getAuthUserId } from "@/lib/getAuthUser";
import mongoose from "mongoose";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const userId = await getAuthUserId();
    const { id } = await ctx.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid entry id" }, { status: 400 });
    }

    await connectDB();

    const entry = await Entry.findOne({ _id: id, ownerId: userId }).lean();

    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry }, { status: 200 });
  } catch (error: any) {
    const msg = error?.message || "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const userId = await getAuthUserId();
    const { id } = await ctx.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid entry id" }, { status: 400 });
    }

    const body = await req.json();
    const { type, title, description, tags, visibility, date } = body;

    if (!type || !title || !description || !date) {
      return NextResponse.json(
        { message: "type, title, description, and date are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Entry.findOneAndUpdate(
      { _id: id, ownerId: userId },
      {
        type,
        title,
        description,
        tags: Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
        visibility: visibility === "public" ? "public" : "private",
        date,
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry: updated }, { status: 200 });
  } catch (error: any) {
    const msg = error?.message || "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const userId = await getAuthUserId();
    const { id } = await ctx.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid entry id" }, { status: 400 });
    }

    await connectDB();

    const deleted = await Entry.findOneAndDelete({ _id: id, ownerId: userId });

    if (!deleted) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Entry deleted" }, { status: 200 });
  } catch (error: any) {
    const msg = error?.message || "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
