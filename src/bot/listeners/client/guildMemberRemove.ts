import { Listener } from 'discord-akairo';
import { MessageEmbed, GuildMember, Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class GuildMemberAddListener extends Listener {
    public constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            category: 'client',
            event: 'guildMemberRemove'
        });
    }

    public async exec(member: GuildMember): Promise<Message | Message[] | void> {
        let memberLog = await this.client.settings.get(member.guild, 'memberLog', undefined);
        const prefix = await this.client.settings.get(member.guild!, 'prefix', ';');
        if (!/(\d){18}/.test(memberLog)) return;
        memberLog = member.guild.channels.cache.get(memberLog);

        const clientPerms = memberLog.permissionsFor(this.client.user!);
        if (!clientPerms!.has('SEND_MESSAGES') || !clientPerms!.has('EMBED_LINKS')) return member.guild.owner!.send(stripIndents`
            I don\'t have permission to send messages/embeds in \`${member.guild.name}\`'s
            member log. You can turn off member logging by using \`${prefix}memberLog clear\`
            in any of \`${member.guild.name}\`'s text channels.`);

        const embed = new MessageEmbed()
            .setColor(this.client.constants.memberRemove)
            .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter('User Left');
        
        // @ts-ignore
        if (memberLog.type === 'text') return memberLog.send(embed);
    }
}