import Link from "next/link";

export default function PublicProfile() {
  const publicEntries = [
    {
      title: "GlobeTalk: Real-Time Language Translation Web App",
      type: "Project",
      date: "2025-12-31",
      desc: "A real-time translation web app with APIs, auth, and scalable design.",
      tags: ["mern", "api", "realtime"],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">Akshar — Public Profile</div>
            <div className="text-sm text-gray-600">Only entries marked public appear here.</div>
          </div>
          <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" href="/">
            Home
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border p-6 shadow-sm">
          <div className="text-2xl font-bold">CloudOps Portfolio Hub</div>
          <p className="mt-2 text-sm text-gray-600">
            This profile is generated from my private dashboard entries.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {publicEntries.map((e) => (
            <div key={e.title} className="rounded-3xl border p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{e.title}</div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{e.type}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">{e.date}</div>
              <div className="mt-3 text-sm text-gray-600">{e.desc}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 text-xs">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-sm text-gray-500">
          Next upgrade: proofs (S3), auth, and real data from DB.
        </div>
      </div>
    </main>
  );
}
