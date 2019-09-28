"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Tags_1 = require("../../structures/models/Tags");
class TagListCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-list', {
            aliases: ['tags'],
            description: {
                content: 'Lists all server tags.'
            },
            category: 'tags',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ]
        });
    }
    async exec(message, { member }) {
        if (member) {
            const tags = await Tags_1.Tags.find({ user: member.id, guild: message.guild.id }).lean();
            if (!tags.length) {
                if (member.id === message.author.id)
                    return message.util.reply('you don\'t have any tags.');
                return message.util.reply(`**${member.displayName}** doesn't have any tags.`);
            }
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .setAuthor(`**${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
                .setDescription(tags.map((tag) => `\`${tag.name}\``)
                .sort()
                .join(', '));
            return message.util.send(embed);
        }
        const tags = await Tags_1.Tags.find({ guild: message.guild.id });
        if (!tags.length)
            return message.util.send(`**${message.guild.name}** doesn't have any tags.`);
        const guildTags = tags.map((tag) => `\`${tag.name}\``)
            .sort()
            .join(', ');
        const userTags = tags.filter((tag) => tag.user === message.author.id)
            .map((tag) => `\`${tag.name}\``)
            .sort()
            .join(', ');
        const embed = new discord_js_1.MessageEmbed()
            .setColor([155, 200, 200])
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL());
        if (guildTags)
            embed.addField('❯ Tags', guildTags);
        if (userTags)
            embed.addField(`❯ ${message.member.displayName}'s tags`, userTags);
        return message.util.send(embed);
    }
}
exports.default = TagListCommand;
