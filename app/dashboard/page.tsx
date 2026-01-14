"use client";

/**
 * DASHBOARD (Real Entries)
 *
 * What this file does:
 * - Confirms logged-in user via /api/auth/me
 * - Loads user's entries via GET /api/entries
 * - Shows list of entries
 * - Logout clears cookie
 *
 * Why this matters:
 * - This is the first true full-stack screen (UI + API + DB)
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = { id: string; email: string };

type Entry = {
  _id: string;
  type: "AWS Lab" | "Project" | "DSA" | "Certificate";
  title: string;
  description: string;
  tags: string[];
  visibility: "private" | "public";
  date: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const publicCount = useMemo(
    () => entries.filter((e) => e.visibility === "public").length,
    [entries]
  );

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        // 1) Auth check
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        // 2) Load entries
        const eRes = await fetch("/api/entries");
        const eData = await eRes.json().catch(() => ({}));
        if (!eRes.ok) {
          setError(eData?.message || "Failed to load entries");
          setLoading(false);
          return;
        }

        setEntries(eData.entries || []);
      } catch {
        setError("Network error. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Logged in as <span className="font-medium">{user?.email}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/entries/new"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              + Add Entry
            </Link>
            <Link
              href={`/public/${user?.email?.split("@")[0] || "me"}`}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Public View ({publicCount})
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Entries */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {entries.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-gray-700 shadow-sm">
              No entries yet. Click <span className="font-medium">+ Add Entry</span> to
              create your first one.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry._id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {entry.title}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">{entry.date}</p>
                  </div>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                    {entry.type}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                  {entry.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(entry.tags || []).slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Visibility: {entry.visibility}
                  </span>
                  <Link
                    href={`/entries/${entry._id}`}
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    View / Edit →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
