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
class UserInfoCommand extends discord_akairo_1.Command {
    constructor() {
        super('user', {
            aliases: ['user', 'member', 'user-info'],
            description: {
                content: 'Gets info about a member.',
                usage: '[member]',
                examples: ['Meatloaf Dispenser', '@BEACH', '463869229850951680']
            },
            category: 'info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    match: 'content',
                    type: 'member',
                    default: (message) => message.member
                }
            ]
        });
    }
    async exec(message, { member }) {
        const { user } = member;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setDescription(`Info about **${user.tag}** (ID: ${member.id})`)
            .addField('❯ Member Details', common_tags_1.stripIndents `
				${member.nickname == undefined ? '• No nickname' : ` • Nickname: ${member.nickname}`}
				• Roles: ${member.roles.map((roles) => `\`${roles.name}\``).join(' ')}
				• Joined at: ${moment.utc(member.joinedAt).format('YYYY/MM/DD hh:mm:ss')}
            `)
            .addField('❯ User Details', common_tags_1.stripIndents `
				• ID: ${member.id}
				• Username: ${member.user.tag}
				• Created at: ${moment.utc(user.createdAt).format('YYYY/MM/DD hh:mm:ss')}${user.bot ? '\n• Bot account' : ''}
				• Status: ${user.presence.status.toUpperCase()}
				• Activity: ${user.presence.activity ? user.presence.activity.name : 'None'}
            `)
            .setThumbnail(user.displayAvatarURL());
        return message.util.send(embed);
    }
}
exports.default = UserInfoCommand;
