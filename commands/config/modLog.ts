import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class ModLogChannelCommand extends Command {
    public constructor() {
        super('modLog', {
            aliases: ['modLog'],
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
                    'set #logs',
                    'set 584900639365267465',
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
                    default: (message: Message): any => message.channel
                }
            ]
        });
    }

    public async exec(message: Message, { method, channel }: { method: string, channel: TextChannel }): Promise<Message | Message[]> {
        if (method === 'get') {
            const modLog: string | TextChannel = await this.client.settings.get(message.guild!, 'modLog', '');
            if (modLog === '') return message.util!.send('No mod log channel is set.');
            return message.util!.send(`\`${message.guild!.name}\`'s mod log channel is set to \`${(modLog as TextChannel).name}\``);
        } else if (method === 'set') {
            await this.client.settings.set(message.guild!, 'modLog', channel.id);
            return message.util!.send(`\`${message.guild!.name}\`'s mod log text channel is now \`${channel.name}\``);
        } else if (method === 'clear') {
            await this.client.settings.set(message.guild!, 'modLog', '');
            return message.util!.send(`\`${message.guild!.name}\`'s mod log text channel was cleared.`);
        } else {
            const prefix = await (this.handler.prefix as PrefixSupplier)(message);
            return message.util!.send(stripIndents`
                    That method doesn't exist on \`modLog\`;
                    Try \`${prefix}help modLog\` for help.`);
        }
    }
}