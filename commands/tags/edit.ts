import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import * as moment from 'moment';
import { Tags } from '../../structures/models/Tags';

export default class TagEditCommand extends Command {
    public constructor() {
        super('tag-edit', {
            category: 'tags',
            description: {
                content: 'Edit an existing tag. (Markdown can be used)',
                usage: '<tag> <content>',
                examples: ['Test New Content', '"Test 1" more new content']
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'tag',
                    type: 'tag',
                    prompt: {
                        start: (message: Message): string => `${message.author}, what tag do you want to edit?`,
                        retry: (message: Message, { failure }: { failure: { value: string } }) => `${message.author}, a tag with the name **${failure.value}** does not exist.`
                    }
                },
                {
                    id: 'content',
                    match: 'rest',
                    type: 'tagContent',
                    prompt: {
                        start: (message: Message): string => `${message.author}, what should the new content be?`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { tag, content }: { tag: Tag, content: string }): Promise<Message | Message[]> {
        const moderators = await this.client.settings.get(message.guild!, 'moderators', [message.guild!.owner!.id]);
        if (tag.user !== message.author!.id && !moderators.includes(message.author!.id))
            return message.util!.reply('you can only edit your own tags.');
        if (content && content.length > 1950) 
            return message.util!.reply('messages have a 2000-character limit.')

        if (typeof content === 'string') {
            content = Util.cleanContent(content, message);
            tag.content = content;
        }

        tag.last_modified = message.author!.id;
        tag.updatedAt = moment.utc().toDate();
        // @ts-ignore
        tag.save();

        return message.util!.reply(`successfully edited **${tag.name}**.`);
    }
}

interface Tag {
    aliases: string[],
    user: string,
    guild: string,
    name: string,
    content: string,
    last_modified: string,
    updatedAt: Date
}