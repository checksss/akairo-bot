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
const moment = __importStar(require("moment"));
class TagEditCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-edit', {
            category: 'tags',
            description: {
                content: 'Edit an existing tag. (Markdown can be used)',
                usage: '<tag> <content>',
                examples: ['Test New Content', '"Test 1" more new content']
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'tag',
                    type: 'tag',
                    prompt: {
                        start: (message) => `${message.author}, what tag do you want to edit?`,
                        retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value}** does not exist.`
                    }
                },
                {
                    id: 'content',
                    match: 'rest',
                    type: 'tagContent',
                    prompt: {
                        start: (message) => `${message.author}, what should the new content be?`
                    }
                }
            ]
        });
    }
    async exec(message, { tag, content }) {
        const moderators = await this.client.settings.get(message.guild, 'moderators', [message.guild.owner.id]);
        if (tag.user !== message.author.id && !moderators.includes(message.author.id))
            return message.util.reply('you can only edit your own tags.');
        if (content && content.length > 1950)
            return message.util.reply('messages have a 2000-character limit.');
        if (typeof content === 'string') {
            content = discord_js_1.Util.cleanContent(content, message);
            tag.content = content;
        }
        tag.last_modified = message.author.id;
        tag.updatedAt = moment.utc().toDate();
        // @ts-ignore
        tag.save();
        return message.util.reply(`successfully edited **${tag.name}**.`);
    }
}
exports.default = TagEditCommand;
