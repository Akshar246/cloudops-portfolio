import Link from "next/link";
import { headers } from "next/headers";

/**
 * PUBLIC PROFILE PAGE (Recruiter Header + Polished UX)
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
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
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
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
      }
    >
      {children}
    </Link>
  );
}

function TypeBadge({ type }: { type: EntryType }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 shadow-sm">
      {type}
    </span>
  );
}

function safeDate(s: string) {
  // keep it simple + readable (YYYY-MM-DD)
  if (!s) return "—";
  return s.slice(0, 10);
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
  const typeParam = (sp.type || "all").toLowerCase(); // all | aws lab | project | dsa | certificate

  // Build base URL dynamically (works locally + Vercel)
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  const base = host ? `${proto}://${host}` : "";

  const res = await fetch(`${base}/api/public/${username}`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  const entries: PublicEntry[] = data.entries || [];
  const errorMessage = !res.ok ? data?.message || "Failed to load profile" : null;

  // Stats
  const counts = {
    total: entries.length,
    aws: entries.filter((e) => e.type === "AWS Lab").length,
    dsa: entries.filter((e) => e.type === "DSA").length,
    project: entries.filter((e) => e.type === "Project").length,
    cert: entries.filter((e) => e.type === "Certificate").length,
  };

  // Filtering (server-side)
  const filtered = entries.filter((e) => {
    const matchesType =
      typeParam === "all" ? true : e.type.toLowerCase() === typeParam;

    const text = `${e.title} ${e.description} ${(e.tags || []).join(" ")}`.toLowerCase();
    const matchesQuery = q ? text.includes(q.toLowerCase()) : true;

    return matchesType && matchesQuery;
  });

  // Default sort: newest first (by date string)
  const sorted = [...filtered].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  function makeHref(nextType: string, nextQ: string) {
    const qs = new URLSearchParams();
    if (nextQ) qs.set("q", nextQ);
    if (nextType && nextType !== "all") qs.set("type", nextType);
    const s = qs.toString();
    return s ? `/public/${username}?${s}` : `/public/${username}`;
  }

  const isActive = (t: string) =>
    typeParam === "all" ? t === "all" : t === typeParam;

  //Edit these once and forget (your real header)
  const PROFILE = {
    name: "Akshar Chanchlani",
    headline: "Cloud / DevOps Learner • AWS Hands-on Portfolio",
    location: "London / India",
    about:
      "I build proof-driven cloud projects and learning logs (AWS labs, certifications, DSA, and real apps) with clean engineering practices and security-first mindset.",
    skills: ["AWS", "IAM", "S3", "VPC", "CloudWatch", "Next.js", "MongoDB", "JWT"],
    links: {
      linkedin: "https://linkedin.com/in/akshar-chanchlani",
      github: "https://github.com/Akshar246",
      resume: "/CV_JPM.pdf", 
    },
  };

  const shareUrl = `${base}/public/${username}`;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs text-slate-500">Public Profile</p>
            <h1 className="text-2xl font-bold text-slate-900">
              {username} - Public Portfolio
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Showing only <span className="font-medium">public</span> entries.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* ✅ Recruiter Header (Hero) */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-900">{PROFILE.name}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {PROFILE.headline} · {PROFILE.location}
              </p>

              <p className="mt-4 text-slate-700 leading-relaxed">
                {PROFILE.about}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {PROFILE.skills.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  href={PROFILE.links.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill>{counts.total} entries</Pill>
                <Pill>{counts.aws} AWS</Pill>
                <Pill>{counts.project} Projects</Pill>
                <Pill>{counts.dsa} DSA</Pill>
                <Pill>{counts.cert} Certificates</Pill>
              </div>
            </div>

            {/* Share block */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Shareable link</p>
              <p className="mt-1 max-w-[340px] break-all font-mono text-xs text-slate-700">
                {shareUrl || `/public/${username}`}
              </p>
              <p className="mt-2 text-xs text-slate-500">
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
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                <TabButton href={makeHref("all", q)} active={isActive("all")}>
                  All
                </TabButton>
                <TabButton
                  href={makeHref("aws lab", q)}
                  active={isActive("aws lab")}
                >
                  AWS Labs
                </TabButton>
                <TabButton
                  href={makeHref("project", q)}
                  active={isActive("project")}
                >
                  Projects
                </TabButton>
                <TabButton href={makeHref("dsa", q)} active={isActive("dsa")}>
                  DSA
                </TabButton>
                <TabButton
                  href={makeHref("certificate", q)}
                  active={isActive("certificate")}
                >
                  Certificates
                </TabButton>
              </div>

              {/* Search */}
              <form action={`/public/${username}`} className="flex gap-2">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search title, tags, description…"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 outline-none focus:border-slate-500 md:w-[320px]"
                />
                {typeParam !== "all" ? (
                  <input name="type" value={typeParam} readOnly hidden />
                ) : null}
                <button
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Showing <span className="font-medium text-slate-700">{sorted.length}</span>{" "}
              results.
            </div>
          </div>
        ) : null}

        {/* Content */}
        <div className="mt-6">
          {!errorMessage && sorted.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-slate-700 font-medium">No matching public entries.</p>
              <p className="mt-2 text-sm text-slate-600">
                Try a different search or switch a filter.
              </p>
            </div>
          ) : null}

          {!errorMessage && sorted.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((e) => (
                <Link
                  key={e._id}
                  href={`/public/${username}/entries/${e._id}`}
                  className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <TypeBadge type={e.type} />
                    <span className="text-xs text-slate-500">{safeDate(e.date)}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                    {e.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                    {e.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(e.tags || []).slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 text-sm font-medium text-slate-900">
                    View details →
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {/* Footer helper */}
        <div className="mt-10 text-sm text-slate-600">
          Public URL uses email prefix. Example:{" "}
          <span className="font-medium">/public/sak246203</span>
        </div>
      </div>
    </main>
  );
}
