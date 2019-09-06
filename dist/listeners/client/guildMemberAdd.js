"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class GuildMemberAddListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            category: 'client',
            event: 'guildMemberAdd'
        });
    }
    async exec(member) {
        let memberLog = member.guild.channels.get(await this.client.settings.get(member.guild, 'memberLog', ''));
        if (!memberLog && memberLog.type !== 'text')
            return;
        const embed = new discord_js_1.MessageEmbed()
            .setColor([135, 235, 75])
            .setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter('User Joined');
        // @ts-ignore
        return memberLog.send(embed);
    }
}
exports.default = GuildMemberAddListener;
