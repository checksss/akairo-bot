import { Argument, Command } from 'discord-akairo';
import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class BanCommand extends Command {
    public constructor() {
        super('ban', {
            aliases: ['ban'],
            description: {
                content: 'Bans a mermber.',
                usage: '<member> [reason]',
                examples: ['@meatloaf dispenser', '@NEP.jpeg annoying'],
            },
            category: 'mod',
            clientPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
            args: [
                {
                    id: 'member',
                    type: Argument.union('member', async (_, phrase) => {
                        const m = await this.client.users.fetch(phrase);
                        if (m) return { id: m.id, user: m };
                        return null;
                    }),
                    prompt: {
                        start: (message: Message): string => `${message.author}, who would you like to ban?`,
                        retry: (message: Message): string => `${message.author}, please mention a valid member.`,
                    },
                },
                {
                    id: 'reason',
                    match: 'rest',
                    default: ''
                },
            ],
        });
    }

    public async exec(message: Message, { member, reason }: { member: GuildMember, reason: string }): Promise<Message | Message[]> {
        const guildOwner = await this.client.users.fetch(message.guild!.ownerID);
        const moderators: string[] = await this.client.settings.get(message.guild!, 'moderators', [guildOwner.id]);
        const cM = await message.guild!.members.fetch(this.client.user!.id); // The client's member
        const mM = await message.guild!.members.fetch(message.author!.id); // The message author's

        if (!cM.permissions.has('BAN_MEMBERS')) return message.util!.reply('I\'m not allowed to ban members.');
        if (!moderators.includes(message.author!.id)) return message.util!.reply('only moderators can ban members.');
        if (member.user.id === cM.user.id) return message.util!.reply('you can\'t ban me.');
        if (message.author!.id === member.user.id) return message.util!.reply('you can\'t ban yourself.');
        if (member.roles.highest.position >= mM!.roles.highest.position) return message.util!.reply('you can\'t ban members with roles equal to or higher than you.');
        if (member.roles.highest.position >= cM.roles.highest.position) return message.util!.reply(`my highest role is equal to or lower than ${member}'s highest role.`);
        if (!member.bannable) return message.util!.send(`${member} isn't bannable for some reason.`);

        let msg = await message.util!.send(`Are you sure you want to ban ${member}? Y/N`);
        const responses = await msg.channel.awaitMessages((r: Message) => r.author!.id === mM!.id, { max: 1, time: 30000 });
        if (!responses || responses.size < 1) return message.util!.send('Request timed out.');
        const response = responses.first();

        if (/^y(?:e(?:a|s)?)?$/i.test(response!.content)) {
            msg.edit(`Banning **${member.user.tag}**`);
        } else {
            return message.util!.reply('ban cancelled.');
        }

        try {
            try {
                await member.send(stripIndents`
                    **You have been banned from ${message.guild!.name}**
                    ${reason ? `\n**Reason:** ${reason}\n` : ''}
                    You can appeal your ban by DMing \`${guildOwner.tag}\``);
            } catch {}
            await member.ban({ reason: `Banned by ${mM!.user.tag}` });
        } catch {
            try {
                await message.guild!.members.ban(member.id, { reason: `Banned by ${message.author!.tag}` });
            } catch (error) {
                return message.util!.reply(`something went wrong: \`${error}\`.`);
            }
        }

        const modLog = await this.client.settings.get(message.guild!, 'modLog', '');
        if (modLog !== '') {
            const embed = new MessageEmbed()
                .setColor(this.client.constants.banAdd)
                .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
                .setDescription(stripIndents`
                    **Action**: Ban
                    **Reason:** ${reason ? reason : 'No reason'}
                `)
                .setFooter('Member Banned')
                .setTimestamp(Date.now());

            await (message.guild!.channels.get(modLog)! as TextChannel).send(embed);
        }

        return msg.edit(`Successfully banned **${member.user.tag}**`);
    }
}