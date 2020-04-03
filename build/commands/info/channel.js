"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const moment_1 = tslib_1.__importDefault(require("moment"));
require("moment-duration-format");
class ChannelInfoCommand extends discord_akairo_1.Command {
    constructor() {
        super('channel', {
            aliases: ['channel', 'channel-info'],
            description: {
                content: 'Gets info about a channel',
                usage: '[channel]',
                examples: ['#general', 'general', '542170263115137025']
            },
            category: 'info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'channel',
                    match: 'content',
                    type: 'channel',
                    default: (message) => message.channel
                }
            ]
        });
    }
    async exec(message, { channel }) {
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setDescription(`Info about **${channel.name}**`)
            .addField('❯ Info', common_tags_1.stripIndents `
                • Type: ${channel.type}
				• Topic: ${channel.topic ? channel.topic : 'None'}
				• NSFW: ${channel.nsfw ? 'Yes' : 'No'}
				• Creation Date: ${moment_1.default.utc(channel.createdAt).format('YYYY/MM/DD hh:mm:ss')}
			    `)
            .setThumbnail(message.guild.iconURL());
        return message.util.send(embed);
    }
}
exports.default = ChannelInfoCommand;
//# sourceMappingURL=channel.js.map