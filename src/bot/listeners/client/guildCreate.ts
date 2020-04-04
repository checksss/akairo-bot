import { Listener } from 'discord-akairo';
import { Guild, TextChannel, MessageEmbed, Message } from 'discord.js';
import { SettingsData } from '../../structures/entities/Settings';
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
        return this.client.settings.guild(guild, {});
        if (this.client.settings.items.has(guild.id)) {
            await this.client.settings.clear(guild);
        }
        const guildGeneral = guild.channels.cache.filter(c => c.type === 'text').filter(c => {
            return c.name === 'general' || c.name === 'chat' || c.name === 'main';
        }).first();

        const updateChannel = this.client.channels.cache.get(await this.client.settings.get('global', 'modLog', ''));
        const guildOwner = await this.client.users.fetch(guild.ownerID);
        const logEmbed = new MessageEmbed()
            .setColor(this.client.constants.guildAdd)
            .setAuthor(guild.name, guild.iconURL()!)
            .addField('ID', guild.id, true)
            .addField('Name', guild.name, true)
            .addField('Owner', guildOwner.tag, true)
            .addField('Region', guild.region, true)
            .addField('Channels', guild.channels.cache.size, true)
            .addField('Members', guild.members.cache.size, true)
            .addField('Humans', `~${guild.members.cache.filter(m => !m.user!.bot).size}`, true)
            .addField('Bots', `~${guild.members.cache.filter(m => m.user!.bot).size}`, true)
            .addField('​', '​', true)
            .setFooter('Joined Guild')
            .setTimestamp(Date.now());

        if (updateChannel && updateChannel!.type === 'text') (updateChannel as TextChannel).send(logEmbed);
        

        await this.client.settings.create(guild, {

        }).catch((err: any): Promise<Message> => {
            if (err) this.client.logger.error(`Settings for ${guild.name} (${guild.id}) - ${guild.owner!.user.tag} couldn't be created`);

            const embed = new MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .setAuthor(this.client.user!.tag, this.client.user!.displayAvatarURL())
                .setTimestamp(Date.now());

            if (guildGeneral) {
                embed.setTitle('Main Text Channel Set')
                    .setDescription(stripIndents`
                    ${guildGeneral} has been set as the guild's
                    main text channel. If this is incorrect,
                    please use \`${process.env.prefix}main set\` in \`${guild.name}\`.`)
                    .setFooter('Main Channel Set');
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