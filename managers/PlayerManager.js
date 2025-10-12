import { Player } from "../models/Player.js";

export class PlayerManager {
    constructor() {
        this.players = {};
    }

    add(id, name) {
        const player = new Player(id, name);
        this.players[id] = player;
        return player;
    }

    get(id) {
        return this.players[id];
    }

    remove(id) {
        delete this.players[id];
    }

    all() {
        return Object.values(this.players);
    }
}
