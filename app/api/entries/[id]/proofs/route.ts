import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Entry from "@/models/Entry";
import { getAuthUserId } from "@/lib/getAuthUser";
import mongoose from "mongoose";

/**
 * ENTRY PROOFS API (Owner-only)
 *
 * What this file does:
 * - POST: Attach an uploaded proof (S3 key + metadata) to an entry (owner-only)
 *
 * Why this matters:
 * - Keeps S3 upload separate from DB write
 * - Ensures only the entry owner can attach proofs
 * - Stores metadata so UI can show file name/size/type
 */

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid entry id" }, { status: 400 });
    }

    const body = await req.json();
    const { key, contentType, size, originalName } = body || {};

    if (!key || !originalName || !contentType) {
      return NextResponse.json(
        { message: "key, originalName, and contentType are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const entry = await Entry.findOne({ _id: id, ownerId: userId });
    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    entry.proofs = Array.isArray(entry.proofs) ? entry.proofs : [];
    entry.proofs.push({
      key,
      originalName,
      contentType,
      size: Number(size) || 0,
      uploadedAt: new Date(),
    });

    await entry.save();

    return NextResponse.json(
      { message: "Proof attached successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    const msg = error?.message || "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
