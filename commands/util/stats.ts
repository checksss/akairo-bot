import { Command } from 'discord-akairo';
import { Message, MessageEmbed, User } from 'discord.js';
import { stripIndents } from 'common-tags';
import * as moment from 'moment';
import 'moment-duration-format';

const { version } = require('../../../package.json');

export default class StatsCommand extends Command {
    public constructor() {
        super('stats', {
            aliases: ['stats'],
            description: {
                content: 'Displays statistics about the bot.',
            },
            category: 'util',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2
        });
    }

    public async exec(message: Message): Promise<Message | Message[]> {
        const owner: User = await this.client.users.fetch(this.client.config.owner!);
        const embed: MessageEmbed = new MessageEmbed()
            .setColor([155, 200, 200])
            .setDescription(`**${this.client.user!.username} Statistics**`)
            // @ts-ignore
            .addField('❯ Uptime', moment.duration(this.client.uptime!).format('d[d ]h[h ]m[m ]s[s ]'), true)
            .addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
            .addField(
                '❯ General Stats',
                stripIndents`
                • Guilds: ${this.client.guilds.size}
                • Channels: ${this.client.channels.size}
            `, true)
            .addField('❯ Version', `v${version}`, true)
            .addField(
                '❯ Library',
                '[discord.js](https://discord.js.org)[-akairo](https://github.com/1Computer1/discord-akairo)',
                true)
            .addField(
                '❯ Source',
                '[GitHub](https://github.com/qwright10/akairo-bot-ts)',
                true
            )
            .setThumbnail(this.client.user!.displayAvatarURL())
            .setFooter(`© 2019 ${owner.tag}`);

        return message.util!.send(embed);
    }
}