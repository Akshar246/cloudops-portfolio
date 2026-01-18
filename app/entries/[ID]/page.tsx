"use client";

/**
 * ENTRY DETAILS PAGE (Real Edit/Delete)
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ProofUpload from "@/components/proofUpload";

type EntryType = "AWS Lab" | "Project" | "DSA" | "Certificate";
type Visibility = "private" | "public";

type Proof = {
  key?: string;
  url?: string;
  name?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
};

type Entry = {
  _id: string;
  type: EntryType;
  title: string;
  description: string;
  tags: string[];
  visibility: Visibility;
  date: string;
  proofs?: Proof[];
};

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "dark" | "green" | "amber";
}) {
  const cls =
    tone === "dark"
      ? "border-gray-900 bg-gray-900 text-white"
      : tone === "green"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${cls}`}
    >
      {children}
    </span>
  );
}

function emailPrefix(email: string) {
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : "";
}

export default function EntryDetailsPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ FIX: support both [id] and [ID] folder names (and string[])
  const id = useMemo(() => {
    const p: any = params || {};
    const raw = p.id ?? p.ID; // <-- key fix

    if (Array.isArray(raw)) return raw[0];
    return raw as string | undefined;
  }, [params]);

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

  // fetch your own email to generate your public profile link
  const [meEmail, setMeEmail] = useState<string>("");

  const publicLabel = useMemo(
    () => (visibility === "public" ? "Public" : "Private"),
    [visibility]
  );

  const publicProfileLink = useMemo(() => {
    const prefix = emailPrefix(meEmail);
    if (!prefix) return "";
    return `/public/${prefix}`;
  }, [meEmail]);

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.user?.email) setMeEmail(String(data.user.email));
      } catch {
        // ignore
      }
    }
    loadMe();
  }, []);

  useEffect(() => {
    async function loadEntry() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!id) {
        setError("Missing entry id in URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/entries/${id}`, { cache: "no-store" });
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
        setDate((e.date || "").slice(0, 10));
      } catch {
        setError("Network error. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    loadEntry();
  }, [id]);

  async function handleSave() {
    setError(null);
    setSuccess(null);

    if (!id) return setError("Missing entry id.");

    if (!title.trim() || !description.trim() || !date.trim()) {
      return setError("Title, description, and date are required.");
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title: title.trim(),
          description: description.trim(),
          tags, // API will split commas
          visibility,
          date,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Failed to save changes");
        return;
      }

      setEntry(data.entry);
      setSuccess("Saved ✅");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setError(null);
    setSuccess(null);

    if (!id) return setError("Missing entry id.");

    const ok = window.confirm("Delete this entry permanently?");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Failed to delete entry");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleCopyPublicLink() {
    if (!publicProfileLink) return;
    try {
      const full = `${window.location.origin}${publicProfileLink}`;
      await navigator.clipboard.writeText(full);
      setSuccess("Public profile link copied ✅");
    } catch {
      setError("Could not copy. You can manually copy from the button URL.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Loading entry…
      </div>
    );
  }

  if (!entry && error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const proofs: Proof[] = (entry?.proofs || []) as Proof[];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs text-gray-500">Entry</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {title || "Untitled"}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="neutral">{type}</Badge>
              <Badge tone={visibility === "public" ? "green" : "amber"}>
                {publicLabel}
              </Badge>
              <Badge tone="neutral">{date || "—"}</Badge>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Edit your learning log and attach proofs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Back
            </Link>

            {visibility === "public" && publicProfileLink ? (
              <>
                <Link
                  href={publicProfileLink}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Open Public Profile
                </Link>
                <button
                  onClick={handleCopyPublicLink}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Copy Public Link
                </button>
              </>
            ) : null}

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Layout */}
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {/* Form */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Type
                  </label>
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
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="e.g., AWS SimuLearn: S3 Reliability Lab"
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
                    rows={7}
                    placeholder="What you did, what broke, what you fixed, what you learned..."
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
                    placeholder="s3, iam, vpc, leetcode"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Visibility
                    </label>
                    <select
                      value={visibility}
                      onChange={(e) =>
                        setVisibility(e.target.value as Visibility)
                      }
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      <option value="private">private</option>
                      <option value="public">public</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500">
                      Public entries appear on your public profile page.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Proofs */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Proofs</h2>
                <p className="mt-1 text-xs text-gray-600">
                  Upload screenshots or PDFs as proof. Files go to S3 and link to
                  this entry.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <ProofUpload entryId={String(id)} />
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-700">
                  Attached proofs
                </h3>

                {proofs.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-600">
                    No proofs attached yet.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {proofs.map((p, idx) => {
                      const label =
                        p.name || p.filename || p.key || `proof-${idx + 1}`;
                      return (
                        <div
                          key={`${label}-${idx}`}
                          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {label}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {p.mimeType || "file"}
                              {typeof p.size === "number"
                                ? ` · ${p.size} bytes`
                                : ""}
                            </p>
                          </div>

                          {p.url ? (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            >
                              Open
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">No URL</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Meta</h2>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Entry ID</span>
                  <span className="font-mono text-xs text-gray-900">
                    {String(id)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Visibility</span>
                  <span className="font-medium text-gray-900">
                    {visibility}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">{type}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Tips</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                <li>Write what you built + why you chose that approach.</li>
                <li>Attach proofs (S3) to make it recruiter-trustworthy.</li>
                <li>
                  If this entry is public, use{" "}
                  <span className="font-medium">Copy Public Link</span>.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
