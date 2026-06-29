"use client";

import { useState } from "react";
import MessageBubble from "./messageBubble";

export default function ChatWindow() {

  const[text, setText] = useState<string[]>([]);
  const[inputMessage, setInputMessage] = useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setText((prevText) => [...prevText, inputMessage]);
      setInputMessage(''); 
    }
  };

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {text.map((msg, index) => (
          <MessageBubble key={index} text={msg} index={index} />
        ))}
      </div>

      <div className="border-t border-gray-800 p-3 bg-gray-950">
        <input
          className="w-full bg-gray-900 p-2 rounded text-white outline-none"
          placeholder="Type here..."
          value={inputMessage} 
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputMessage(e.target.value)}
        />
      </div>

    </div>
  );
}