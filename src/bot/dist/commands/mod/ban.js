"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class BanCommand extends discord_akairo_1.Command {
    constructor() {
        super('ban', {
            aliases: ['ban'],
            description: {
                content: 'Bans a mermber.',
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
        if (!cM.permissions.has('BAN_MEMBERS'))
            return message.util.reply('I\'m not allowed to ban members.');
        if (!moderators.includes(message.author.id))
            return message.util.reply('only moderators can ban members.');
        if (member.user.id === cM.user.id)
            return message.util.reply('you can\'t ban me.');
        if (message.author.id === member.user.id)
            return message.util.reply('you can\'t ban yourself.');
        if (member.roles.highest.position >= mM.roles.highest.position)
            return message.util.reply('you can\'t ban members with roles equal to or higher than you.');
        if (member.roles.highest.position >= cM.roles.highest.position)
            return message.util.reply(`my highest role is equal to or lower than ${member}'s highest role.`);
        if (!member.bannable)
            return message.util.send(`${member} isn't bannable for some reason.`);
        let msg = await message.util.send(`Are you sure you want to ban ${member}? Y/N`);
        const responses = await msg.channel.awaitMessages((r) => r.author.id === mM.id, { max: 1, time: 30000 });
        if (!responses || responses.size < 1)
            return message.util.send('Request timed out.');
        const response = responses.first();
        if (/^y(?:e(?:a|s)?)?$/i.test(response.content)) {
            msg.edit(`Banning **${member.user.tag}**`);
        }
        else {
            return message.util.reply('ban cancelled.');
        }
        try {
            try {
                await member.send(common_tags_1.stripIndents `
                    **You have been banned from ${message.guild.name}**
                    ${reason ? `\n**Reason:** ${reason}\n` : ''}
                    You can appeal your ban by DMing \`${guildOwner.tag}\``);
            }
            catch (_a) { }
            await member.ban({ reason: `Banned by ${mM.user.tag}` });
        }
        catch (_b) {
            try {
                await message.guild.members.ban(member.id, { reason: `Banned by ${message.author.tag}` });
            }
            catch (error) {
                return message.util.reply(`something went wrong: \`${error}\`.`);
            }
        }
        const modLog = await this.client.settings.get(message.guild, 'modLog', '');
        if (modLog !== '') {
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.constants.banAdd)
                .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
                .setDescription(common_tags_1.stripIndents `
                    **Action**: Ban
                    **Reason:** ${reason ? reason : 'No reason'}
                `)
                .setFooter('Member Banned')
                .setTimestamp(Date.now());
            await message.guild.channels.get(modLog).send(embed);
        }
        return msg.edit(`Successfully banned **${member.user.tag}**`);
    }
}
exports.default = BanCommand;
