"use client";

/**
 * NEW ENTRY PAGE (Real POST)
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type EntryType = "AWS Lab" | "Project" | "DSA" | "Certificate";
type Visibility = "private" | "public";

export default function NewEntryPage() {
  const router = useRouter();
  const [type, setType] = useState<EntryType>("AWS Lab");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);

    if (!title || !description || !date) {
      setError("Title, description, and date are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          description,
          tags, // API will split commas
          visibility,
          date,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Failed to create entry");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Entry</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create a new lab, project, DSA log, or certificate.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Back
          </Link>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EntryType)}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option>AWS Lab</option>
                <option>Project</option>
                <option>DSA</option>
                <option>Certificate</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="e.g., VPC Subnets + Security Groups Lab"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                rows={5}
                placeholder="What you did, what you learned, and why it matters."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Tags (comma separated)
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="aws, vpc, networking"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                >
                  <option value="private">private</option>
                  <option value="public">public</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <Link
                href="/dashboard"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-sm text-gray-700 hover:bg-gray-100 sm:w-auto"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
