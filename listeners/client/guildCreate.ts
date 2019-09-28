import { Listener } from 'discord-akairo';
import { Guild, GuildChannel, GuildMember, TextChannel, MessageEmbed, Message } from 'discord.js'
import Settings from '../../structures/models/Settings';
import { stripIndents } from 'common-tags';

export default class GuildCreateListener extends Listener {
    public constructor() {
        super('guildCreate', {
            emitter: 'client',
            category: 'client',
            event: 'guildCreate'
        });
    }

    public async exec(guild: Guild): Promise<void> {
        if (this.client.settings.items.has(guild.id)) {
            await this.client.settings.clear(guild);
            await Settings.deleteOne({ guild: guild.id });
        }
        const guildGeneral: GuildChannel | undefined = guild.channels.filter(c => c.type === 'text').filter(c => {
            return c.name === 'general' || c.name === 'chat' || c.name === 'main';
        }).first();

        const updateChannel = this.client.channels.get(await this.client.settings.get('global', 'modLog', ''));
        const guildOwner = await this.client.users.fetch(guild.ownerID);
        const logEmbed = new MessageEmbed()
            .setColor(this.client.constants.guildAdd)
            .setAuthor(guild.name, guild.iconURL()!)
            .addField('ID', guild.id, true)
            .addField('Name', guild.name, true)
            .addField('Owner', guildOwner.tag, true)
            .addField('Region', guild.region, true)
            .addField('Channels', guild.channels.size, true)
            .addField('Members', guild.members.size, true)
            .addField('Humans', `~${guild.members.filter(m => !m.user!.bot).size}`, true)
            .addField('Bots', `~${guild.members.filter(m => m.user!.bot).size}`, true)
            .addBlankField(true)
            .setFooter('Joined Guild')
            .setTimestamp(Date.now());

        if (updateChannel && updateChannel.type === 'text') (updateChannel as TextChannel).send(logEmbed);
        

        await Settings.create({
            id: guild.id,
            name: guild.name,
            prefix: process.env.prefix,
            filterProfanity: false,
            mainChannel: guildGeneral ? guildGeneral.id : '',
            memberLog: '',
            modLog: '',
            tokenFiltering: true,
            blacklist: [],
            moderators: [guildOwner.id]
        }, (err: any): Promise<Message> => {
            if (err) this.client.logger.error(`Settings for ${guild.name} (${guild.id}) - ${guild.owner!.user.tag} couldn't be created`);

            const embed = new MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .setAuthor(this.client.user!.tag, this.client.user!.displayAvatarURL())
                .setTimestamp(Date.now());

            if (guildGeneral) {
                embed.setTitle('Main Text Channel Set')
                embed.setDescription(stripIndents`
                    ${guildGeneral} has been set as the guild's
                    main text channel. If this is incorrect,
                    please use \`${process.env.prefix}main set\` in \`${guild.name}\`.`)
                embed.setFooter('Main Channel Set');
            } else {
                embed.setTitle('Can\'t find main text channel');
                embed.setDescription(stripIndents`
                Please send \`\`;main set\`\` in
                \`\`${guild.name}\`\`'s main text channel
                **ex: _;main set_ in #the-lounge**`);
                embed.setFooter('Error');
            }

            return guild.owner!.send(embed);
        });
    }
}