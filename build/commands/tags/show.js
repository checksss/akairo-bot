"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Tags_1 = require("../../structures/entities/Tags");
class TagShowCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-show', {
            category: 'tags',
            description: {
                content: 'Displays a tag.',
                usage: '<tag>'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'name',
                    match: 'content',
                    type: 'lowercase',
                    prompt: {
                        start: (message) => `${message.author}, what tag would you like to see?`
                    }
                }
            ]
        });
    }
    async exec(message, { name }) {
        if (!name)
            return;
        name = discord_js_1.Util.cleanContent(name, message);
        var tags = await Tags_1.Tags.find({ guild: message.guild.id });
        var tag = tags.filter(t => t.name === name || t.aliases.includes(name))[0];
        if (!tag)
            return;
        tag.uses += 1;
        tag.save();
        return message.util.send(tag.content);
    }
}
exports.default = TagShowCommand;
//# sourceMappingURL=show.js.map