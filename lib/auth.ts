import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env.local");
}

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password with hashed password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Create JWT token for a user
 */
export function createToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

/**
 * Get logged-in user from httpOnly JWT cookie
 * Used by protected API routes (like S3 uploads)
 */
export async function getUserFromToken() {
  const cookieStore = await cookies(); // ✅ important
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token); // { userId }

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    return user;
  } catch (error) {
    return null;
  }
}

