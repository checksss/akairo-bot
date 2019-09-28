import { Listener } from 'discord-akairo';
import { Message, Guild, MessageEmbed, TextChannel } from 'discord.js';

export default class GuildDeleteListener extends Listener {
    public constructor() {
        super('guildDelete', {
            emitter: 'client',
            category: 'client',
            event: 'guildDelete'
        });
    }

    public async exec(guild: Guild): Promise<Message | Message[] | void> {
        const updateChannel = this.client.channels.get(await this.client.settings.get('global', 'modLog', ''));
        const embed = new MessageEmbed()
            .setColor(this.client.constants.guildRemove)
            .setAuthor(guild.name, guild.iconURL()!)
            .addField('ID', guild.id, true)
            .addField('Name', guild.name, true)
            .addField('Owner', guild.owner!.user.tag, true)
            .addField('Region', guild.region, true)
            .addField('Channels', guild.channels.size, true)
            .addField('Members', guild.members.size, true)
            .addField('Humans', guild.members.filter(m => !m.user!.bot).size, true)
            .addField('Bots', guild.members.filter(m => m.user!.bot).size, true)
            .addBlankField(true)
            .setFooter('Left Guild')
            .setTimestamp(Date.now());

        if (!updateChannel || updateChannel.type !== 'text') return;
        return (updateChannel as TextChannel).send(embed);
    }
}