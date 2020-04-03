"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const moment = tslib_1.__importStar(require("moment"));
require("moment-duration-format");
const HUMAN_LEVELS = {
    0: 'None',
    1: 'Low',
    2: 'Medium',
    3: '(╯°□°）╯︵ ┻━┻',
    4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};
class ServerInfoCommand extends discord_akairo_1.Command {
    constructor() {
        super('server', {
            aliases: ['server', 'server-info'],
            description: {
                content: 'Gets info about a server',
            },
            category: 'info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2
        });
    }
    async exec(message) {
        const guildOwner = await message.guild.members.fetch(message.guild.ownerID);
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setDescription(`Info about **${message.guild.name}** (ID: ${message.guild.id})`)
            .addField('❯ Channels', common_tags_1.stripIndents `
                • ${message.guild.channels.cache.filter((ch) => ch.type === 'text').size} Text, ${message.guild.channels.cache.filter((ch) => ch.type === 'voice').size} Voice
                • AFK: ${message.guild.afkChannelID ? `<#${message.guild.afkChannelID}> after ${message.guild.afkTimeout / 60}min` : 'None'}
            `)
            .addField('❯ Members', common_tags_1.stripIndents `
                • ${message.guild.memberCount} members
                • Owner: ${guildOwner.user.tag} (ID: ${guildOwner.id})
            `)
            .addField('❯ Other', common_tags_1.stripIndents `
                • Roles: ${message.guild.roles.cache.size}
                • Region: ${message.guild.region}
                • Created at: ${moment.utc(message.guild.createdAt).format('YYYY/MM/DD hh:mm:ss')}
                • Verification Level: ${HUMAN_LEVELS[message.guild.verificationLevel]}
            `)
            .setThumbnail(message.guild.iconURL());
        return message.util.send(embed);
    }
}
exports.default = ServerInfoCommand;
//# sourceMappingURL=server.js.map