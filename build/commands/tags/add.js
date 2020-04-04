"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Tags_1 = require("../../structures/entities/Tags");
class TagAddCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-add', {
            category: 'tags',
            description: {
                content: 'Adds a tag, usable for everyone in the server. (Markdown can be used)',
                usage: '<tag> <content>',
                examples: ['Test test', 'Ttes **test**']
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'name',
                    type: 'existingTag',
                    prompt: {
                        start: (message) => `${message.author}, what should the tag be named?`,
                        retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value}** already exists.`
                    }
                },
                {
                    id: 'content',
                    match: 'rest',
                    type: 'tagContent',
                    prompt: {
                        start: (message) => `${message.author}, what should the content of the tag be?`
                    }
                }
            ]
        });
    }
    async exec(message, { name, content }) {
        if (name && name.length >= 1900)
            return message.util.reply('tag names can\'t be more than 1900 characters long.');
        if (content && content.length >= 1950)
            return message.util.reply('tag content can\'t be more than 1950 characters long.');
        if (this.handler.modules.has(name))
            return message.util.reply('tags that share a name with a command won\'t work.');
        await Tags_1.Tags.create({
            user: message.author.id,
            guild: message.guild.id,
            name: name,
            content: content,
            uses: 0
        }, async (err) => {
            if (err)
                return message.util.reply('something went wrong.');
            return message.util.reply(`a tag with the name \`${name}\` was created.`);
        });
    }
}
exports.default = TagAddCommand;
//# sourceMappingURL=add.js.map