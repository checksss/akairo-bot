"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const express_1 = require("express");
class MessageReactionAddListener extends discord_akairo_1.Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            category: 'client',
            event: 'messageReactionAdd'
        });
    }
    async exec(reaction, user) {
        const custom = reaction.emoji.createdAt ? true : false;
        if (!user.bot && custom && reaction.emoji.id === this.client.constants.downloadEmoji) {
            const command = this.client.commandHandler.modules.get('upload');
            return this.client.commandHandler.runCommand(reaction.message, command, [express_1.response]);
        }
        if (reaction.emoji.name !== '🗑' || user.bot)
            return;
        if (!reaction.message.deletable)
            return;
        if (reaction.message.channel.type === 'dm')
            return reaction.message.delete();
        const guildOwner = await this.client.users.fetch(reaction.message.guild.ownerID);
        const moderators = await this.client.settings.get(reaction.message.guild, 'moderators', [guildOwner.id]);
        const clientMember = await reaction.message.guild.members.fetch(this.client.user.id);
        if (reaction.message.author.id !== this.client.user.id && !clientMember.permissions.has('MANAGE_MESSAGES'))
            return;
        if (reaction.message.author.id !== user.id && !moderators.includes(user.id))
            return;
        return reaction.message.delete();
    }
}
exports.default = MessageReactionAddListener;
