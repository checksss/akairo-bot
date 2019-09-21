import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class AuditLogChannelCommand extends Command {
    public constructor() {
        super('auditLog', {
            aliases: ['auditLog'],
            description: {
                content: stripIndents`Available methods:
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
                    default: (message: Message): any => message.channel
                }
            ]
        });
    }

    public async exec(message: Message, { method, channel }: { method: string, channel: TextChannel }): Promise<Message | Message[]> {
        if (method === 'get') {
            const auditLog: string | TextChannel = await this.client.settings.get('0', 'modLog', '');
            if (auditLog === '' || !this.client.channels.has((auditLog as TextChannel).id)) return message.util!.send('No audit log text channel is set.');
            return message.util!.send(`${this.client.user}'s audit log text channel is set to \`${(auditLog as TextChannel).name}\``);
        } else if (method === 'set') {
            await this.client.settings.set('0', 'modLog', channel.id);
            return message.util!.send(`${this.client.user} audit log text channel is now \`${channel.name}\``);
        } else if (method === 'clear') {
            await this.client.settings.set('0', 'modLog', '');
            return message.util!.send(`${this.client.user}'s audit log text channel was cleared.`);
        } else {
            const prefix = await (this.handler.prefix as PrefixSupplier)(message);
            return message.util!.send(stripIndents`
                    That method doesn't exist on \`auditLog\`;
                    Try \`${prefix}help auditLog\` for help.`);
        }
    }
}