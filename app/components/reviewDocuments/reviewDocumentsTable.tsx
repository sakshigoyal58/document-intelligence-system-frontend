"use client";

import { ReviewDocumentsTableView } from "@/app/components/reviewDocuments/reviewDocumentsTableView";
import { useReviewDocuments } from "@/app/hooks/useReviewDocuments";
import { Document } from "@/app/types/document";

export default function ReviewDocumentsTable({ initialData }: { initialData: Document[] }) {
  const { rows, loading, messages, handleReview } = useReviewDocuments(initialData);

  return (
    <ReviewDocumentsTableView
      rows={rows}
      loading={loading}
      messages={messages}
      onReview={handleReview}
    />
  );
}
