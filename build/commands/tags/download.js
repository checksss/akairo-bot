"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Tags_1 = require("../../structures/models/Tags");
class TagDownloadCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-download', {
            category: 'tags',
            description: {
                content: 'Downloads a/all tag(s).',
                usage: '[member]'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    match: 'content',
                    type: 'member',
                    default: ''
                }
            ]
        });
    }
    async exec(message, { member }) {
        const where = member ? { user: member.id, guild: message.guild.id } : { guild: message.guild.id };
        const tags = await Tags_1.Tags.find(where);
        if (!tags.length)
            return;
        const output = tags.reduce((out, t) => {
            out += `Name: ${t.name}\r\nContent:\r\n${t.content.replace(/\n/g, '\r\n')}\r\n\r\n========================================\r\n\r\n`;
            return out;
        }, '');
        return message.util.send('Your tags:', { files: [{ attachment: Buffer.from(output, 'utf8'), name: `${member ? `${member.displayName}s_tags` : 'all_tags'}.txt` }] });
    }
}
exports.default = TagDownloadCommand;
//# sourceMappingURL=download.js.map