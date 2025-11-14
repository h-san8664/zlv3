// server.ts - Next.js + Socket.IO Custom Server

import next from 'next';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './src/lib/socket';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  try {
    const app = next({
      dev,
      dir: process.cwd(),
      conf: dev ? undefined : { distDir: './.next' },
    });

    await app.prepare();
    const handle = app.getRequestHandler();

    const httpServer = createServer((req, res) => {
      // Jangan ganggu Socket.IO endpoint
      if (req.url?.startsWith('/api/socketio')) return;
      handle(req, res);
    });

    const io = new Server(httpServer, {
      path: '/api/socketio',
      cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    setupSocket(io);

    httpServer.listen(port, hostname, () => {
      console.log(`> NEXT ready at http://${hostname}:${port}`);
      console.log(`> WS   ready at ws://${hostname}:${port}/api/socketio`);
    });
  } catch (err) {
    console.error('[SERVER ERROR]', err);
    process.exit(1);
  }
}

start();
