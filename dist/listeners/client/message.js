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
        if (message.author.id === this.client.user.id && (message.embeds.length > 0 || message.attachments.size > 0)) {
            message.react('🗑').then(m => {
                this.client.setTimeout(() => {
                    if (!m.message.deleted)
                        m.users.remove(this.client.user);
                }, 5000);
            });
        }
        this.client.cache.set(message.id, message);
    }
}
exports.default = MessageListener;
