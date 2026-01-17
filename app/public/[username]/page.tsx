import Link from "next/link";

/**
 * PUBLIC PROFILE PAGE (Polished)
 */

type EntryType = "AWS Lab" | "Project" | "DSA" | "Certificate";

type PublicEntry = {
  _id: string;
  type: EntryType;
  title: string;
  description: string;
  tags: string[];
  visibility: "private" | "public";
  date: string;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
      {children}
    </span>
  );
}

function TabButton({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full border px-4 py-2 text-sm " +
        (active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100")
      }
    >
      {children}
    </Link>
  );
}

function TypeBadge({ type }: { type: EntryType }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-800 shadow-sm">
      {type}
    </span>
  );
}

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ q?: string; type?: string }>;
}) {
  const { username } = await params;
  const sp = (await searchParams) || {};
  const q = (sp.q || "").trim();
  const typeParam = (sp.type || "all").toLowerCase();

  // Call your internal API from server side
  const res = await fetch(`http://localhost:3000/api/public/${username}`, {
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  const entries: PublicEntry[] = data.entries || [];
  const errorMessage = !res.ok
    ? data?.message || "Failed to load profile"
    : null;

  // Stats
  const counts = {
    total: entries.length,
    aws: entries.filter((e) => e.type === "AWS Lab").length,
    dsa: entries.filter((e) => e.type === "DSA").length,
    project: entries.filter((e) => e.type === "Project").length,
    cert: entries.filter((e) => e.type === "Certificate").length,
  };

  // Filtering
  const filtered = entries.filter((e) => {
    const matchesType =
      typeParam === "all" ? true : e.type.toLowerCase() === typeParam;

    const text = `${e.title} ${e.description} ${(e.tags || []).join(
      " "
    )}`.toLowerCase();
    const matchesQuery = q ? text.includes(q.toLowerCase()) : true;

    return matchesType && matchesQuery;
  });

  function makeHref(nextType: string, nextQ: string) {
    const qs = new URLSearchParams();
    if (nextQ) qs.set("q", nextQ);
    if (nextType && nextType !== "all") qs.set("type", nextType);
    const s = qs.toString();
    return s ? `/public/${username}?${s}` : `/public/${username}`;
  }

  const isActive = (t: string) =>
    typeParam === "all" ? t === "all" : t === typeParam;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs text-gray-500">Public Profile</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {username} — Public Portfolio
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
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                CloudOps Portfolio Hub
              </h2>
              <p className="mt-2 text-gray-700">
                Auto-generated from my dashboard. This page highlights real work
                and proof-driven progress across AWS, projects, DSA, and
                certifications.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill>{counts.total} entries</Pill>
                <Pill>{counts.aws} AWS</Pill>
                <Pill>{counts.project} Projects</Pill>
                <Pill>{counts.dsa} DSA</Pill>
                <Pill>{counts.cert} Certificates</Pill>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-medium text-gray-900">Shareable link</p>
              <p className="mt-1 font-mono text-xs text-gray-700">
                /public/{username}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Put this on LinkedIn/CV so recruiters land here directly.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {/* Controls */}
        {!errorMessage ? (
          <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                <TabButton href={makeHref("all", q)} active={isActive("all")}>
                  All ({counts.total})
                </TabButton>
                <TabButton
                  href={makeHref("aws lab", q)}
                  active={isActive("aws lab")}
                >
                  AWS ({counts.aws})
                </TabButton>
                <TabButton
                  href={makeHref("project", q)}
                  active={isActive("project")}
                >
                  Projects ({counts.project})
                </TabButton>
                <TabButton href={makeHref("dsa", q)} active={isActive("dsa")}>
                  DSA ({counts.dsa})
                </TabButton>
                <TabButton
                  href={makeHref("certificate", q)}
                  active={isActive("certificate")}
                >
                  Certificates ({counts.cert})
                </TabButton>
              </div>

              {/* Search */}
              <form
                action={makeHref(typeParam, "")}
                className="w-full md:w-auto"
              >
                <div className="flex gap-2">
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search (title, tags, keywords)…"
                    className="w-full md:w-80 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
                  >
                    Search
                  </button>
                </div>

                {typeParam !== "all" ? (
                  <input type="hidden" name="type" value={typeParam} />
                ) : null}
              </form>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Showing <span className="font-medium">{filtered.length}</span>{" "}
              result(s).
            </p>
          </div>
        ) : null}

        {/* Content */}
        <div className="mt-6">
          {errorMessage ? null : filtered.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-gray-700 shadow-sm">
              No public entries found.
              <p className="mt-2 text-xs text-gray-500">
                If you’re the owner: mark entries as{" "}
                <span className="font-medium">public</span> in the dashboard.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((e) => (
                <Link
                  key={e._id}
                  href={`/public/${username}/entries/${e._id}`}
                  className="group block rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-gray-900">
                        {e.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {(e.date || "").slice(0, 10)}
                      </p>
                    </div>
                    <TypeBadge type={e.type} />
                  </div>

                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                    {e.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(e.tags || []).slice(0, 8).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Click to view full details
                    </span>
                    <span className="text-sm font-medium text-gray-900 group-hover:underline">
                      View details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-sm text-gray-600">
          Public URL uses email prefix, e.g.{" "}
          <span className="font-medium">/public/sak2</span>.
        </div>
      </div>
    </main>
  );
}
