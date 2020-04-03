import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import { Files } from '../../structures/models/Files';

export default class FileCommand extends Command {
    public constructor() {
        super('file', {
            aliases: ['file'],
            description: {
                content: stripIndents`Available methods:
                     • upload <file (as attachment)> [filename]
                     • delete <filename>
					Required: \`<>\` | Optional: \`[]\`
					For additional \`<...arguments>\` usage refer to the examples below.
				`,
                usage: '<method> <...arguments>',
                examples: [
                    'upload dog',
                    'delete dog'
                ],
            },
            category: 'files',
            cooldown: 5000,
            args: [
                {
                    id: 'method',
                    type: 'lowercase'
                },
                {
                    id: 'filename',
                },
            ],
        });
    }

    public async exec(message: Message, { method, filename }: { method: string, filename: string }): Promise<Message | Message[] | void> {
        if (method === 'upload') {
            const upload = this.handler.modules.get('upload');
            this.handler.runCommand(message, upload!, filename);
        } else if (method === 'delete') {
            const file = await Files.findOne({ id: filename });
            if (!file) return message.util!.reply(`a file with the name **${filename}** was not found.`);
            if (file.user !== message.author!.id) return message.util!.reply('you can only delete your own files.');

            await Files.deleteOne({ id: filename }, (err: any) => {
                if (err) {
                    this.client.logger.error(`File: ${filename} couldn't be deleted`);
                    return message.util!.reply('something went wrong.');
                }

                return message.util!.reply(`**${filename}** was deleted.`);
            });
        } else if (method === 'list') {
            const files = await Files.find({ user: message.author!.id });
            const fileList = files.map((file: any) => `\`${file.id}\``)
                .sort()
                .join(', ');
            const embed = new MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .setAuthor(`${message.author!.tag} (${message.author!.id})`, message.author!.displayAvatarURL())
                .addField(`❯ ${message.author!.tag}'s files`, fileList);

            return message.util!.send(embed);
        } else if (method === 'show') {
            const file = await Files.findOne({ user: message.author!.id, id: filename });
            if (!file) return message.util!.reply(`no file with the name **${filename}** was found.`);
            return message.util!.reply(`${this.client.server.attachmentsBase}${file.id}`);
        }
    }
}