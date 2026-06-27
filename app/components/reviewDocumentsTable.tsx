"use client";

import { useState } from "react";
import { Document } from "@/app/types/document";

export default function ReviewDocumentsTable({ initialData }: { initialData: Document[] }) {
  const [rows, setRows] = useState<Document[]>(initialData ?? []);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  async function handleReview(documentId: string, status: string) {
    setLoading((s) => ({ ...s, [documentId]: true }));
    setMessages((m) => ({ ...m, [documentId]: "" }));

    try {
      const res = await fetch(`/api/documents/${documentId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const text = await res.text();

      // show message in row
      setMessages((m) => ({ ...m, [documentId]: text }));

      // remove row after short delay so user sees message
      setTimeout(() => {
        setRows((r) => r.filter((row) => row.DocumentId !== documentId));
        setMessages((m) => {
          const copy = { ...m };
          delete copy[documentId];
          return copy;
        });
        setLoading((s) => {
          const copy = { ...s };
          delete copy[documentId];
          return copy;
        });
      }, 600);
    } catch (err) {
      console.error(err);
      setMessages((m) => ({ ...m, [documentId]: "Failed to update" }));
      setLoading((s) => ({ ...s, [documentId]: false }));
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">File Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created At</th>
            <th className="px-4 py-3">Updated At</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {rows.map((doc) => (
            <tr key={doc.DocumentId} className="hover:bg-slate-50" aria-busy={!!loading[doc.DocumentId]}>
              <td className="px-4 py-3">{doc.FileName}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    doc.FileStatus === "VALIDATED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {doc.FileStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{new Date(doc.CreatedAt).toLocaleString()}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(doc.UpdatedAt).toLocaleString()}</td>
              <td className="px-4 py-3">
                {loading[doc.DocumentId] ? (
                  <div aria-live="polite" className="text-sm text-slate-700">Loading...</div>
                ) : messages[doc.DocumentId] ? (
                  <div aria-live="polite" className="text-sm text-slate-700">{messages[doc.DocumentId]}</div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(doc.DocumentId, "APPROVED")}
                      className="rounded bg-green-600 px-3 py-1 text-white"
                      disabled={!!loading[doc.DocumentId]}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReview(doc.DocumentId, "REJECTED")}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                      disabled={!!loading[doc.DocumentId]}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
