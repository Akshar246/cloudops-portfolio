import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Entry from "@/models/Entry";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type Ctx = { params: Promise<{ username: string; id: string }> };

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { username, id } = await ctx.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid entry id" },
        { status: 400 }
      );
    }

    await connectDB();

    // Email-prefix model: /public/sak246203 => user email starts with "sak246203@"
    const emailRegex = new RegExp(`^${username}@`, "i");
    const user = await User.findOne({ email: emailRegex }).lean();

    if (!user) {
      return NextResponse.json(
        { message: "Public profile not found" },
        { status: 404 }
      );
    }

    const entry = await Entry.findOne({
      _id: id,
      ownerId: user._id,
      visibility: "public",
    }).lean();

    if (!entry) {
      return NextResponse.json(
        { message: "Public entry not found" },
        { status: 404 }
      );
    }

    const bucket = process.env.S3_BUCKET_NAME!;
    const proofs = Array.isArray((entry as any).proofs)
      ? (entry as any).proofs
      : [];

    // Presign each proof (10 minutes)
    const proofUrls = await Promise.all(
      proofs.map(async (p: any) => {
        const key = p?.key;
        if (!key) return null;

        const cmd = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });

        const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 10 });

        return {
          key,
          url,
          originalName: p?.originalName || key.split("/").pop() || "proof",
          contentType: p?.contentType || "application/octet-stream",
          size: p?.size || 0,
          uploadedAt: p?.uploadedAt || null,
        };
      })
    );

    return NextResponse.json(
      { entry, proofUrls: proofUrls.filter(Boolean) },
      { status: 200 }
    );
  } catch (err: any) {
    const msg = err?.message || "Failed to load public entry";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
