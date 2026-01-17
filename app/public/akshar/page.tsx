"use client";

/**
 * PUBLIC PROFILE PAGE (Real data)
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type PublicEntry = {
  _id: string;
  type: "AWS Lab" | "Project" | "DSA" | "Certificate";
  title: string;
  description: string;
  tags: string[];
  visibility: "private" | "public";
  date: string;
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(`/api/public/${username}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data?.message || "Failed to load profile");
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

    if (username) load();
  }, [username]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {username} — Public Profile
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Showing only <span className="font-medium">public</span> entries.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            CloudOps Portfolio Hub
          </h2>
          <p className="mt-2 text-gray-700">
            This page is auto-generated from my dashboard. It highlights real
            work and proof-driven progress.
          </p>
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-gray-700 shadow-sm">
              Loading public entries…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-gray-700 shadow-sm">
              No public entries yet. Make an entry{" "}
              <span className="font-medium">public</span> from the Edit Entry
              page.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {entries.map((e) => (
                <div
                  key={e._id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {e.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{e.date}</p>
                    </div>
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                      {e.type}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                    {e.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(e.tags || []).slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-sm text-gray-600">
          Next upgrade: custom usernames + S3 proof links.
        </div>
      </div>
    </main>
  );
}
