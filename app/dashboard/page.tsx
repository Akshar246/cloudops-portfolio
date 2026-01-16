"use client";

/**
 * DASHBOARD PAGE (UI polish + Logout)
 *
 * - Lists user entries from GET /api/entries
 * - Create new entry
 * - Logout button (POST /api/auth/logout)
 */

import Link from "next/link";
import { useEffect, useState } from "react";

type EntryType = "AWS Lab" | "Project" | "DSA" | "Certificate";
type Visibility = "private" | "public";

type Entry = {
  _id: string;
  type: EntryType;
  title: string;
  description: string;
  tags: string[];
  visibility: Visibility;
  date: string;
};

function typeBadge(type: EntryType) {
  switch (type) {
    case "AWS Lab":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "Project":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "DSA":
      return "bg-violet-100 text-violet-800 border-violet-200";
    case "Certificate":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/entries");
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data?.message || "Failed to load entries");
          setLoading(false);
          return;
        }

        setEntries(data.entries || []);
      } catch {
        setError("Network error. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-600">
        Loading your entries…
      </div>
    );
  }

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your CloudOps learning, projects, and certifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/entries/new"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:translate-y-[1px]"
            >
              + Create New Entry
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-600">No entries yet.</p>
            <Link
              href="/entries/new"
              className="mt-4 inline-block rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Create your first entry
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${typeBadge(
                      entry.type
                    )}`}
                  >
                    {entry.type}
                  </span>

                  <span className="text-xs text-slate-500">
                    {entry.visibility}
                  </span>
                </div>

                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900">
                  {entry.title}
                </h3>

                <p className="mb-4 line-clamp-3 text-sm text-slate-600">
                  {entry.description}
                </p>

                {entry.tags?.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">{entry.date}</span>

                  <Link
                    href={`/entries/${entry._id}`}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    View / Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
