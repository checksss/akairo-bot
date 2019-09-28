import { Command } from 'discord-akairo';
import { Message, MessageEmbed, User, WebSocketShard } from 'discord.js';
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
        const memAlloc = Math.round(process.memoryUsage().heapTotal  / 1024 / 1024);
        const memUsed = Math.round(process.memoryUsage().heapUsed  / 1024 / 1024);
        const memPercent = (memUsed / memAlloc * 100).toFixed(2);
        let userCount = 0;
        this.client.guilds.forEach(g => userCount += g.memberCount);
        const embed: MessageEmbed = new MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setDescription(`**${this.client.user!.username} Statistics**`)
            // @ts-ignore
            .addField('❯ Uptime', moment.duration(this.client.uptime!).format('d[d ]h[h ]m[m ]s[s ]'), true)
            .addField('❯ Memory Usage', `${memUsed}MB/${memAlloc}MB (${memPercent}%)`, true)
            .addField(
                '❯ General Stats',
                stripIndents`
                • Guilds: ${this.client.guilds.size}
                • Channels: ${this.client.channels.size}
                • Users: ${userCount}
            `, true)
            .addField('❯ Version', `v${version}`, true)
            .addField(
                '❯ Shards',
                `${this.client.ws.shards.map(s => {
                    return stripIndents`
                        ${s.id} • Status: ${shardStatus[s.status]} (${Math.round(s.ping)} ms)
                    `
                }).join('\n')}`,
                true)
            .addField(
                '❯ Invite',
                '[Discord](https://discordapp.com/api/oauth2/authorize?client_id=586995575686168595&permissions=8&scope=bot)',
                true
            )
            .setThumbnail(this.client.user!.displayAvatarURL())
            .setFooter(`© 2019 ${owner.tag}`);

        return message.util!.send(embed);
    }
}

const shardStatus: ShardStatus = {
    0: 'Ready',
    1: 'Connecting',
    2: 'Reconnecting',
    3: 'Idle',
    4: 'Nearly',
    5: 'Disconnected'
}

interface ShardStatus {
    [key: number]: string;
}