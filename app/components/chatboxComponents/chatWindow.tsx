"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./messageBubble";

type MessageItem = {
  id: number;
  text: string;
  variant: "assistant" | "user";
  actions?: React.ReactNode;
};

type SearchResult = {
  documentId: string;
  documentName: string;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 1,
      text: "Type a document name to search. I’ll suggest up to 10 matching documents.",
      variant: "assistant",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = inputMessage.trim();
    if (!trimmed || isLoading) return;

    const userMessage: MessageItem = {
      id: Date.now(),
      text: trimmed,
      variant: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    if (!selectedDocument) {
      try {
        const response = await fetch(`/api/documents/search?searchText=${encodeURIComponent(trimmed)}`);
        const data = await response.json();

        const results: SearchResult[] = Array.isArray(data?.documents)
          ? (data.documents as SearchResult[])
          : [];

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: results.length > 0 ? "Choose one document below to continue." : "No matching documents were found. Try another document name.",
            variant: "assistant",
            actions:
              results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <button
                      key={result.documentId}
                      type="button"
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-left text-sm hover:bg-gray-800"
                      onClick={() => {
                        setSelectedDocument(result);
                        setMessages((current) => [
                          ...current,
                          {
                            id: Date.now() + 2,
                            text: `Selected document: ${result.documentName}`,
                            variant: "assistant",
                          },
                          {
                            id: Date.now() + 3,
                            text: "Now ask your question about this document.",
                            variant: "assistant",
                          },
                        ]);
                      }}
                    >
                      {result.documentName}
                    </button>
                  ))}
                </div>
              ) : null,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 4,
            text: "I could not reach the document search service right now.",
            variant: "assistant",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 5,
        text: `Question for ${selectedDocument.documentName}: ${trimmed}`,
        variant: "assistant",
      },
    ]);
    setSelectedDocument(null);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} text={msg.text} index={msg.id} variant={msg.variant} actions={msg.actions} />
        ))}
        {isLoading ? <MessageBubble text="Searching documents..." index={-1} variant="assistant" /> : null}
      </div>

      <div className="border-t border-gray-800 bg-gray-950 p-3">
        <input
          ref={inputRef}
          className="w-full rounded bg-gray-900 p-2 text-white outline-none"
          placeholder={selectedDocument ? "Ask a question about this document..." : "Type a document name to search..."}
          value={inputMessage}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputMessage(e.target.value)}
        />
      </div>
    </div>
  );
}