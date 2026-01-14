import Link from "next/link";

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
              href="/public/akshar"
            >
              View Public Profile
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
              Track, prove, and present your AWS + DSA progress like a real engineer.
            </h1>
            <p className="mt-4 text-gray-700 leading-relaxed">
              This isn’t a static portfolio. It’s a private dashboard where you log work
              (AWS labs, projects, DSA), attach proofs (later via S3), and publish a clean
              public profile.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm text-white hover:bg-gray-800"
                href="/dashboard"
              >
                Open Demo Dashboard
              </Link>
              <Link
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm text-gray-700 hover:bg-gray-100"
                href="/login"
              >
                Try Demo Login
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-700">
              {[
                "JWT Auth (Week 1)",
                "Private S3 proofs (Week 2)",
                "IAM least privilege (Week 3)",
                "CloudWatch logs",
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
              How it feels
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Like a mini internal tool (Jira/GitHub style) — not a brochure.
            </p>

            <div className="mt-5 grid gap-3">
              {[
                {
                  title: "AWS SimuLearn: S3 Reliability Lab",
                  type: "AWS Lab",
                  date: "Jan 13, 2026",
                },
                {
                  title: "DSA: Insertion Sort (Java) + Notes",
                  type: "DSA",
                  date: "Jan 12, 2026",
                },
                {
                  title: "GlobeTalk: Translation Web App",
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
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                      {x.type}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {x.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-gray-200 pt-8 text-sm text-gray-600">
          Demo UI only (no backend). We’ll connect real auth + DB + S3 next.
        </footer>
      </div>
    </main>
  );
}
