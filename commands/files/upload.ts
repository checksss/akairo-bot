import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Files } from '../../structures/models/Files';

import { generate } from 'randomstring';
import fetch from 'node-fetch';

export default class UploadCommand extends Command {
    public constructor() {
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
                        retry: (msg: Message, { failure }: { failure: { value: string }}) => `${msg.author}, a file with the name **${failure.value}** already exists.`
                    },
                }
            ],
        });
    }

    public async exec(message: Message, { name }: { name: string }): Promise<Message | Message[]> {
        if (!message.attachments.first()) return message.util!.reply('you have to attach a file to use this');
        if (message.attachments.first()!.size > 2 * 1024 * 1024) return message.util!.reply('files can\'t be bigger than 2 MB.');
        if (name && !/^[\da-zA-Z-]+$/i.test(name)) return message.util!.reply('file names can only have letters, numbers, and dashes.');
        if (name && name.length > 12) return message.util!.reply('file names can\'t be longer than 12 characters.');

        const res = await fetch(message.attachments.first()!.url).then(res => res.buffer());

        if (!name) {
            name = generate({ length: 6 });
            while (await Files.countDocuments({ id: name }).then((c: number) => c >= 1)) name = generate({ length: 6 });
        }

        await Files.create({
            id: name,
            user: message.author!.id,
            filename: message.attachments.first()!.name,
            data: Buffer.from(res)
        });

        return message.util!.reply(`file uploaded: <http://akairo.org:8080/data/${name}>`);
    }
}