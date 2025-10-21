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

    handleJoinGame(socket, payload) {
        const name = payload.toString('utf8');
        const id = Buffer.from(socket.id, 'utf8');
        const player = this.players.add(socket.id, name);
        const buffer = Buffer.concat([id, name]);
        console.log(player.name + " joined");

        this.sendPacket(4, buffer, "all", socket);
    }

    handleChat(socket, payload) {
        const dlm = Buffer.from([31]);
        const player = this.players.get(socket.id);
        const type = payload.readUInt8(0);
        var buffer = payload.slice(1);
        const message = buffer.toString('utf8');
        const sender = Buffer.from(player.name, 'utf8');
        buffer = Buffer.concat([sender, dlm, buffer]);
        console.log(buffer);
        this.sendPacket(5, buffer, "all", socket);
        console.log(`${player.name} said: ${message}`);
    }

    handlePacket(socket, buffer) {
        const type = buffer.readUInt8(0);
        const payload = buffer.slice(1);

        switch (type) {
            case 0: this.handleJoinGame(socket, payload); break;    //client send name and joins
            case 5: this.handleChat(socket, payload); break;        //client sends chat
        }
    }

    sendPacket(type, payload, scope, socket = null) {
        const type_b = Buffer.from([type]);
        const buffer = Buffer.concat([type_b, payload]);
        if (scope == "all") {
            this.io.emit("packet", buffer);
        } else if (scope == "sender") {
            socket.emit("packet", buffer);
        } else if (scope == "else") {
            socket.broadcast.emit("packet", buffer);
        }
    }
}
