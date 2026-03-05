/**
 * ENTRIES API (Private)
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Entry from "@/models/Entry";
import { getAuthUserId } from "@/lib/getAuthUser";

function isValidISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
      .map((t) => String(t).trim())
      .filter(Boolean)
      .slice(0, 25);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 25);
  }
  return [];
}

function normalizeWhatILearned(value: unknown): string {
  return String(value ?? "").trim().slice(0, 2000);
}

function normalizeCaseStudyField(value: unknown): string {
  return String(value ?? "").trim().slice(0, 2500);
}

function normalizeSecurityDecisions(value: unknown): string {
  return String(value ?? "").trim().slice(0, 2000);
}

export async function GET() {
  try {
    const userId = await getAuthUserId();

    await connectDB();
    const entries = await Entry.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await req.json().catch(() => ({}));
    const type = String(body?.type || "").trim();
    const title = String(body?.title || "").trim();
    const description = String(body?.description || "").trim();
    const problem = normalizeCaseStudyField(body?.problem);
    const approach = normalizeCaseStudyField(body?.approach);
    const outcome = normalizeCaseStudyField(body?.outcome);
    const securityDecisions = normalizeSecurityDecisions(body?.securityDecisions);
    const whatILearned = normalizeWhatILearned(body?.whatILearned);
    const date = String(body?.date || "").trim();
    const visibility = body?.visibility === "public" ? "public" : "private";
    const tags = normalizeTags(body?.tags);

    if (!type || !title || !description || !date) {
      return NextResponse.json(
        { message: "type, title, description, and date are required" },
        { status: 400 }
      );
    }
    if (!isValidISODate(date)) {
      return NextResponse.json(
        { message: "date must be in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    await connectDB();

    const entry = await Entry.create({
      ownerId: userId,
      type,
      title,
      description,
      problem,
      approach,
      outcome,
      securityDecisions,
      whatILearned,
      tags,
      visibility,
      date,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Not authenticated";
    const status = msg === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
