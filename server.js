// server.js – Custom Next.js Standalone Server for Render + Socket.IO

const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
require("dotenv").config();

// ====== CONFIG ======
const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";

// Render memberikan PORT lewat env
const port = process.env.PORT || 3000;

// ====== Next.js App Setup ======
const app = next({
  dev,
  hostname,
  port,
  // Use standalone build output inside .next/standalone
  conf: dev
    ? {}
    : {
        distDir: "./.next",
      },
});

const handle = app.getRequestHandler();

// ====== Custom Socket Setup (convert from TypeScript version) ======
function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Echo message back to sender
    socket.on("message", (msg) => {
      socket.emit("message", {
        text: `Echo: ${msg.text}`,
        senderId: "system",
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Welcome message
    socket.emit("message", {
      text: "Welcome to WebSocket Echo Server!",
      senderId: "system",
      timestamp: new Date().toISOString(),
    });
  });
}

// ====== Start Server ======
async function start() {
  try {
    await app.prepare();

    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url.startsWith("/api/socketio")) return;
      handle(req, res);
    });

    // Socket.IO server setup
    const io = new Server(server, {
      path: "/api/socketio",
      cors: { origin: "*" },
    });

    setupSocket(io);

    server.listen(port, hostname, () => {
      console.log(`> Server ready at http://${hostname}:${port}`);
      console.log(`> Socket.IO ready at ws://${hostname}:${port}/api/socketio`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
}

start();
