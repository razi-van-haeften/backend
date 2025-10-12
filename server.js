import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from './Player.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // for testing; restrict later for security
  }
});

const players = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  players[socket.id] = new Player(socket.id, "Guest");

  socket.emit("message", "Joined");

  socket.on("chat", (msg) => {
    console.log("Client said:", msg);
    io.emit("chat", `${socket.id}: ${msg}`); // broadcast to everyone
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
