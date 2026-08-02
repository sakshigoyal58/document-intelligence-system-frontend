import { Document } from "@/app/types/document";
import { ReviewStatus } from "@/app/lib/api/reviewDocumentClient";
import { ReviewStatusBadge } from "./reviewStatusBadge";

type ReviewDocumentRowProps = {
  document: Document;
  loading: boolean;
  message?: string;
  onReview: (documentId: string, status: ReviewStatus) => void;
};

function formatDate(dateValue: string) {
  return new Date(dateValue).toLocaleString();
}

export function ReviewDocumentRow({ document, loading, message, onReview }: ReviewDocumentRowProps) {
  return (
    <tr className="hover:bg-slate-50" aria-busy={loading}>
      <td className="px-4 py-3">{document.FileName}</td>
      <td className="px-4 py-3">
        <ReviewStatusBadge status={document.FileStatus} />
      </td>
      <td className="px-4 py-3 text-slate-600">{formatDate(document.CreatedAt)}</td>
      <td className="px-4 py-3 text-slate-600">{formatDate(document.UpdatedAt)}</td>
      <td className="px-4 py-3">
        {loading ? (
          <div aria-live="polite" className="text-sm text-slate-700">
            Loading...
          </div>
        ) : message ? (
          <div aria-live="polite" className="text-sm text-slate-700">{message}</div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onReview(document.DocumentId, "APPROVED")}
              className="rounded bg-green-600 px-3 py-1 text-white"
              disabled={loading}
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onReview(document.DocumentId, "REJECTED")}
              className="rounded bg-red-600 px-3 py-1 text-white"
              disabled={loading}
            >
              Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
