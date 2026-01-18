"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  entryId: string;
};

const MAX_MB = 15;

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let idx = 0;
  let val = bytes;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx++;
  }
  return `${val.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export default function ProofUpload({ entryId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const accept = useMemo(() => "image/*,application/pdf", []);

  async function handleUpload(file: File) {
    setLoading(true);
    setMsg(null);

    try {
      if (!file.type || (!file.type.startsWith("image/") && file.type !== "application/pdf")) {
        throw new Error("Only images and PDFs are allowed.");
      }

      const maxBytes = MAX_MB * 1024 * 1024;
      if (file.size > maxBytes) {
        throw new Error(`File too large. Max ${MAX_MB}MB.`);
      }

      // 1) Presign upload
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          size: file.size,
          entryId,
        }),
      });

      const presignData = await presignRes.json().catch(() => ({}));
      if (!presignRes.ok) {
        throw new Error(presignData?.message || "Presign failed");
      }

      const { uploadUrl, key } = presignData as { uploadUrl: string; key: string };

      // 2) Upload to S3
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error("S3 upload failed");
      }

      // 3) Attach to Entry in DB
      const attachRes = await fetch(`/api/entries/${entryId}/proofs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          contentType: file.type,
          size: file.size,
          originalName: file.name,
        }),
      });

      const attachData = await attachRes.json().catch(() => ({}));
      if (!attachRes.ok) {
        throw new Error(attachData?.message || "Attach proof failed");
      }

      setMsg(`✅ Uploaded: ${file.name} (${formatBytes(file.size)})`);

      // IMPORTANT: refresh the current page (Server Components re-fetch)
      router.refresh();
    } catch (err: any) {
      setMsg(`❌ ${err?.message || "Upload failed"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-gray-900">Proofs</label>
        <p className="mt-1 text-xs text-gray-600">
          Upload screenshots or PDFs as evidence. Files are stored in S3 and linked to this entry.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Upload proof</span>{" "}
            <span className="text-gray-500">(Image / PDF, max {MAX_MB}MB)</span>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60">
            <input
              type="file"
              accept={accept}
              disabled={loading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                // allow re-upload same file name by resetting input
                e.currentTarget.value = "";
              }}
            />
            {loading ? "Uploading..." : "Choose file"}
          </label>
        </div>

        {msg && (
          <p className="mt-3 text-sm text-gray-700">
            {msg}
          </p>
        )}

        <p className="mt-3 text-xs text-gray-500">
          Tip: Mark the entry <span className="font-medium">public</span> to show proofs on your public profile.
        </p>
      </div>
    </div>
  );
}
