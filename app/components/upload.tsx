"use client";

import { ChangeEvent, useRef, useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  }

  function handleUploadClick(): void {
    fileInputRef.current?.click();
  }



  return (
    <form className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleUploadClick}
          className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Upload PDF
        </button>
        {file ? (
          <p className="text-sm text-slate-600">{file.name}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Process PDF
      </button>
    </form>
  );
}
