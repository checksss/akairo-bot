import { Command } from 'discord-akairo';
import { Message, MessageEmbed, GuildChannel, DMChannel, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';
import pascalCase from 'pascal-case';
import * as moment from 'moment';
import 'moment-duration-format';

export default class ChannelInfoCommand extends Command {
    public constructor() {
        super('channel', {
            aliases: ['channel', 'channel-info'],
            description: {
                content: 'Gets info about a channel',
                usage: '[channel]',
                examples: ['#general', 'general', '542170263115137025']
            },
            category: 'info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'channel',
                    match: 'content',
                    type: 'channel',
                    default: (message: Message): GuildChannel | DMChannel => message.channel
                }
            ]
        });
    }

    public async exec(message: Message, { channel }: { channel: TextChannel }): Promise<Message | Message[]> {
        const embed = new MessageEmbed()
            .setColor([155, 200, 200])
            .setDescription(`Info about **${channel.name}**`)
            .addField(
                '❯ Info',
                stripIndents`
                • Type: ${pascalCase(channel.type)}
				• Topic: ${channel.topic ? channel.topic : 'None'}
				• NSFW: ${channel.nsfw ? 'Yes' : 'No'}
				• Creation Date: ${moment.utc(channel.createdAt).format('YYYY/MM/DD hh:mm:ss')}
			    `
            )
            .setThumbnail(message.guild!.iconURL()!);

        return message.util!.send(embed);
    }
}
