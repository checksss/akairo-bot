"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class PrefixCommand extends discord_akairo_1.Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            description: {
                content: 'Displays or changes the prefix of the guild',
                usage: '[prefix]',
                examples: ['*', ';']
            },
            category: 'util',
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 2,
            args: [
                {
                    id: 'prefix',
                    type: 'string'
                }
            ]
        });
    }
    async exec(message, { prefix }) {
        if (!prefix)
            return message.util.send(`The current prefix is: \`${await this.handler.prefix(message)}\``);
        await this.client.settings.set(message.guild, 'prefix', prefix);
        if (prefix === process.env.prefix)
            return message.util.reply(`the prefix has been reset to \`${prefix}\``);
        return message.util.send(`the prefix has been set to \`${prefix}\``);
    }
}
exports.default = PrefixCommand;
