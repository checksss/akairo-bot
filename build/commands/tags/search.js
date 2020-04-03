"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Tags_1 = require("../../structures/models/Tags");
class SearchTagCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-search', {
            category: 'tags',
            description: {
                content: 'Searches a tag.',
                usage: '<tag>'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'name',
                    match: 'content',
                    type: 'lowercase',
                    prompt: {
                        start: (message) => `${message.author}, what would you like to search for?`
                    }
                }
            ]
        });
    }
    async exec(message, { name }) {
        name = discord_js_1.Util.cleanContent(name, message);
        const tags = await Tags_1.Tags.find({ name: new RegExp('^' + name + '$', 'i') }).lean();
        if (!tags.length)
            return message.util.send(`No results found for query ${name}.`);
        const search = tags
            .map((tag) => `\`${tag.name}\``)
            .sort()
            .join(', ');
        if (search.length >= 1950)
            return message.util.reply('try using a smaller query.');
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
            .setDescription(search);
        return message.util.send(embed);
    }
}
exports.default = SearchTagCommand;
//# sourceMappingURL=search.js.map