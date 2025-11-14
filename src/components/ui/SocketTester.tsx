'use client';

import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";

export default function SocketTester() {
  const { messages, sendMessage } = useSocket();
  const [input, setInput] = useState("");

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="font-bold mb-2">Socket.IO Tester</h2>

      <div className="space-y-1 max-h-40 overflow-y-auto border p-2 mb-3 text-sm">
        {messages.map((m, i) => (
          <div key={i}>[{m.senderId}] {m.text}</div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border px-2 py-1 rounded w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
