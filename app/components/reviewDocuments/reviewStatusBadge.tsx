import type { FileStatus } from "@/app/types/document";

const statusStyles: Record<FileStatus, string> = {
  VALIDATED: "bg-green-100 text-green-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  VALIDATION_FAILED: "bg-red-100 text-red-700",
};

export function ReviewStatusBadge({ status }: { status: FileStatus }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status] ?? "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
