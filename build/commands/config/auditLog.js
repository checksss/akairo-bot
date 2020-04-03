"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class AuditLogChannelCommand extends discord_akairo_1.Command {
    constructor() {
        super('auditLog', {
            aliases: ['auditLog'],
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
                    'set #stats',
                    'set 584443374283653171',
                    'clear'
                ]
            },
            category: 'config',
            ratelimit: 2,
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ownerOnly: true,
            args: [
                {
                    id: 'method',
                    type: 'lowercase',
                    default: 'get'
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
            const auditLog = await this.client.settings.get('0', 'modLog', '');
            if (auditLog === '' || !this.client.channels.cache.has(auditLog.id))
                return message.util.send('No audit log text channel is set.');
            return message.util.send(`${this.client.user}'s audit log text channel is set to \`${auditLog.name}\``);
        }
        else if (method === 'set') {
            await this.client.settings.set('0', 'modLog', channel.id);
            return message.util.send(`${this.client.user} audit log text channel is now \`${channel.name}\``);
        }
        else if (method === 'clear') {
            await this.client.settings.set('0', 'modLog', '');
            return message.util.send(`${this.client.user}'s audit log text channel was cleared.`);
        }
        else {
            const prefix = await this.handler.prefix(message);
            return message.util.send(common_tags_1.stripIndents `
                    That method doesn't exist on \`auditLog\`;
                    Try \`${prefix}help auditLog\` for help.`);
        }
    }
}
exports.default = AuditLogChannelCommand;
//# sourceMappingURL=auditLog.js.map