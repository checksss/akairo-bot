"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const moment = __importStar(require("moment"));
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
        const embed = new discord_js_1.MessageEmbed()
            .setColor([155, 200, 200])
            .setDescription(`**${this.client.user.username} Statistics**`)
            // @ts-ignore
            .addField('❯ Uptime', moment.duration(this.client.uptime).format('d[d ]h[h ]m[m ]s[s ]'), true)
            .addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
            .addField('❯ General Stats', common_tags_1.stripIndents `
                • Guilds: ${this.client.guilds.size}
                • Channels: ${this.client.channels.size}
            `, true)
            .addField('❯ Version', `v${version}`, true)
            .addField('❯ Library', '[discord.js](https://discord.js.org)[-akairo](https://github.com/1Computer1/discord-akairo)', true)
            .addField('❯ Source', '[GitHub](https://github.com/qwright10/akairo-bot-ts)', true)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter(`© 2019 ${owner.tag}`);
        return message.util.send(embed);
    }
}
exports.default = StatsCommand;
