import { Command } from 'discord-akairo';
import { Message, MessageEmbed, GuildMember } from 'discord.js';
import { Tags } from '../../structures/models/Tags';

export default class TagListCommand extends Command {
    public constructor() {
        super('tag-list', {
            aliases: ['tags'],
            description: {
                content: 'Lists all server tags.'
            },
            category: 'tags',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ]
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | Message[]> {
        if (member) {
            const tags = await Tags.find({ user: member.id, guild: message.guild!.id }).lean();
            if (!tags.length) {
                if (member.id === message.author!.id) return message.util!.reply('you don\'t have any tags.');
                return message.util!.reply(`**${member.displayName}** doesn't have any tags.`);
            }

            const embed = new MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .setAuthor(`**${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
                .setDescription(
                    tags.map((tag: any) => `\`${tag.name}\``)
                        .sort()
                        .join(', ')
                );

            return message.util!.send(embed);
        }

        const tags = await Tags.find({ guild: message.guild!.id });
        if (!tags.length) return message.util!.send(`**${message.guild!.name}** doesn't have any tags.`);
        const guildTags = tags.map((tag: any) => `\`${tag.name}\``)
            .sort()
            .join(', ');
        const userTags = tags.filter((tag: any) => tag.user === message.author!.id)
            .map((tag: any) => `\`${tag.name}\``)
            .sort()
            .join(', ');
        const embed = new MessageEmbed()
            .setColor([155, 200, 200])
            .setAuthor(`${message.author!.tag} (${message.author!.id})`, message.author!.displayAvatarURL());
        if (guildTags) embed.addField('❯ Tags', guildTags);
        if (userTags) embed.addField(`❯ ${message.member!.displayName}'s tags`, userTags);

        return message.util!.send(embed);
            
    }
}