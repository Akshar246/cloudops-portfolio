import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/auth/handle
 * Returns the public handle (email prefix) for the logged-in owner.
 * Example: email = sak246203@gmail.com -> handle = sak246203
 */
export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    await connectDB();

    const user = await User.findById(payload.userId).select("email");
    if (!user?.email) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const handle = user.email.split("@")[0];

    return NextResponse.json({ handle }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
