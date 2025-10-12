export class ChatManager {
    constructor(io, playerManager) {
        this.io = io;
        this.players = playerManager;
    }

    handleChat(socket, msg) {
        const player = this.players.get(socket.id);
        if (!player) return;
        msg = msg.trim();
        if (!msg) return;
        console.log(`${player.name}: ${msg}`);
        this.io.emit("chat", `${player.name}: ${msg}`);
    }
}
