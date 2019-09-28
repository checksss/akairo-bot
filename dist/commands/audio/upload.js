"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const path_1 = require("path");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
class UploadCommand extends discord_akairo_1.Command {
    constructor() {
        super('upload', {
            aliases: ['upload'],
            description: {
                content: 'Uploads a supported audio file.'
            },
            category: 'audio',
            ratelimit: 1,
            cooldown: 10000
        });
    }
    async exec(message) {
        const supportedFormats = ['.mp3'];
        const file = message.attachments.first();
        if (!file)
            return message.util.send('You have to upload a file.');
        const supported = supportedFormats.includes(path_1.extname(file.name));
        node_fetch_1.default(file.proxyURL).then(async (r) => {
            const f = fs_1.default.createWriteStream('temp.mp3');
            this.client.logger.info(f.path);
            r.body.pipe(f);
            r.body.on('error', this.client.logger.error);
        });
        return message.util.send(`${supported}`);
    }
}
exports.default = UploadCommand;
