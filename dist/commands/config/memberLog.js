"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class MemberLogChannelCommand extends discord_akairo_1.Command {
    constructor() {
        super('memberLog', {
            aliases: ['memberLog'],
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
                    'set #welcome',
                    'set 584443374283653171',
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
            const memberLog = await this.client.settings.get(message.guild, 'memberLog', '');
            if (memberLog === '')
                return message.util.send('No member log text channel is set.');
            return message.util.send(`\`${message.guild.name}\`'s member log text channel is set to \`${memberLog.name}\``);
        }
        else if (method === 'set') {
            await this.client.settings.set(message.guild, 'memberLog', channel.id);
            return message.util.send(`\`${message.guild.name}\`'s member log text channel is now \`${channel.name}\``);
        }
        else if (method === 'clear') {
            await this.client.settings.set(message.guild, 'memberLog', '');
            return message.util.send(`\`${message.guild.name}\`'s member log text channel was cleared.`);
        }
        else {
            const prefix = await this.handler.prefix(message);
            return message.util.send(common_tags_1.stripIndents `
                    That method doesn't exist on \`memberLog\`;
                    Try \`${prefix}help memberLog\` for help.`);
        }
    }
}
exports.default = MemberLogChannelCommand;
