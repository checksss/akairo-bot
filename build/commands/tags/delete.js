"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Tags_1 = require("../../structures/models/Tags");
class TagDeleteCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-delete', {
            category: 'tags',
            description: {
                content: 'Deletes a tag.',
                usage: '<tag>'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'tag',
                    match: 'content',
                    type: 'tag',
                    prompt: {
                        start: (message) => `${message.author}, what tag do you want to delete?`,
                        retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value}** does not exist.`
                    }
                }
            ]
        });
    }
    async exec(message, { tag }) {
        const moderators = await this.client.settings.get(message.guild, 'moderators', [message.guild.owner.id]);
        if (tag.user !== message.author.id && !moderators.includes(message.author.id))
            return message.util.reply('you can only delete your own tags.');
        await Tags_1.Tags.deleteOne(tag, (err) => {
            if (err)
                return message.util.reply('something went wrong');
            return message.util.reply(`successfully deleted **${tag.name.substring(0, 1900)}**.`);
        });
    }
}
exports.default = TagDeleteCommand;
//# sourceMappingURL=delete.js.map