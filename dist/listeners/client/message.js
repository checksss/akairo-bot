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
        if (message.guild.member(this.client.user).permissions.has('USE_EXTERNAL_EMOJIS')) {
            const reactionDownloading = await this.client.settings.get(message.guild, 'reactionDownloading', false);
            if (!reactionDownloading || message.attachments.size < 1)
                return;
            if (message.attachments.first().size > 2 * 1024 * 1024)
                return;
            const emoji = this.client.emojis.get(this.client.constants.downloadEmoji);
            if (!emoji)
                return;
            message.react(emoji);
        }
    }
}
exports.default = MessageListener;
