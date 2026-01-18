import Link from "next/link";
import { headers } from "next/headers";

type EntryType = "AWS Lab" | "Project" | "DSA" | "Certificate";

type ProofUrl = {
  key: string;
  url: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadedAt: string | null;
};

type PublicEntry = {
  _id: string;
  type: EntryType;
  title: string;
  description: string;
  tags: string[];
  visibility: "public" | "private";
  date: string;
};

export default async function PublicEntryDetailsPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username, id } = await params;

  // ✅ Build absolute base URL for Server Component fetch()
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/api/public/${username}/entries/${id}`, {
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  const entry: PublicEntry | null = data?.entry || null;
  const proofUrls: ProofUrl[] = Array.isArray(data?.proofUrls)
    ? data.proofUrls
    : [];

  if (!res.ok || !entry) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {data?.message || "Public entry not found"}
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href={`/public/${username}`}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Back to Public Profile
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tags = Array.isArray(entry.tags) ? entry.tags : [];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs text-gray-500">Public Entry</p>
            <h1 className="text-2xl font-bold text-gray-900">{entry.title}</h1>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-800">
                {entry.type}
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-700">
                {(entry.date || "").slice(0, 10)}
              </span>
              <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-800">
                Public
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/public/${username}`}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Back
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Summary</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                {entry.description}
              </p>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Proofs</h2>
              <p className="mt-1 text-xs text-gray-600">
                Proof links are time-limited (presigned) for secure viewing.
              </p>

              {proofUrls.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                  No proofs attached.
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {proofUrls.map((p) => (
                    <div
                      key={p.key}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {p.originalName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {p.contentType} · {p.size} bytes
                        </p>
                      </div>

                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
                      >
                        Open
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Tags</h2>

              {tags.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600">No tags.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
              <p className="mt-2 text-sm text-gray-700">
                View more entries from{" "}
                <span className="font-medium">{username}</span>.
              </p>
              <Link
                href={`/public/${username}`}
                className="mt-4 inline-block rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Back to profile
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
