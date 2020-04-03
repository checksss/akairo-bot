"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class BanCommand extends discord_akairo_1.Command {
    constructor() {
        super('kick', {
            aliases: ['kick'],
            description: {
                content: 'Kicks a mermber.',
                usage: '<member> [reason]',
                examples: ['@meatloaf dispenser', '@NEP.jpeg annoying'],
            },
            category: 'mod',
            clientPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
            args: [
                {
                    id: 'member',
                    type: discord_akairo_1.Argument.union('member', async (_, phrase) => {
                        const m = await this.client.users.fetch(phrase);
                        if (m)
                            return { id: m.id, user: m };
                        return null;
                    }),
                    prompt: {
                        start: (message) => `${message.author}, who would you like to ban?`,
                        retry: (message) => `${message.author}, please mention a valid member.`,
                    },
                },
                {
                    id: 'reason',
                    match: 'rest',
                    default: ''
                },
            ],
        });
    }
    async exec(message, { member, reason }) {
        const guildOwner = await this.client.users.fetch(message.guild.ownerID);
        const moderators = await this.client.settings.get(message.guild, 'moderators', [guildOwner.id]);
        const cM = await message.guild.members.fetch(this.client.user.id);
        const mM = await message.guild.members.fetch(message.author.id);
        if (!cM.permissions.has('KICK_MEMBERS'))
            return message.util.reply('I\'m not allowed to kick members.');
        if (!moderators.includes(message.author.id))
            return message.util.reply('only moderators can kick members.');
        if (member.user.id === cM.user.id)
            return message.util.reply('you can\'t kick me.');
        if (message.author.id === member.user.id)
            return message.util.reply('you can\'t kick yourself.');
        if (member.roles.highest.position >= mM.roles.highest.position)
            return message.util.reply('you can\'t kick members with roles equal to or higher than you.');
        if (member.roles.highest.position >= cM.roles.highest.position)
            return message.util.reply(`my highest role is equal to or lower than ${member}'s highest role.`);
        if (!member.kickable)
            return message.util.send(`${member} isn't kickable for some reason.`);
        let msg = await message.util.send(`Are you sure you want to kick ${member}? Y/N`);
        const responses = await msg.channel.awaitMessages((r) => r.author.id === mM.id, { max: 1, time: 30000 });
        if (!responses || responses.size < 1)
            return message.util.send('Request timed out.');
        const response = responses.first();
        if (/^y(?:e(?:a|s)?)?$/i.test(response.content)) {
            msg.edit(`Kicking **${member.user.tag}**`);
        }
        else {
            return message.util.reply('kick cancelled.');
        }
        try {
            await member.send(common_tags_1.stripIndents `
                **You have been kicked from ${message.guild.name}**
                ${reason ? `\n**Reason:** ${reason}\n` : ''}`).catch(this.client.logger.error);
            await member.kick(`Banned by ${mM.user.tag}`);
        }
        catch (error) {
            return message.util.reply(`something went wrong: \`${error}\`.`);
        }
        const modLog = await this.client.settings.get(message.guild, 'modLog', '');
        if (modLog !== '') {
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.constants.banAdd)
                .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
                .setDescription(common_tags_1.stripIndents `
                    **Action**: Kick
                    **Reason:** ${reason ? reason : 'No reason'}
                `)
                .setFooter('Member Banned')
                .setTimestamp(Date.now());
            await message.guild.channels.cache.get(modLog).send(embed);
        }
        return msg.edit(`Successfully kicked **${member.user.tag}**`);
    }
}
exports.default = BanCommand;
//# sourceMappingURL=kick.js.map