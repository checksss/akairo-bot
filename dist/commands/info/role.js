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
const PERMISSIONS = {
    ADMINISTRATOR: 'Administrator',
    VIEW_AUDIT_LOG: 'View audit log',
    MANAGE_GUILD: 'Manage server',
    MANAGE_ROLES: 'Manage roles',
    MANAGE_CHANNELS: 'Manage channels',
    KICK_MEMBERS: 'Kick members',
    BAN_MEMBERS: 'Ban members',
    CREATE_INSTANT_INVITE: 'Create instant invite',
    CHANGE_NICKNAME: 'Change nickname',
    MANAGE_NICKNAMES: 'Manage nicknames',
    MANAGE_EMOJIS: 'Manage emojis',
    MANAGE_WEBHOOKS: 'Manage webhooks',
    VIEW_CHANNEL: 'Read text channels and see voice channels',
    SEND_MESSAGES: 'Send messages',
    SEND_TTS_MESSAGES: 'Send TTS messages',
    MANAGE_MESSAGES: 'Manage messages',
    EMBED_LINKS: 'Embed links',
    ATTACH_FILES: 'Attach files',
    READ_MESSAGE_HISTORY: 'Read message history',
    MENTION_EVERYONE: 'Mention everyone',
    USE_EXTERNAL_EMOJIS: 'Use external emojis',
    ADD_REACTIONS: 'Add reactions',
    CONNECT: 'Connect',
    SPEAK: 'Speak',
    MUTE_MEMBERS: 'Mute members',
    DEAFEN_MEMBERS: 'Deafen members',
    MOVE_MEMBERS: 'Move members',
    USE_VAD: 'Use voice activity'
};
class RoleInfoCommand extends discord_akairo_1.Command {
    constructor() {
        super('role', {
            aliases: ['role', 'role-info'],
            description: {
                content: 'Gets info about a role.',
                usage: '[role]',
                examples: ['Beach Inhabitants', '@Owner']
            },
            category: 'info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'role',
                    match: 'content',
                    type: 'role',
                    default: (message) => message.member.roles.highest
                }
            ]
        });
    }
    async exec(message, { role }) {
        const permissions = Object.keys(PERMISSIONS).filter(
        // @ts-ignore
        (permission) => role.permissions.serialize()[permission]);
        const embed = new discord_js_1.MessageEmbed()
            .setColor([155, 200, 200])
            .setDescription(`Info about **${role.name}** (ID: ${role.id})`)
            .addField('❯ Info', common_tags_1.stripIndents `
				• Color: ${role.hexColor.toUpperCase()}
				• Hoisted: ${role.hoist ? 'Yes' : 'No'}
				• Mentionable: ${role.mentionable ? 'Yes' : 'No'}
				• Creation Date: ${moment.utc(role.createdAt).format('YYYY/MM/DD hh:mm:ss')}
            `)
            .addField('❯ Permissions', common_tags_1.stripIndents `
				${permissions.map((permission) => `• ${PERMISSIONS[permission]}`).join('\n') || 'None'}
            `)
            .setThumbnail(message.guild.iconURL());
        return message.util.send(embed);
    }
}
exports.default = RoleInfoCommand;
