"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class MessageReactionAddListener extends discord_akairo_1.Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            category: 'client',
            event: 'messageReactionAdd'
        });
    }
    async exec(reaction, user) {
        if (reaction.emoji.name !== '🗑' || user.bot)
            return;
        if (reaction.message.createdTimestamp - Date.now() > 1209.6e6 || !reaction.message.deletable)
            return;
        if (reaction.message.channel.type === 'dm')
            return reaction.message.delete();
        const guildOwner = await this.client.users.fetch(reaction.message.guild.ownerID);
        const moderators = await this.client.settings.get(reaction.message.guild, 'moderators', [guildOwner.id]);
        if (reaction.message.author.id !== user.id && !moderators.includes(user.id))
            return;
        return reaction.message.delete();
    }
}
exports.default = MessageReactionAddListener;
