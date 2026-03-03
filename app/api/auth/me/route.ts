import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const payload = verifyToken(token); // { userId }
    await connectDB();

    const user = await User.findById(payload.userId).select("_id email");
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const handle = String(user.email).split("@")[0] || "";
    return NextResponse.json(
      { user: { _id: user._id, email: user.email, handle } },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }
}
