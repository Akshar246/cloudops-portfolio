"use client";

/**
 * ENTRY DETAILS PAGE (Real Edit/Delete)
 *
 * What this file does:
 * - Fetches entry by id from GET /api/entries/:id
 * - Lets user edit fields and save via PUT /api/entries/:id
 * - Lets user delete entry via DELETE /api/entries/:id
 *
 * Why this matters:
 * - Completes Update + Delete parts of CRUD
 * - Owner-only security enforced in API
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ProofUpload from "@/components/proofUpload";


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

export default function EntryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [entry, setEntry] = useState<Entry | null>(null);

  const [type, setType] = useState<EntryType>("AWS Lab");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      setSuccess(null);

      try {
        const res = await fetch(`/api/entries/${id}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data?.message || "Failed to load entry");
          setLoading(false);
          return;
        }

        const e: Entry = data.entry;
        setEntry(e);

        setType(e.type);
        setTitle(e.title);
        setDescription(e.description);
        setTags((e.tags || []).join(", "));
        setVisibility(e.visibility);
        setDate(e.date);
      } catch {
        setError("Network error. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  async function handleSave() {
    setError(null);
    setSuccess(null);

    if (!title || !description || !date) {
      setError("Title, description, and date are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "PUT",
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
        setError(data?.message || "Failed to save changes");
        setSaving(false);
        return;
      }

      setEntry(data.entry);
      setSuccess("Saved ✅");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setError(null);
    setSuccess(null);

    const ok = window.confirm("Delete this entry permanently?");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Failed to delete entry");
        setDeleting(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Loading entry…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Entry</h1>
            <p className="mt-1 text-sm text-gray-600">
              ID: <span className="font-medium text-gray-900">{id}</span>
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Back
          </Link>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

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
                rows={6}
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
                <label className="text-sm font-medium text-gray-700">Date</label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            {/* Proof Upload */}
<div className="pt-2">
  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
    <p className="mb-2 text-sm font-medium text-gray-900">Proof Upload</p>
    <p className="mb-3 text-xs text-gray-600">
      Upload screenshots or PDFs as proof. Files go to private S3 and link to this entry.
    </p>
    <ProofUpload entryId={id} />
  </div>
</div>


            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Entry"}
              </button>
            </div>

            {/* Small hint */}
            {entry && (
              <div className="text-xs text-gray-500">
                Created entry loaded from DB. Owner-only update/delete enforced in API.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
