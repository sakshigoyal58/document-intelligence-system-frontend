"use client";

import { useDocumentUpload } from "@/app/hooks/useDocumentUpload";
import { ChangeEvent, useRef } from "react";

export default function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { file, loading, status, selectFile, upload } = useDocumentUpload();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    selectFile(selected);
  }

  return (
    <form className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-slate-600 px-4 py-2 text-white">
          Upload PDF
        </button>
        {file && <p className="text-sm">{file.name}</p>}
      </div>

      <button
        type="button"
        disabled={!file || loading}
        onClick={upload}
        className="rounded-lg bg-slate-950 px-4 py-2 text-white disabled:bg-slate-400">
        {loading ? "Processing..." : "Process PDF"}
      </button>

      {status && <p className="text-sm text-green-600">{status}</p>}
    </form>
  );
}
