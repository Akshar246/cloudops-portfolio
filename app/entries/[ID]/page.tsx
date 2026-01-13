import Link from "next/link";

export default function EntryEdit({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">Entry: {params.id}</div>
            <div className="text-sm text-gray-600">View / Edit (demo UI)</div>
          </div>
          <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" href="/dashboard">
            Back
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border p-6 shadow-sm">
          <div className="text-sm text-gray-600">
            In the real app, this page will load entry data from your API and let you edit it.
          </div>

          <div className="mt-6 flex gap-2">
            <button className="rounded-2xl border px-4 py-3 text-sm hover:bg-gray-50">Publish</button>
            <button className="rounded-2xl border px-4 py-3 text-sm hover:bg-gray-50">Delete</button>
          </div>
        </div>
      </div>
    </main>
  );
}
