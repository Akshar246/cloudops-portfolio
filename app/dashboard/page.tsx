"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type EntryType = "AWS Lab" | "Project" | "DSA" | "Certificate";

type Entry = {
  id: string;
  type: EntryType;
  title: string;
  description: string;
  tags: string[];
  date: string;
  visibility: "private" | "public";
};

const seed: Entry[] = [
  {
    id: "1",
    type: "AWS Lab",
    title: "AWS SimuLearn: S3 Reliability Lab",
    description: "Designed a cloud-native approach for a reliability scenario; documented decisions + tradeoffs.",
    tags: ["s3", "reliability", "cloud"],
    date: "2026-01-13",
    visibility: "private",
  },
  {
    id: "2",
    type: "DSA",
    title: "Insertion Sort in Java + Interview Notes",
    description: "Implementation + edge cases + time/space complexity + when to use it.",
    tags: ["java", "sorting", "interview"],
    date: "2026-01-12",
    visibility: "private",
  },
  {
    id: "3",
    type: "Project",
    title: "GlobeTalk: Real-Time Language Translation Web App",
    description: "Built translation pipeline with APIs, auth, and scalable architecture.",
    tags: ["mern", "api", "realtime"],
    date: "2025-12-31",
    visibility: "public",
  },
];

function Badge({ children }: { children: string }) {
  return <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{children}</span>;
}

export default function Dashboard() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<EntryType | "All">("All");

  const entries = useMemo(() => {
    return seed
      .filter((e) => (filter === "All" ? true : e.type === filter))
      .filter((e) => (q.trim() ? (e.title + " " + e.description + " " + e.tags.join(" ")).toLowerCase().includes(q.toLowerCase()) : true))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [q, filter]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Dashboard</div>
            <div className="text-sm text-gray-600">Private progress log (demo UI)</div>
          </div>
          <div className="flex gap-2">
            <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" href="/public/akshar">
              View Public Page
            </Link>
            <Link className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90" href="/entries/new">
              + Add Entry
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-3xl border p-4 shadow-sm md:grid-cols-3 md:items-center">
          <input
            className="rounded-2xl border px-4 py-3 text-sm md:col-span-2"
            placeholder="Search title, tags, description…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="rounded-2xl border px-4 py-3 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            {["All", "AWS Lab", "Project", "DSA", "Certificate"].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {entries.map((e) => (
            <div key={e.id} className="rounded-3xl border p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{e.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{e.description}</div>
                </div>
                <div className="grid gap-2 text-right">
                  <Badge>{e.type}</Badge>
                  <span className="text-xs text-gray-500">{e.visibility.toUpperCase()}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 text-xs text-gray-700">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">Date: {e.date}</div>
                <div className="flex gap-2">
                  <Link className="rounded-xl border px-3 py-2 text-xs hover:bg-gray-50" href={`/entries/${e.id}`}>
                    View / Edit
                  </Link>
                  <button className="rounded-xl border px-3 py-2 text-xs hover:bg-gray-50">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="mt-10 rounded-3xl border p-10 text-center text-sm text-gray-600">
            No entries found. Try clearing filters or add a new entry.
          </div>
        )}
      </div>
    </main>
  );
}
