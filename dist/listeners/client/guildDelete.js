"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class GuildDeleteListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildDelete', {
            emitter: 'client',
            category: 'client',
            event: 'guildDelete'
        });
    }
    async exec(guild) {
        const updateChannel = this.client.channels.get(await this.client.settings.get('global', 'modLog', ''));
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.guildRemove)
            .setAuthor(guild.name, guild.iconURL())
            .addField('ID', guild.id, true)
            .addField('Name', guild.name, true)
            .addField('Owner', guild.owner.user.tag, true)
            .addField('Region', guild.region, true)
            .addField('Channels', guild.channels.size, true)
            .addField('Members', guild.members.size, true)
            .addField('Humans', guild.members.filter(m => !m.user.bot).size, true)
            .addField('Bots', guild.members.filter(m => m.user.bot).size, true)
            .addBlankField(true)
            .setFooter('Left Guild')
            .setTimestamp(Date.now());
        if (!updateChannel || updateChannel.type !== 'text')
            return;
        return updateChannel.send(embed);
    }
}
exports.default = GuildDeleteListener;
