import { Document } from "@/app/types/document";

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(dateValue));
}

export function DocumentsTable({ data }: { data: Document[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left">
        
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">File Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created At</th>
            <th className="px-4 py-3">Updated At</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {data.map((doc) => (
            <tr key={doc.DocumentId} className="hover:bg-slate-50">
              <td className="px-4 py-3">{doc.FileName}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 rounded text-xs font-medium ">
                  {doc.FileStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{formatDate(doc.CreatedAt)}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(doc.UpdatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}