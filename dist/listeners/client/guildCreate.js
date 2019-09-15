"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Settings_1 = __importDefault(require("../../structures/models/Settings"));
const common_tags_1 = require("common-tags");
class GuildCreateListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            category: 'client',
            event: 'guildCreate'
        });
    }
    async exec(guild) {
        if (this.client.settings.items.has(guild.id))
            this.client.settings.clear(guild);
        const guildGeneral = guild.channels.filter(c => c.type === 'text').filter(c => {
            return c.name === 'general' || c.name === 'chat' || c.name === 'main';
        }).first();
        const updateChannel = this.client.channels.get(await this.client.settings.get('global', 'modLog', ''));
        const logEmbed = new discord_js_1.MessageEmbed()
            .setColor([135, 235, 75])
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
            .setFooter('Joined Guild')
            .setTimestamp(Date.now());
        if (updateChannel && updateChannel.type === 'text')
            updateChannel.send(logEmbed);
        await Settings_1.default.create({
            id: guild.id,
            name: guild.name,
            prefix: process.env.prefix,
            filterProfanity: false,
            mainChannel: guildGeneral ? guildGeneral.id : '',
            memberLog: '',
            modLog: '',
            tokenFiltering: true,
            blacklist: [],
            moderators: [guild.owner.id]
        }, (err) => {
            if (err)
                return guildGeneral.send('There was an error created guild settings.');
            const embed = new discord_js_1.MessageEmbed()
                .setColor([155, 200, 200])
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setTimestamp(Date.now());
            if (guildGeneral) {
                embed.setTitle('Main Text Channel Set');
                embed.setDescription(common_tags_1.stripIndents `
                    ${guildGeneral} has been set as the guild's
                    main text channel. If this is incorrect,
                    please use \`${process.env.prefix}main set\` in \`${guild.name}\`.`);
                embed.setFooter('Main Channel Set');
            }
            else {
                embed.setTitle('Can\'t find main text channel');
                embed.setDescription(common_tags_1.stripIndents `
                Please respond with \`\`?main set\`\` in
                \`\`${guild.name}\`\`'s main text channel
                **ex: _?main set_ in #the-lounge**`);
                embed.setFooter('Error');
            }
            return guild.owner.send(embed);
        });
    }
}
exports.default = GuildCreateListener;
