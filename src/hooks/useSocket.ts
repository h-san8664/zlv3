'use client';

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const s = io("/", { path: "/api/socketio" });

    s.on("connect", () => console.log("Connected:", s.id));
    s.on("disconnect", () => console.log("Disconnected"));

    s.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!socket) return;
    socket.emit("message", { text, senderId: "client" });
  };

  return { socket, messages, sendMessage };
}
