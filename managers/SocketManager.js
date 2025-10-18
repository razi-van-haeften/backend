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
            console.log("client connected:", socket.id);

            // socket.on("join", (name) => this.handleJoin(socket, name));
            // socket.on("chat", (msg) => this.chat.handleChat(socket, msg));
            socket.on("disconnect", () => this.handleDisconnect(socket));
            socket.on("packet", (buffer) => this.handlePacket(socket, buffer));
        });
    }

    handleDisconnect(socket) {
        const player = this.players.get(socket.id);
        if (!player) {
            console.log(`${socket.id} disconnected`);
            return;
        }
        console.log(`${player.name} disconnected`);
        this.players.remove(socket.id);
    }

    joinNotification(socket, name){
        const type = Buffer.from([4]);
        const payload = Buffer.from(name, "utf8");
        this.sendPacket(type, payload, "else", socket);
    }

    handleJoinGame(socket, payload) {
        const name = payload.toString('utf8');
        const player = this.players.add(socket.id, name);
        console.log(player.name + " joined");
        this.joinNotification(socket, player.name);
    }

    handleChat(socket, payload) {
        const player = this.players.get(socket.id);
        const type = payload.readUInt8(0);
        const message = payload.slice(1).toString('utf8');
        const sender = player.name;
        console.log(`${player.name} said ${message}`);
    }

    handlePacket(socket, buffer) {
        const type = buffer.readUInt8(0);
        const payload = buffer.slice(1);

        switch (type) {
            case 0: this.handleJoinGame(socket, payload); break;    //client send name and joins
            case 5: this.handleChat(socket, payload); break;        //clint sends chat
        }
    }

    sendPacket(type, payload, scope, socket = null) {
        const buffer = Buffer.concat([type, payload]);
        if (scope == "all") {
            this.io.emit("packet", buffer);
        } else if (scope == "sender") {
            socket.emit("packet", buffer);
        } else if (scope == "else") {
            socket.broadcast.emit("packet", buffer);
        }
    }
}
