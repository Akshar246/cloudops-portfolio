/**
 * AUTH USER HELPER
 
 * - Reads JWT token from httpOnly cookie
 * - Verifies token
 * - Returns authenticated userId
 */

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const payload = verifyToken(token);
  return payload.userId;
}
