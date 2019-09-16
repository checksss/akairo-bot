import { Listener } from 'discord-akairo';
import { MessageEmbed, GuildMember, Message } from 'discord.js';

export default class GuildMemberAddListener extends Listener {
    public constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            category: 'client',
            event: 'guildMemberRemove'
        });
    }

    public async exec(member: GuildMember): Promise<Message | Message[] | void> {
        if (member.user.id === this.client.user!.id) return;
        let memberLog = member.guild.channels.get(await this.client.settings.get(member.guild, 'memberLog', ''));
        if (!memberLog && memberLog!.type !== 'text') return;

        const embed = new MessageEmbed()
            .setColor([245, 155, 55])
            .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter('User Left');

        // @ts-ignore
        return memberLog.send(embed);
    }
}