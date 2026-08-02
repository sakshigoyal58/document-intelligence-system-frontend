"use client";

import { useEffect, useReducer, useRef } from "react";
import { fetchDocumentAnswer, fetchDocumentSearch } from "@/app/lib/api/chatClient";

export type MessageVariant = "assistant" | "user";

export type SearchResult = {
  documentId: string;
  documentName: string;
};

export type MessageItem = {
  id: number;
  text: string;
  variant: MessageVariant;
  searchResults?: SearchResult[];
};

type ChatState = {
  messages: MessageItem[];
  inputMessage: string;
  isLoading: boolean;
  selectedDocument: SearchResult | null;
};

type ChatAction =
  | { type: "setInput"; value: string }
  | { type: "startLoading" }
  | { type: "stopLoading" }
  | { type: "addMessage"; message: MessageItem }
  | { type: "setSelectedDocument"; document: SearchResult }
  | { type: "reset" };

const initialMessage: MessageItem = {
  id: 1,
  text: "Type a document name to search. I’ll suggest up to 10 matching documents.",
  variant: "assistant",
};

const initialState: ChatState = {
  messages: [initialMessage],
  inputMessage: "",
  isLoading: false,
  selectedDocument: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "setInput":
      return { ...state, inputMessage: action.value };
    case "startLoading":
      return { ...state, isLoading: true };
    case "stopLoading":
      return { ...state, isLoading: false };
    case "addMessage":
      return { ...state, messages: [...state.messages, action.message] };
    case "setSelectedDocument":
      return { ...state, selectedDocument: action.document };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export function useChatWindow() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSetInput = (value: string) => dispatch({ type: "setInput", value });

  const addMessage = (message: MessageItem) => dispatch({ type: "addMessage", message });

  const addUserMessage = (text: string) => {
    addMessage({ id: Date.now(), text, variant: "user" });
  };

  const addAssistantMessage = (text: string, searchResults?: SearchResult[]) => {
    addMessage({ id: Date.now(), text, variant: "assistant", searchResults });
  };

  const selectDocument = (document: SearchResult) => {
    dispatch({ type: "setSelectedDocument", document });
    addAssistantMessage(`Selected document: ${document.documentName}`);
    addAssistantMessage("Now ask your question about this document.");
  };

  const handleSearch = async (query: string) => {
    dispatch({ type: "startLoading" });

    try {
      const results = await fetchDocumentSearch(query);
      const hasResults = results.length > 0;

      addAssistantMessage(
        hasResults
          ? "Choose one document below to continue."
          : "No matching documents were found. Try another document name.",
        hasResults ? results : undefined
      );
    } catch {
      addAssistantMessage("I could not reach the document search service right now.");
    } finally {
      dispatch({ type: "stopLoading" });
    }
  };

  const handleAsk = async (question: string) => {
    if (!state.selectedDocument) return;

    dispatch({ type: "startLoading" });

    try {
      const answer = await fetchDocumentAnswer(state.selectedDocument.documentId, question);
      addAssistantMessage(`Answer for ${state.selectedDocument.documentName}: ${answer}`);
    } catch {
      addAssistantMessage("I could not reach the document question service right now.");
    } finally {
      dispatch({ type: "stopLoading" });
    }
  };

  const handleSubmit = async () => {
    const trimmed = state.inputMessage.trim();
    if (!trimmed || state.isLoading) return;

    addUserMessage(trimmed);
    dispatch({ type: "setInput", value: "" });

    if (!state.selectedDocument) {
      await handleSearch(trimmed);
      return;
    }

    await handleAsk(trimmed);
  };

  return {
    messages: state.messages,
    inputMessage: state.inputMessage,
    isLoading: state.isLoading,
    selectedDocument: state.selectedDocument,
    inputRef,
    handleSetInput,
    handleSubmit,
    selectDocument,
  };
}
