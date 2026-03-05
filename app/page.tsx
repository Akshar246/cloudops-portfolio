import Link from "next/link";
import { headers } from "next/headers";

/**
 * HOME / RECRUITER-FIRST LANDING PAGE
 */

type EntryType = "AWS Lab" | "Project" | "DSA" | "Certificate";
type PublicEntry = {
  _id?: string;
  type?: EntryType;
  title?: string;
  description?: string;
  date?: string;
  whatILearned?: string;
};

function truncateText(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

function formatDateLabel(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host");
  const fallback = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return host ? `${proto}://${host}` : fallback;
}

export default async function Home() {
  const profile = {
    name: "Akshar Chanchlani",
    role: "Cloud / DevOps Engineer",
    summary:
      "I build production-style AWS projects with verifiable proof, security-first design, and clear engineering outcomes.",
    location: "London / India",
    email: "sak246203@gmail.com",
    linkedin: "https://linkedin.com/in/akshar-chanchlani",
    github: "https://github.com/Akshar246",
    resume: "/CV_JPM.pdf",
    publicPortfolio: "/public/sak246203",
  };

  const username = profile.publicPortfolio.split("/").filter(Boolean)[1] || "sak246203";
  const base = await getBaseUrl();
  const profileRes = await fetch(`${base}/api/public/${username}`, {
    cache: "no-store",
  });
  const profileData = await profileRes.json().catch(() => ({}));
  const publicEntries: PublicEntry[] = Array.isArray(profileData?.entries)
    ? profileData.entries
    : [];
  const liveStats = {
    total: publicEntries.length,
    aws: publicEntries.filter((e) => e.type === "AWS Lab").length,
    projects: publicEntries.filter((e) => e.type === "Project").length,
    certs: publicEntries.filter((e) => e.type === "Certificate").length,
  };
  const latestEntryDate =
    publicEntries
      .map((e) => e.date || "")
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort((a, b) => b.localeCompare(a))[0] || new Date().toISOString().slice(0, 10);
  const qualityBadges = [
    "CI: ESLint Passing",
    "Deploy: Vercel Live",
    "Checks: Auth + S3 Validation",
  ];

  const dynamicTopProjects = publicEntries.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Recruiter Start Here
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-2 text-lg font-semibold text-blue-800">{profile.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
                {profile.summary}
              </p>
              <p className="mt-3 text-sm text-slate-600">{profile.location}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={profile.publicPortfolio}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  View Top Projects
                </Link>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Resume
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Role Fit Highlights</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p className="rounded-xl bg-slate-50 px-3 py-2">AWS + Cloud Security</p>
                <p className="rounded-xl bg-slate-50 px-3 py-2">Full-stack Delivery</p>
                <p className="rounded-xl bg-slate-50 px-3 py-2">Production Mindset</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Cloud Delivery",
              text: "Built and deployed production-style full-stack features with secure auth and storage.",
            },
            {
              title: "Reliability",
              text: "Structured projects with proof artifacts and repeatable workflows for consistent outcomes.",
            },
            {
              title: "Security",
              text: "JWT cookie auth, owner-only access checks, and scoped S3 key validation.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Impact Snapshot
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              `${liveStats.total} public entries`,
              `${liveStats.aws} AWS labs`,
              `${liveStats.projects} projects`,
              `${liveStats.certs} certifications`,
            ].map((x) => (
              <div key={x} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                {x}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Quality Signals
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Last updated from public portfolio data:{" "}
                <span className="font-medium text-slate-800">
                  {formatDateLabel(latestEntryDate)}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {qualityBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">Architecture</h2>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              Production-style flow
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Recruiter view of how this portfolio handles auth, data, and proof artifacts.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Browser (Next.js UI)</p>
              <p className="mt-1 text-xs text-slate-600">Public portfolio, admin entry management, proof upload flow.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Backend</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Next.js API Routes</p>
              <p className="mt-1 text-xs text-slate-600">Validates auth, enforces owner-only CRUD, serves public data.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">MongoDB + Mongoose</p>
              <p className="mt-1 text-xs text-slate-600">Stores users, entries, tags, and “What I Learned” reflections.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Storage</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">AWS S3 (Presigned URLs)</p>
              <p className="mt-1 text-xs text-slate-600">Proof files uploaded securely with scoped key validation.</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-xs text-slate-600">
            Flow: Browser request → API auth/validation → MongoDB metadata + S3 proofs → recruiter-safe public read APIs.
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Top Projects</h2>
            <Link href={profile.publicPortfolio} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              View all →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {dynamicTopProjects.length > 0 ? (
              dynamicTopProjects.map((project) => {
                const title = project.title || "Untitled Entry";
                const summary = truncateText(
                  project.description || "No summary provided yet.",
                  110
                );
                const learned = truncateText(
                  project.whatILearned || "No learning notes added yet.",
                  100
                );
                const dateText = (project.date || "").slice(0, 10) || "—";
                const typeText = project.type || "Project";
                const href = project._id
                  ? `/public/${username}/entries/${project._id}`
                  : profile.publicPortfolio;

                return (
                  <div key={`${project._id || title}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-base font-semibold text-slate-900">{title}</p>
                    <p className="mt-2 text-sm text-slate-600">{summary}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      {typeText} · {dateText}
                    </p>
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-medium">What I learned: </span>
                      {learned}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={href}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        Case Study
                      </Link>
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
                Add public entries to automatically populate Top Projects.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Certifications & Proof</h3>
            <p className="mt-2 text-sm text-slate-600">
              Each public entry includes evidence files, implementation notes, and lessons learned.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
              {["AWS Labs", "Project Proofs", "DSA Logs", "Security Review Fixes"].map((x) => (
                <span key={x} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold">Open to Cloud / DevOps roles</h3>
            <p className="mt-2 text-sm text-slate-300">
              Looking for internships and early-career roles where I can contribute to cloud infrastructure, delivery automation, and secure backend systems.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
              >
                {profile.email}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-500 px-4 py-2 text-sm hover:bg-slate-800"
              >
                LinkedIn
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-500 px-4 py-2 text-sm hover:bg-slate-800"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-4 text-right">
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Admin
          </Link>
        </footer>
      </div>
    </main>
  );
}
