"use client";

/**
 * ENTRY ACTIONS (Client)
 */

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function EntryActions({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleDelete() {
    const ok = confirm("Delete this entry? This cannot be undone.");
    if (!ok) return;

    setErr(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/entries/${entryId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.message || "Failed to delete");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErr("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href={`/entries/${entryId}/edit`}
        className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Edit
      </Link>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>

      {err ? (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {err}
        </div>
      ) : null}
    </div>
  );
}
