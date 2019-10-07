import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Tags } from '../../structures/models/Tags';

export default class TagAddCommand extends Command {
    public constructor() {
        super('tag-add', {
            category: 'tags',
            description: {
                content: 'Adds a tag, usable for everyone in the server. (Markdown can be used)',
                usage: '<tag> <content>',
                examples: ['Test test', 'Ttes **test**']
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'name',
                    type: 'existingTag',
                    prompt: {
                        start: (message: Message): string => `${message.author}, what should the tag be named?`,
                        retry: (message: Message, { failure }: { failure: { value: string } }): string => `${message.author}, a tag with the name **${failure.value}** already exists.`
                    }
                },
                {
                    id: 'content',
                    match: 'rest',
                    type: 'tagContent',
                    prompt: {
                        start: (message: Message): string => `${message.author}, what should the content of the tag be?`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { name, content }: { name: any; content: string }): Promise<Message | Message[] | void> {
        if (name && name.length >= 1900)
            return message.util!.reply('tag names can\'t be more than 1900 characters long.');
        if (content && content.length >= 1950)
            return message.util!.reply('tag content can\'t be more than 1950 characters long.');
        if (this.handler.modules.has(name))
            return message.util!.reply('tags that share a name with a command won\'t work.');
        
        await Tags.create({
            user: message.author!.id,
            guild: message.guild!.id,
            name: name,
            content: content,
            uses: 0
        }, async (err: any): Promise<Message | Message[]> => {
            if (err) return message.util!.reply('something went wrong.');
            return message.util!.reply(`a tag with the name \`${name}\` was created.`);
        });
    }
}