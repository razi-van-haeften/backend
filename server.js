import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from './Player.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const players = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("joined", "joined lobby");

  socket.on("join", (name) => {
    players[socket.id] = new Player(socket.id, name);

    console.log(players[socket.id].name, "joined the game");

    socket.broadcast.emit("message", `${players[socket.id].name} has joined the game`);
    
    socket.emit("message", "joined game");
  });

  socket.on("chat", (msg) => {
    console.log("Client said:", msg);
    io.emit("chat", `${players[socket.id].name}: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    io.emit("message", `${players[socket.id].name} left the game`);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
