"use client";

import { useEffect, useReducer, useRef } from "react";
import { Document } from "@/app/types/document";
import { ReviewStatus, reviewDocumentStatus } from "@/app/lib/api/reviewDocumentClient";

const REVIEW_COMPLETE_DELAY_MS = 600;

type ReviewDocumentStatusFn = (
  documentId: string,
  status: ReviewStatus
) => Promise<string>;

type ReviewDocumentState = {
  rows: Document[];
  loading: Record<string, boolean>;
  messages: Record<string, string>;
};

type ReviewDocumentAction =
  | { type: "startReview"; documentId: string }
  | { type: "reviewSuccess"; documentId: string; message: string }
  | { type: "reviewFailure"; documentId: string; message: string }
  | { type: "removeReviewedDocument"; documentId: string };

function removeRowState<T>(documentId: string, state: Record<string, T>): Record<string, T> {
  const nextState = { ...state };
  delete nextState[documentId];
  return nextState;
}

function reviewDocumentReducer(
  state: ReviewDocumentState,
  action: ReviewDocumentAction
): ReviewDocumentState {
  switch (action.type) {
    case "startReview":
      return {
        ...state,
        loading: { ...state.loading, [action.documentId]: true },
        messages: { ...state.messages, [action.documentId]: "" },
      };
    case "reviewSuccess":
      return {
        ...state,
        loading: { ...state.loading, [action.documentId]: false },
        messages: { ...state.messages, [action.documentId]: action.message },
      };
    case "reviewFailure":
      return {
        ...state,
        loading: { ...state.loading, [action.documentId]: false },
        messages: { ...state.messages, [action.documentId]: action.message },
      };
    case "removeReviewedDocument":
      return {
        rows: state.rows.filter((row) => row.DocumentId !== action.documentId),
        messages: removeRowState(action.documentId, state.messages),
        loading: removeRowState(action.documentId, state.loading),
      };
    default:
      return state;
  }
}

export function useReviewDocuments(
  initialData: Document[],
  {
    reviewDocumentStatusFn = reviewDocumentStatus,
    reviewCompleteDelayMs = REVIEW_COMPLETE_DELAY_MS,
  }: {
    reviewDocumentStatusFn?: ReviewDocumentStatusFn;
    reviewCompleteDelayMs?: number;
  } = {}
) {
  const [state, dispatch] = useReducer(reviewDocumentReducer, {
    rows: initialData ?? [],
    loading: {},
    messages: {},
  });

  const timeouts = useRef<Record<string, number>>({});

  useEffect(() => {
    const activeTimeouts = timeouts.current;
    return () => {
      Object.values(activeTimeouts).forEach(clearTimeout);
    };
  }, []);

  async function handleReview(documentId: string, status: ReviewStatus) {
    dispatch({ type: "startReview", documentId });

    try {
      const message = await reviewDocumentStatusFn(documentId, status);
      dispatch({ type: "reviewSuccess", documentId, message });

      timeouts.current[documentId] = window.setTimeout(() => {
        dispatch({ type: "removeReviewedDocument", documentId });
        delete timeouts.current[documentId];
      }, reviewCompleteDelayMs);
    } catch (error) {
      console.error("Review request failed:", error);
      dispatch({
        type: "reviewFailure",
        documentId,
        message: "Failed to update",
      });
    }
  }

  return {
    rows: state.rows,
    loading: state.loading,
    messages: state.messages,
    handleReview,
  };
}
