"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const Files_1 = require("../../structures/models/Files");
const randomstring_1 = require("randomstring");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
class UploadCommand extends discord_akairo_1.Command {
    constructor() {
        super('upload', {
            aliases: ['upload'],
            description: {
                content: 'Uploads a file to http://akairo.org/',
                usage: '<file (as attachment)>'
            },
            category: 'files',
            ratelimit: 1,
            cooldown: 15,
            args: [
                {
                    id: 'name',
                    type: 'filename',
                    prompt: {
                        retry: (msg, { failure }) => `${msg.author}, a file with the name **${failure.value}** already exists.`
                    },
                }
            ],
        });
    }
    async exec(message, { name }) {
        if (!message.attachments.first())
            return message.util.reply('you have to attach a file to use this');
        if (message.attachments.first().size > 2 * 1024 * 1024)
            return message.util.reply('files can\'t be bigger than 2 MB.');
        if (name && !/^[\da-zA-Z-]+$/i.test(name))
            return message.util.reply('file names can only have letters, numbers, and dashes.');
        if (name && name.length > 12)
            return message.util.reply('file names can\'t be longer than 12 characters.');
        const res = await node_fetch_1.default(message.attachments.first().url).then(res => res.buffer());
        if (!name) {
            name = randomstring_1.generate({ length: 6 });
            while (await Files_1.Files.countDocuments({ id: name }).then((c) => c >= 1))
                name = randomstring_1.generate({ length: 6 });
        }
        await Files_1.Files.create({
            id: name,
            user: message.author.id,
            filename: message.attachments.first().name,
            data: Buffer.from(res)
        });
        return message.util.reply(`file uploaded: <${this.client.server.attachmentsBase}${name}>`);
    }
}
exports.default = UploadCommand;
//# sourceMappingURL=upload.js.map