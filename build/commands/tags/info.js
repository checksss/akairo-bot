"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const moment_1 = tslib_1.__importDefault(require("moment"));
require("moment-duration-format");
class TagInfoCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-info', {
            category: 'tags',
            description: {
                content: 'Displays information about a tag.',
                usage: '<tag>'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'tag',
                    match: 'content',
                    type: 'tag',
                    prompt: {
                        start: (message) => `${message.author}, what tag do you want information on?`,
                        retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value} doesn't exist.`
                    }
                }
            ]
        });
    }
    async exec(message, { tag }) {
        const user = await this.client.users.fetch(tag.user);
        let lastModifiedBy;
        try {
            lastModifiedBy = await this.client.users.fetch(tag.last_modified);
        }
        catch (error) {
            lastModifiedBy = null;
        }
        const guild = this.client.guilds.cache.get(tag.guild);
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .addField('❯ Name', tag.name)
            .addField('❯ User', user ? `${user.tag} (ID: ${user.id})` : 'Couldn\'t fetch user.')
            .addField('❯ Guild', guild ? `${guild.name}` : 'Couldn\'t fetch guild.')
            .addField('❯ Aliases', tag.aliases.length ? tag.aliases.map(t => `\`${t}\``).sort().join(', ') : 'No aliases.')
            .addField('❯ Uses', tag.uses)
            .addField('❯ Created at', moment_1.default.utc(tag.createdAt).format('YYYY/MM/DD hh:mm:ss'))
            .addField('❯ Modified at', moment_1.default.utc(tag.updatedAt).format('YYYY/MM/DD hh:mm:ss'));
        if (lastModifiedBy) {
            embed.addField('❯ Last modified by', lastModifiedBy ? `${lastModifiedBy.tag} (ID: ${lastModifiedBy.id})` : 'Couldn\'t fetch user.');
        }
        return message.util.send(embed);
    }
}
exports.default = TagInfoCommand;
//# sourceMappingURL=info.js.map