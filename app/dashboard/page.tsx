"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

function statCard(label: string, value: number) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived from /api/auth/me
  const [publicHandle, setPublicHandle] = useState<string | null>(null);

  // UI controls
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | Visibility>(
    "all"
  );
  const [q, setQ] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // 1) Load entries
        const entriesRes = await fetch("/api/entries", { cache: "no-store" });
        const entriesData = await entriesRes.json().catch(() => ({}));

        if (!entriesRes.ok) {
          setError(entriesData?.message || "Failed to load entries");
          setLoading(false);
          return;
        }

        setEntries(entriesData.entries || []);

        // 2) Load user (for public handle)
        const meRes = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (meRes.ok) {
          const meData = await meRes.json().catch(() => ({}));
          const email: string | undefined = meData?.user?.email;
          if (email) setPublicHandle(email.split("@")[0]);
        }
      } catch {
        setError("Network error. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const stats = useMemo(() => {
    const total = entries.length;
    const pub = entries.filter((e) => e.visibility === "public").length;
    const pri = entries.filter((e) => e.visibility === "private").length;
    const aws = entries.filter((e) => e.type === "AWS Lab").length;
    const proj = entries.filter((e) => e.type === "Project").length;
    const dsa = entries.filter((e) => e.type === "DSA").length;
    const cert = entries.filter((e) => e.type === "Certificate").length;

    return { total, pub, pri, aws, proj, dsa, cert };
  }, [entries]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return entries.filter((e) => {
      const vOk =
        visibilityFilter === "all" ? true : e.visibility === visibilityFilter;

      if (!qq) return vOk;

      const text = `${e.title} ${e.description} ${(e.tags || []).join(
        " "
      )}`.toLowerCase();
      return vOk && text.includes(qq);
    });
  }, [entries, visibilityFilter, q]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-600">
        Loading dashboard…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Portfolio Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Create entries, attach proofs, and publish selected work to your
              public profile.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/entries/new"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              + New Entry
            </Link>

            {publicHandle && (
              <Link
                href={`/public/${publicHandle}`}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                Public Profile
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCard("Total entries", stats.total)}
          {statCard("Public entries", stats.pub)}
          {statCard("Private entries", stats.pri)}
          {statCard(
            "AWS / Projects / DSA / Certs",
            stats.aws + stats.proj + stats.dsa + stats.cert
          )}
        </div>

        {/* Public Profile Box */}
        {publicHandle && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Shareable public profile
                </div>
                <div className="mt-1 break-all text-sm text-slate-600">
                  {`${window.location.origin}/public/${publicHandle}`}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Recruiters should use this link. Only entries marked{" "}
                  <span className="font-medium">public</span> will appear.
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/public/${publicHandle}`
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Copy link
                </button>
                <Link
                  href={`/public/${publicHandle}`}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                >
                  Open
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["all", "public", "private"] as const).map((v) => {
                const active = visibilityFilter === v;
                return (
                  <button
                    key={v}
                    onClick={() => setVisibilityFilter(v)}
                    className={
                      "rounded-full border px-4 py-2 text-sm " +
                      (active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
                    }
                  >
                    {v === "all"
                      ? "All"
                      : v === "public"
                      ? "Public"
                      : "Private"}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search entries…"
                className="w-full md:w-80 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                onClick={() => setQ("")}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Showing <span className="font-medium">{filtered.length}</span>{" "}
            result(s).
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Entries */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-900 font-medium">No entries found.</p>
            <p className="mt-2 text-sm text-slate-600">
              Create your first entry, then mark it{" "}
              <span className="font-medium">public</span> to show it on your
              public profile.
            </p>
            <div className="mt-5">
              <Link
                href="/entries/new"
                className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                + Create Entry
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <div
                key={e._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${typeBadge(
                      e.type
                    )}`}
                  >
                    {e.type}
                  </span>

                  <span
                    className={
                      "rounded-full border px-3 py-1 text-xs " +
                      (e.visibility === "public"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-amber-200 bg-amber-50 text-amber-700")
                    }
                  >
                    {e.visibility}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {e.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {e.description}
                </p>

                <div className="mt-4 flex justify-between text-xs text-slate-500">
                  <span>{String(e.date).slice(0, 10)}</span>
                  <Link
                    href={`/entries/${e._id}`}
                    className="text-slate-700 hover:underline"
                  >
                    Open →
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
