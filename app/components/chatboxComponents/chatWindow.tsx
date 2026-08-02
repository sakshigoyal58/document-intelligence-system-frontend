"use client";

import type { KeyboardEvent } from "react";
import { useChatWindow } from "@/app/hooks/useChatWindow";
import MessageBubble from "./messageBubble";
import { ChatSearchResults } from "./chatSearchResults";

export default function ChatWindow() {
  const {
    messages,
    inputMessage,
    isLoading,
    inputRef,
    handleSetInput,
    handleSubmit,
    selectedDocument,
    selectDocument,
  } = useChatWindow();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            index={msg.id}
            variant={msg.variant}
            actions={
              msg.searchResults ? (
                <ChatSearchResults results={msg.searchResults} onSelect={selectDocument} />
              ) : undefined
            }
          />
        ))}
        {isLoading ? <MessageBubble text="Searching documents..." index={-1} variant="assistant" /> : null}
      </div>

      <div className="flex-shrink-0 border-t border-gray-800 bg-gray-950 p-3">
        <input
          ref={inputRef}
          className="w-full rounded bg-gray-900 p-2 text-white outline-none"
          placeholder={selectedDocument ? "Ask a question about this document..." : "Type a document name to search..."}
          value={inputMessage}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleSetInput(e.target.value)}
        />
      </div>
    </div>
  );
}
