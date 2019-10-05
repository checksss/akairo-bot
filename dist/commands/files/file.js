"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
const Files_1 = require("../../structures/models/Files");
class FileCommand extends discord_akairo_1.Command {
    constructor() {
        super('file', {
            aliases: ['file'],
            description: {
                content: common_tags_1.stripIndents `Available methods:
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
    async exec(message, { method, filename }) {
        if (method === 'upload') {
            const upload = this.handler.modules.get('upload');
            this.handler.runCommand(message, upload, filename);
        }
        else if (method === 'delete') {
            const file = await Files_1.Files.findOne({ id: filename });
            if (!file)
                return message.util.reply(`a file with the name **${filename}** was not found.`);
            if (file.user !== message.author.id)
                return message.util.reply('you can only delete your own files.');
            await Files_1.Files.deleteOne({ id: filename }, (err) => {
                if (err) {
                    this.client.logger.error(`File: ${filename} couldn't be deleted`);
                    return message.util.reply('something went wrong.');
                }
                return message.util.reply(`**${filename}** was deleted.`);
            });
        }
        else if (method === 'list') {
            const files = await Files_1.Files.find({ user: message.author.id });
            const fileList = files.map((file) => `\`${file.id}\``)
                .sort()
                .join(', ');
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                .addField(`❯ ${message.author.tag}'s files`, fileList);
            return message.util.send(embed);
        }
        else if (method === 'show') {
            const file = await Files_1.Files.findOne({ user: message.author.id, id: filename });
            if (!file)
                return message.util.reply(`no file with the name **${filename}** was found.`);
            return message.util.reply(`${this.client.statsServer.attachmentsBase}${file.id}`);
        }
    }
}
exports.default = FileCommand;
