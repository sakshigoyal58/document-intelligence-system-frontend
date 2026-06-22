"use client";

import { Document } from "@/app/types/document";

export default function ReviewDocumentsTable({initialData}: {initialData: Document[];}) 
{
  const data = initialData ?? [];

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
          {data.map((doc) => (
            <tr key={doc.DocumentId} className="hover:bg-slate-50">
              <td className="px-4 py-3">{doc.FileName}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    doc.FileStatus === "VALIDATED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {doc.FileStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(doc.CreatedAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(doc.UpdatedAt).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => {}}
                    className="rounded bg-green-600 px-3 py-1 text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => {}}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
