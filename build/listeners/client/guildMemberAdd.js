"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class GuildMemberAddListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            category: 'client',
            event: 'guildMemberAdd'
        });
    }
    async exec(member) {
        let memberLog = await this.client.settings.get(member.guild, 'memberLog', undefined);
        const prefix = await this.client.settings.get(member.guild, 'prefix', ';');
        if (!/(\d){18}/.test(memberLog))
            return;
        memberLog = member.guild.channels.cache.get(memberLog);
        const clientPerms = memberLog.permissionsFor(this.client.user);
        if (!clientPerms.has('SEND_MESSAGES') || !clientPerms.has('EMBED_LINKS'))
            return member.guild.owner.send(common_tags_1.stripIndents `
            I don\'t have permission to send messages/embeds in \`${member.guild.name}\`'s
            member log. You can turn off member logging by using \`${prefix}memberLog clear\`
            in any of \`${member.guild.name}\`'s text channels.`);
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.memberAdd)
            .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter('User Joined');
        if (memberLog.type === 'text')
            return memberLog.send(embed);
    }
}
exports.default = GuildMemberAddListener;
//# sourceMappingURL=guildMemberAdd.js.map