import { Command } from 'discord-akairo';
import { Message, MessageAttachment } from 'discord.js';
import { AudioClips } from '../../structures/models/AudioClip';
import { extname } from 'path';
import fetch from 'node-fetch';
import fs from 'fs';

export default class UploadCommand extends Command {
    public constructor() {
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

    public async exec(message: Message): Promise<Message | Message[]> {
        const supportedFormats = ['.mp3'];
        const file: MessageAttachment | undefined = message.attachments.first();
        if (!file) return message.util!.send('You have to upload a file.');
        const supported: boolean = supportedFormats.includes(extname(file.name!));
        fetch(file.proxyURL).then(async r => {
            const f = fs.createWriteStream('temp.mp3');
            this.client.logger.info(f.path);
            r.body.pipe(f);
            r.body.on('error', this.client.logger.error);
        });

        return message.util!.send(`${supported}`);
    }
}