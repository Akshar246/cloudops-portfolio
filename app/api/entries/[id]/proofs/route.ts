import { NextResponse } from "next/server";
import Entry from "@/models/Entry";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const entryId = context.params.id;
    const body = await req.json();

    const { key, contentType, size, originalName } = body as {
      key: string;
      contentType: string;
      size: number;
      originalName: string;
    };

    if (!key || !contentType || !size || !originalName) {
      return NextResponse.json(
        { message: "Missing proof fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const entry = await Entry.findOne({
      _id: entryId,
      ownerId: user._id,
    });

    if (!entry) {
      return NextResponse.json(
        { message: "Entry not found or forbidden" },
        { status: 404 }
      );
    }

    entry.proofs.push({
      key,
      contentType,
      size,
      originalName,
      uploadedAt: new Date(),
    });

    await entry.save();

    return NextResponse.json(
      { message: "Proof attached successfully", entry },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attach proof error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
