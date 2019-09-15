import { Listener } from 'discord-akairo';
import { Guild, GuildChannel, TextChannel, MessageEmbed, Message } from 'discord.js'
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
        if (this.client.settings.items.has(guild.id)) this.client.settings.clear(guild);
        const guildGeneral: GuildChannel | undefined = guild.channels.filter(c => c.type === 'text').filter(c => {
            return c.name === 'general' || c.name === 'chat' || c.name === 'main';
        }).first();

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
            moderators: [guild.owner!.id]
        }, (err: any): Promise<Message> => {
            if (err) return (guildGeneral as TextChannel).send('There was an error created guild settings.');

            const embed = new MessageEmbed()
                .setColor([155, 200, 200])
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
                Please respond with \`\`?main set\`\` in
                \`\`${guild.name}\`\`'s main text channel
                **ex: _?main set_ in #the-lounge**`);
                embed.setFooter('Error');
            }

            return guild.owner!.send(embed);
        });
    }
}