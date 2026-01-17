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
              href="/public/sak246203"
            >
              Public Profile
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
              Proof-driven portfolio for AWS + Projects + DSA.
            </h1>

            <p className="mt-4 leading-relaxed text-gray-700">
              This is not a static portfolio. It’s a personal dashboard where I
              log work (AWS labs, projects, DSA), attach proofs (S3), and
              publish selected entries to a clean public profile.
            </p>

            {/* ✅ Updated CTAs (no Demo Login) */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm text-white hover:bg-gray-800"
                href="/public/sak246203"
              >
                View Public Profile
              </Link>

              <Link
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm text-gray-700 hover:bg-gray-100"
                href="/login"
              >
                Login to Dashboard
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-700">
              {[
                "JWT Auth",
                "MongoDB + Mongoose",
                "S3 Proof Uploads",
                "Public/Private Entries",
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
              What recruiters will see
            </div>
            <p className="mt-2 text-sm text-gray-700">
              A public profile with real entries marked as{" "}
              <span className="font-medium">public</span>, including proofs.
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
                    <div className="font-medium text-gray-900">{x.title}</div>
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                      {x.type}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">{x.date}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Link
                href="/public/sak246203"
                className="text-sm font-medium text-gray-900 hover:underline"
              >
                Open Public Profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
