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
        const moderators = await this.client.settings.get(message.guild, 'moderators', [message.guild.owner.id]);
        const inviteReg = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gi;
        if (inviteReg.test(message.content) && !moderators.includes(message.author.id))
            message.delete();
        this.client.cache.set(message.id, message);
    }
}
exports.default = MessageListener;
