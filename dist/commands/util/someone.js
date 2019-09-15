"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class SomeoneCommand extends discord_akairo_1.Command {
    constructor() {
        super('someone', {
            aliases: ['someone'],
            description: {
                content: 'Mentions a random, online guild member.'
            },
            category: 'util',
            channel: 'guild',
            ratelimit: 1,
            cooldown: 10000
        });
    }
    async exec(message) {
        const member = message.guild.members.filter(m => {
            return !m.user.bot && m.user.presence.status === 'online' && m.id !== message.author.id;
        }).random();
        if (!member)
            return message.util.reply('nobody is online');
        return message.util.send(`${member}`);
    }
}
exports.default = SomeoneCommand;
