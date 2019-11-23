import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Tags } from '../../structures/models/Tags';

export default class TagSourceCommand extends Command {
    public constructor() {
        super('tag-source', {
            category: 'tags',
            description: {
                content: 'Displays a tag\'s source',
                usage: '[--file/-f] <tag>'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'file',
                    match: 'flag',
                    flag: ['--file', '-f']
                },
                {
                    id: 'tag',
                    match: 'rest',
                    type: 'tag',
                    prompt: {
                        start: (message: Message) => `${message.author}, what tag would you like the source of?`,
                        retry: (message: Message, { failure }: { failure: { value: string } }) => `${message.author}, a tag with the name **${failure.value}** doesn't exist.`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { tag, file }: { tag: Tag, file: boolean }): Promise<Message | Message[]> {
        return message.util!.send(tag.content, {
            code: 'md',
            files: file ? [{
                attachment: Buffer.from(tag.content.replace(/\n/g, '\r\n'), 'utf8'),
                name: `${tag.name}_source.txt`
            }] : undefined
        });
    }
}

interface Tag {
    id: Number,
    user: String,
    guild: String,
    name: String,
    aliases: [String],
    content: String,
    uses: Number,
    last_modified: String,
    createdAt: Date,
    updatedAt: Date
}