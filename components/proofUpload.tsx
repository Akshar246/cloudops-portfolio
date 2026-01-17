"use client";

import { useState } from "react";

type Props = {
  entryId: string;
};

export default function ProofUpload({ entryId }: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setLoading(true);
    setMsg(null);

    try {
      // 1) Presign
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

      const presignData = await presignRes.json();
      if (!presignRes.ok) {
        throw new Error(presignData?.message || "Presign failed");
      }

      const { uploadUrl, key } = presignData as {
        uploadUrl: string;
        key: string;
      };

      // 2) Upload to S3
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error("S3 upload failed");
      }

      // 3) Attach to Entry
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

      const attachData = await attachRes.json();
      if (!attachRes.ok) {
        throw new Error(attachData?.message || "Attach proof failed");
      }

      setMsg("✅ Proof uploaded & attached!");
    } catch (err: any) {
      setMsg(`❌ ${err?.message || "Upload failed"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Upload proof (image/PDF)
      </label>

      <input
        type="file"
        accept="image/*,application/pdf"
        disabled={loading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {loading && <p className="text-sm">Uploading...</p>}
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
