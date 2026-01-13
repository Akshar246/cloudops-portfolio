import Link from "next/link";

export default function NewEntry() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">New Entry</div>
            <div className="text-sm text-gray-600">Demo form (Week 1 UI)</div>
          </div>
          <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" href="/dashboard">
            Back
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border p-6 shadow-sm">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm">
                {["AWS Lab", "Project", "DSA", "Certificate"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Title</label>
              <input className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm" placeholder="e.g., VPC + Subnets Lab" />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm" rows={4} placeholder="What you did, what you learned, why it matters." />
            </div>

            <div>
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm" placeholder="aws, vpc, networking" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Visibility</label>
                <select className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm">
                  <option>private</option>
                  <option>public</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <input className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm" placeholder="YYYY-MM-DD" />
              </div>
            </div>

            <div className="mt-2 rounded-2xl border p-4 text-sm text-gray-600">
              Proof uploads (S3) will come in Week 2 using pre-signed URLs.
            </div>

            <button className="mt-2 rounded-2xl bg-black px-4 py-3 text-sm text-white hover:opacity-90">
              Save (demo)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
