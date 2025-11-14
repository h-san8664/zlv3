import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Terima pesan
    socket.on("message", (data) => {
      console.log("Message received:", data);

      // Balas ke pengirim
      socket.emit("message", {
        text: `Echo: ${data.text}`,
        senderId: "server",
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Kirim welcome
    socket.emit("message", {
      text: "Welcome to Socket.IO server!",
      senderId: "server",
      timestamp: new Date().toISOString(),
    });
  });
};
