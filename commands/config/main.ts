import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class MainChannelCommand extends Command {
    public constructor() {
        super('main', {
            aliases: ['main'],
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
                    default: (message: Message): any => message.channel
                }
            ]
        });
    }

    public async exec(message: Message, { method, channel }: { method: string, channel: TextChannel }): Promise<Message | Message[]> {
        if (method === 'get') {
            const mainChannel: string | TextChannel = await this.client.settings.get(message.guild!, 'mainChanel', '');
            if (mainChannel === '') return message.util!.send('No main text channel is set.');
            return message.util!.send(`\`${message.guild!.name}\`'s main text channel is set to \`${(mainChannel as TextChannel).name}\``);
        } else if (method === 'set') {
            await this.client.settings.set(message.guild!, 'mainChannel', channel.id);
            return message.util!.send(`\`${message.guild!.name}\`'s main text channel is now \`${channel.name}\``);
        } else if (method === 'clear') {
            await this.client.settings.set(message.guild!, 'mainChannel', '');
            return message.util!.send(`\`${message.guild!.name}\`'s main text channel was cleared.`);
        } else {
            const prefix = await (this.handler.prefix as PrefixSupplier)(message);
            return message.util!.send(stripIndents`
                    That method doesn't exist on \`main\`;
                    Try \`${prefix}help main\` for help.`);
        }
    }
}