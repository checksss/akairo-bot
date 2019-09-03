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
const emojis = __importStar(require("node-emoji"));
const punycode = require('punycode');
const emojiRegex = /<(?:a)?:(?:\w{2,32}):(\d{17,19})>?/;
class EmojiInfoCommand extends discord_akairo_1.Command {
    constructor() {
        super('emoji', {
            aliases: ['emoji', 'emoji-info'],
            description: {
                content: 'Gets info about an emoji.',
                usage: '<emoji>',
                examples: ['🤔', 'thinking_face', '264701195573133315', '<:Thonk:264701195573133315>']
            },
            category: 'info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'emoji',
                    match: 'content',
                    type: async (message, content) => {
                        if (emojiRegex.test(content))
                            [, content] = content.match(emojiRegex);
                        if (!isNaN(content))
                            return message.guild.emojis.get(content);
                        return message.guild.emojis.find((e) => e.name === content) || emojis.find(content);
                    },
                    prompt: {
                        start: (message) => `${message.author}, what emoji do you want information about`,
                        retry: (message) => `${message.author}, please provide a valid emoji.`
                    }
                }
            ]
        });
    }
    async exec(message, { emoji }) {
        const embed = new discord_js_1.MessageEmbed()
            .setColor([155, 200, 200]);
        if (emoji instanceof discord_js_1.GuildEmoji) {
            embed.setDescription(`Info about **${emoji.name}** (ID: ${emoji.id})`);
            embed.setThumbnail(emoji.url);
            embed.addField('❯ Info', common_tags_1.stripIndents `
				• Identifier: \`<${emoji.identifier}>\`
				• Creation Date: ${moment.utc(emoji.createdAt).format('YYYY/MM/DD hh:mm:ss')}
                • URL: ${emoji.url}
            `);
        }
        else {
            embed.setDescription(`Info about ${emoji.emoji}`);
            embed.addField('❯ Info', common_tags_1.stripIndents `
				• Name: \`${emoji.key}\`
				• Raw: \`${emoji.emoji}\`
				• Unicode: \`${punycode.ucs2.decode(emoji.emoji).map((e) => `\\u${e.toString(16).toUpperCase().padStart(4, '0')}`).join('')}\`
				`);
        }
        return message.util.send(embed);
    }
}
exports.default = EmojiInfoCommand;
