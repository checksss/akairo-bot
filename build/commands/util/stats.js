"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const moment_1 = tslib_1.__importDefault(require("moment"));
require("moment-duration-format");
const { version } = require('../../../package.json');
class StatsCommand extends discord_akairo_1.Command {
    constructor() {
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
    async exec(message) {
        const owner = await this.client.users.fetch(this.client.config.owner);
        const online = this.client.emojis.cache.get(this.client.constants.shardOnlineEmoji);
        const offline = this.client.emojis.cache.get(this.client.constants.shardOfflineEmoji);
        const memAlloc = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
        const memUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const memPercent = (memUsed / memAlloc * 100).toFixed(2);
        const userCount = this.client.guilds.cache.reduce((m, g) => m + g.memberCount, 0);
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setDescription(`**${this.client.user.username} Statistics**`)
            .addField('❯ Uptime', moment_1.default.duration(this.client.uptime).format('d[d ]h[h ]m[m ]s[s ]'), true)
            .addField('❯ Memory Usage', `${memUsed}MB/${memAlloc}MB (${memPercent}%)`, true)
            .addField('❯ General Stats', common_tags_1.stripIndents `
                • Guilds: ${this.client.guilds.cache.size}
                • Channels: ${this.client.channels.cache.size}
                • Users: ${userCount}
            `, true)
            .addField('❯ Version', `v${version}`, true)
            .addField('❯ Shards', `${this.client.ws.shards.map(s => {
            return common_tags_1.stripIndents `
                        ${s.status === 0 ? online : offline} ${s.id} • Status: ${shardStatus[s.status]} (${Math.round(s.ping)} ms)
                    `;
        }).join('\n')}`, true)
            .addField('❯ Invite', '[Discord](https://discordapp.com/api/oauth2/authorize?client_id=586995575686168595&permissions=8&scope=bot)', true)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter(`© 2019 ${owner.tag}`);
        return message.util.send(embed);
    }
}
exports.default = StatsCommand;
const shardStatus = {
    0: 'Ready',
    1: 'Connecting',
    2: 'Reconnecting',
    3: 'Idle',
    4: 'Nearly',
    5: 'Disconnected'
};
//# sourceMappingURL=stats.js.map