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

    

    handleDisconnect(socket) {
        const player = this.players.get(socket.id);
        if (!player) {
            console.log(`${socket.id} disconnected`);
            return;
        }
        console.log(`${player.name} disconnected`);
        this.io.emit("message", `${player.name} left the game`);
        this.players.remove(socket.id);
    }

    joinNotification(socket, name){
        const type = Buffer.from([4]);
        const payload = Buffer.from(name, "utf8");
        this.sendPacket(type, payload, "else");
    }

    handleJoinGame(socket, payload) {
        const name = payload.toString('utf8');
        const player = this.players.add(socket.id, name);
        console.log(`${player.name} joined the game using packet`);
        this.joinNotification(socket, player.name);
    }

    handlePacket(socket, buffer) {
        const type = buffer.readUInt8(0);
        const payload = buffer.slice(1);

        switch (type) {
            case 0: handleJoinGame(socket, payload); break;
        }
    }

    sendPacket(type, payload, scope, socket = null) {
        const buffer = Buffer.concat([type, payload]);
        console.log(buffer);
        if (scope == "all") {
            this.io.emit("packet", buffer);
        } else if (scope == "sender") {
            socket.emit("packet", buffer);
        } else if (scope == "else") {
            socket.broadcast.emit("packet", buffer);
        }
    }
}
