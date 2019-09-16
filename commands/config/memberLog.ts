import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class MemberLogChannelCommand extends Command {
    public constructor() {
        super('memberLog', {
            aliases: ['memberLog'],
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
                    default: (message: Message): any => message.channel
                }
            ]
        });
    }

    public async exec(message: Message, { method, channel }: { method: string, channel: TextChannel }): Promise<Message | Message[]> {
        if (method === 'get') {
            const memberLog: string | TextChannel = await this.client.settings.get(message.guild!, 'memberLog', '');
            if (memberLog === '') return message.util!.send('No member log text channel is set.');
            return message.util!.send(`\`${message.guild!.name}\`'s member log text channel is set to \`${(memberLog as TextChannel).name}\``);
        } else if (method === 'set') {
            await this.client.settings.set(message.guild!, 'memberLog', channel.id);
            return message.util!.send(`\`${message.guild!.name}\`'s member log text channel is now \`${channel.name}\``);
        } else if (method === 'clear') {
            await this.client.settings.set(message.guild!, 'memberLog', '');
            return message.util!.send(`\`${message.guild!.name}\`'s member log text channel was cleared.`);
        } else {
            const prefix = await (this.handler.prefix as PrefixSupplier)(message);
            return message.util!.send(stripIndents`
                    That method doesn't exist on \`memberLog\`;
                    Try \`${prefix}help memberLog\` for help.`);
        }
    }
}