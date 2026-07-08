"use client";

import ChatWindow from "./chatWindow";

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
};



export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  return (
    <div
  className={`
    fixed top-0 right-0 h-full w-[380px]
    bg-gray-950 text-white
    border-l border-gray-800 shadow-2xl z-[60]
    flex flex-col
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "translate-x-full"}
  `}
>
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h2 className="text-sm font-semibold"> Ask Me anything about Documents</h2>

        <button onClick={onClose} className="text-gray-400">
          ✕
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}