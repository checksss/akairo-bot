"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class HelpCommand extends discord_akairo_1.Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            description: {
                content: 'Displays a list of available command, or detailed information for a specific command.',
                usage: '[command]'
            },
            category: 'util',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ]
        });
    }
    async exec(message, { command }) {
        const prefix = await this.handler.prefix(message);
        if (!command) {
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .addField('❯ Commands', common_tags_1.stripIndents `A list of available commands.
                    For additional info on a command, type \`${prefix}help <command>\`
                `);
            for (const category of this.handler.categories.values()) {
                embed.addField(`❯ ${category.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`, `${category.filter((cmd) => cmd.aliases.length > 0).map((cmd) => `\`${cmd.aliases[0]}\``).join(' ')}`);
            }
            return message.util.send(embed);
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor([155, 200, 200])
            .setTitle(`\`${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}\``)
            .addField('❯ Description', `${command.description.content ? command.description.content : ''} ${command.description.ownerOnly ? '\n**[Owner Only]**' : ''}`);
        if (command.aliases.length > 1)
            embed.addField('❯ Aliases', `\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples && command.description.examples.length)
            embed.addField('❯ Examples', `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``, true);
        return message.util.send(embed);
    }
}
exports.default = HelpCommand;
