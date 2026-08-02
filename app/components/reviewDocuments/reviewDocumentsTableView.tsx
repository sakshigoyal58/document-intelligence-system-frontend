import { Document } from "@/app/types/document";
import { ReviewStatus } from "@/app/lib/api/reviewDocumentClient";
import { ReviewDocumentRow } from "./reviewDocumentRow";

type ReviewDocumentsTableViewProps = {
  rows: Document[];
  loading: Record<string, boolean>;
  messages: Record<string, string>;
  onReview: (documentId: string, status: ReviewStatus) => void;
};

export function ReviewDocumentsTableView({ rows, loading, messages, onReview }: ReviewDocumentsTableViewProps) {
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
            <ReviewDocumentRow
              key={doc.DocumentId}
              document={doc}
              loading={!!loading[doc.DocumentId]}
              message={messages[doc.DocumentId]}
              onReview={onReview}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
