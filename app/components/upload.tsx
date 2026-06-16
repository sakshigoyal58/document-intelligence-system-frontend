"use client";

import { ChangeEvent, useRef, useState } from "react";
import { getPresignedUrl } from "../actions/upload.action";
import { uploadToS3 } from "../lib/api/s3Upload";
import { revalidateDocuments } from "../actions/revalidateDocument";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  }

  function handleUploadClick(): void {
    fileInputRef.current?.click();
  }

  async function handleProcessPdf(): Promise<void> {
    if (!file) return;

    try {
      setLoading(true);

      // ONLY responsibility: get presigned URL
      const data = await getPresignedUrl(file.name);

      console.log(data);
      console.log("Presigned URL:", data.PresignedUrl);
      setUploadUrl(data.PresignedUrl);
      await uploadToS3(file, data.PresignedUrl);
      await revalidateDocuments();

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleUploadClick}
          className="rounded-lg bg-slate-600 px-4 py-2 text-sm text-white hover:bg-slate-700"
        >
          Upload PDF
        </button>

        {file && (
          <p className="text-sm text-slate-600">{file.name}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleProcessPdf}
        disabled={!file || loading}
        className="rounded-lg bg-slate-950 px-4 py-2 text-sm text-white disabled:bg-slate-400"
      >
        {loading ? "Getting URL..." : "Process PDF"}
      </button>

      {uploadUrl && (
        <p className="text-xs text-green-600">
          Presigned URL generated ✔
        </p>
      )}
    </form>
  );
}