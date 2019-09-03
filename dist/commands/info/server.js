"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const moment = __importStar(require("moment"));
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
        const embed = new discord_js_1.MessageEmbed()
            .setColor([155, 200, 200])
            .setDescription(`Info about **${message.guild.name}** (ID: ${message.guild.id})`)
            .addField('❯ Channels', common_tags_1.stripIndents `
                • ${message.guild.channels.filter((ch) => ch.type === 'text').size} Text, ${message.guild.channels.filter((ch) => ch.type === 'voice').size} Voice
                • AFK: ${message.guild.afkChannelID ? `<#${message.guild.afkChannelID}> after ${message.guild.afkTimeout / 60}min` : 'None'}
            `)
            .addField('❯ Members', common_tags_1.stripIndents `
                • ${message.guild.memberCount} members
                • Owner: ${message.guild.owner.user.tag} (ID: ${message.guild.ownerID})
            `)
            .addField('❯ Other', common_tags_1.stripIndents `
                • Roles: ${message.guild.roles.size}
                • Region: ${message.guild.region}
                • Created at: ${moment.utc(message.guild.createdAt).format('YYYY/MM/DD hh:mm:ss')}
                • Verification Level: ${HUMAN_LEVELS[message.guild.verificationLevel]}
            `)
            .setThumbnail(message.guild.iconURL());
        return message.util.send(embed);
    }
}
exports.default = ServerInfoCommand;
