import { Listener } from 'discord-akairo';
import { MessageEmbed, GuildMember, Message } from 'discord.js';

export default class GuildMemberAddListener extends Listener {
    public constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            category: 'client',
            event: 'guildMemberAdd'
        });
    }

    public async exec(member: GuildMember): Promise<Message | Message[] | void> {
        let memberLog = member.guild.channels.get(await this.client.settings.get(member.guild, 'memberLog', ''));
        if (!memberLog && memberLog!.type !== 'text') return;

        const embed = new MessageEmbed()
            .setColor([135, 235, 75])
            .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter('User Joined');
        
        // @ts-ignore
        return memberLog.send(embed);
    }
}