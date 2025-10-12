import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./managers/SocketManager.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
  pingInterval: 200, 
  pingTimeout: 3000
});

new SocketManager(io);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
