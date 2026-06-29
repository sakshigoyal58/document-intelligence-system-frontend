"use client";

import { useState } from "react";
import ChatDrawer from "./chatDrawer";

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);


  function handleOnClose() {
     setOpen(false);
  }


  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg">
        Chat
      </button>

        {open && <ChatDrawer open={open} onClose={handleOnClose} />}
      
    </>
  );
}