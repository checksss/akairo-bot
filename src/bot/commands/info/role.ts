import { Command } from 'discord-akairo';
import { Message, MessageEmbed, Role } from 'discord.js';
import { stripIndents } from 'common-tags';
import * as moment from 'moment';
import 'moment-duration-format';

interface Permissions {
    [key: string]: string;
}

const PERMISSIONS: Permissions = {
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

export default class RoleInfoCommand extends Command {
    public constructor() {
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
                    default: (message: Message): Role => message.member!.roles.highest
                }
            ]
        });
    }

    public async exec(message: Message, { role }: { role: Role }): Promise<Message | Message[]> {
        const permissions = Object.keys(PERMISSIONS).filter(
            // @ts-ignore
            (permission): string => role.permissions.serialize()[permission]
        );
        const embed = new MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setDescription(`Info about **${role.name}** (ID: ${role.id})`)
            .addField(
                '❯ Info',
                stripIndents`
				• Color: ${role.hexColor.toUpperCase()}
				• Hoisted: ${role.hoist ? 'Yes' : 'No'}
				• Mentionable: ${role.mentionable ? 'Yes' : 'No'}
				• Creation Date: ${moment.utc(role.createdAt).format('YYYY/MM/DD hh:mm:ss')}
            `)
            .addField(
                '❯ Permissions',
                stripIndents`
				${permissions.map((permission): string => `• ${PERMISSIONS[permission]}`).join('\n') || 'None'}
            `)
            .setThumbnail(message.guild!.iconURL()!);

        return message.util!.send(embed);
    }
}