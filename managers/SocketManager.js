import { PlayerManager } from "./PlayerManager.js";
import { ChatManager } from "./ChatManager.js";

export class SocketManager {
    constructor(io) {
        this.io = io;
        this.players = new PlayerManager();
        this.chat = new ChatManager(io, this.players);
        this.registerEvents();
    }

    registerEvents() {
        this.io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            socket.emit("joined", "joined lobby");

            socket.on("join", (name) => this.handleJoin(socket, name));
            socket.on("chat", (msg) => this.chat.handleChat(socket, msg));
            socket.on("disconnect", () => this.handleDisconnect(socket));
            socket.on("packet", (buffer) => this.handlePacket(socket, buffer));
        });
    }

    handleJoin(socket, name) {
        const player = this.players.add(socket.id, name);
        console.log(`${player.name} joined the game`);
        socket.broadcast.emit("message", `${player.name} has joined the game`);
        socket.emit("message", "joined game");
    }

    handleJoinPacket(socket, buffer){
        const sliced = buffer.slice(1);
        const name = sliced.toString('utf8');
        
        const player = this.players.add(socket.id, name);
        console.log(`${player.name} joined the game`);
    }

    handleDisconnect(socket) {
        const player = this.players.get(socket.id);
        if (!player){
            console.log(`${socket.id} disconnected`);
            return;
        } 
        console.log(`${player.name} disconnected`);
        this.io.emit("message", `${player.name} left the game`);
        this.players.remove(socket.id);
    }
    handlePacket(socket, buffer) {
        
        const type = buffer.readUInt8(0)
        switch (type) {
            case 0: handleJoinPacket(socket, buffer); break;
        }
    }
}
