import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id.toString());

    const response = NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

    // Store token securely in httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}













/**
 * REGISTER API
 *
 * What this file does:
 * - Accepts email + password from client
 * - Validates required fields
 * - Connects to MongoDB
 * - Prevents duplicate user registration
 * - Hashes password securely (bcrypt)
 * - Creates a new user document
 * - Generates a JWT for authentication
 * - Stores JWT in a secure httpOnly cookie
 *
 * Why this matters:
 * - Ensures secure user onboarding
 * - Passwords are never stored in plain text
 * - httpOnly cookies protect against XSS attacks
 * - Forms the foundation for authenticated APIs
 */
