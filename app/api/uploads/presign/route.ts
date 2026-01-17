import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "@/lib/s3";
import { getUserFromToken } from "@/lib/auth";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25MB

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  try {
    // Uses your Week-2 auth helper that reads the httpOnly "token" cookie
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fileName, fileType, size, entryId } = body as {
      fileName: string;
      fileType: string;
      size: number;
      entryId: string;
    };

    if (!fileName || !fileType || !size || !entryId) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const isImage = fileType.startsWith("image/");
    const isPdf = fileType === "application/pdf";

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { message: "Only images and PDFs allowed" },
        { status: 400 }
      );
    }

    if (isImage && size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { message: "Image too large (max 10MB)" },
        { status: 400 }
      );
    }
    if (isPdf && size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { message: "PDF too large (max 25MB)" },
        { status: 400 }
      );
    }

    const safeName = sanitizeFileName(fileName);

    // proofs/<userId>/<entryId>/timestamp-filename
    const key = `proofs/${user._id.toString()}/${entryId}/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    // Short expiry = safer
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ uploadUrl, key }, { status: 200 });
  } catch (error: any) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
