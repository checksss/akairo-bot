"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class MessageListener extends discord_akairo_1.Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            category: 'client',
            event: 'message'
        });
    }
    async exec(message) {
        this.client.cache.set(message.id, message);
    }
}
exports.default = MessageListener;
