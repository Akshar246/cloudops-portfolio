import Link from "next/link";

/**
 * HOME / LANDING PAGE
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-900">
            CloudOps Portfolio Hub
          </div>

          <div className="flex gap-3">
            <Link
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              href="/public/sak246203"
            >
              Public Portfolio
            </Link>
            <Link
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
              href="/login"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Main Section */}
        <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Evidence-based Cloud & Engineering Portfolio
            </h1>

            <p className="mt-4 leading-relaxed text-gray-700">
              This platform documents hands-on work across{" "}
              <span className="font-medium">AWS labs</span>,{" "}
              <span className="font-medium">engineering projects</span>, and{" "}
              <span className="font-medium">data structures</span>.  
              Each entry includes verifiable proof artifacts and can be selectively
              published to a recruiter-ready public portfolio.
            </p>

            {/* Primary CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm text-white hover:bg-gray-800"
                href="/public/sak246203"
              >
                View Public Portfolio
              </Link>

              <Link
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm text-gray-700 hover:bg-gray-100"
                href="/login"
              >
                Login to Dashboard
              </Link>
            </div>

            {/* Tech Signals */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-700">
              {[
                "AWS S3 + Presigned URLs",
                "IAM (Least Privilege)",
                "JWT Authentication",
                "MongoDB & Mongoose",
                "Public / Private Access Design",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">
              Public Portfolio Preview
            </div>
            <p className="mt-2 text-sm text-gray-700">
              A curated public portfolio showcasing selected work with{" "}
              <span className="font-medium">verifiable proof artifacts</span>.
            </p>

            <div className="mt-5 grid gap-3">
              {[
                {
                  title: "AWS SimuLearn — S3 Reliability Lab",
                  type: "AWS Lab",
                  date: "Jan 13, 2026",
                },
                {
                  title:
                    "DSA — Insertion Sort (Java) with Implementation Notes",
                  type: "DSA",
                  date: "Jan 12, 2026",
                },
                {
                  title:
                    "GlobeTalk — Real-Time Language Translation Web Application",
                  type: "Project",
                  date: "Dec 31, 2025",
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {x.title}
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                      Public
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {x.type} · {x.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Link
                href="/public/sak246203"
                className="text-sm font-medium text-gray-900 hover:underline"
              >
                View Public Portfolio →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
