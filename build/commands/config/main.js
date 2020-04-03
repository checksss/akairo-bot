"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class MainChannelCommand extends discord_akairo_1.Command {
    constructor() {
        super('main', {
            aliases: ['main'],
            description: {
                content: common_tags_1.stripIndents `Available methods:
                 • get
                 • set [channel]
                 • clear
                Optional: \`[]\``,
                usage: '<method> [channel]',
                examples: [
                    'get',
                    'set',
                    'set #hang-out',
                    'set 590754805090222100',
                    'clear'
                ]
            },
            category: 'config',
            ratelimit: 2,
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'method',
                    type: 'lowercase'
                },
                {
                    id: 'channel',
                    type: 'textChannel',
                    default: (message) => message.channel
                }
            ]
        });
    }
    async exec(message, { method, channel }) {
        if (method === 'get') {
            const mainChannel = await this.client.settings.get(message.guild, 'mainChanel', '');
            if (mainChannel === '')
                return message.util.send('No main text channel is set.');
            return message.util.send(`\`${message.guild.name}\`'s main text channel is set to \`${mainChannel.name}\``);
        }
        else if (method === 'set') {
            await this.client.settings.set(message.guild, 'mainChannel', channel.id);
            return message.util.send(`\`${message.guild.name}\`'s main text channel is now \`${channel.name}\``);
        }
        else if (method === 'clear') {
            await this.client.settings.set(message.guild, 'mainChannel', '');
            return message.util.send(`\`${message.guild.name}\`'s main text channel was cleared.`);
        }
        else {
            const prefix = await this.handler.prefix(message);
            return message.util.send(common_tags_1.stripIndents `
                    That method doesn't exist on \`main\`;
                    Try \`${prefix}help main\` for help.`);
        }
    }
}
exports.default = MainChannelCommand;
//# sourceMappingURL=main.js.map