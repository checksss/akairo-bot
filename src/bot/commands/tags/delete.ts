import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Tags } from '../../structures/entities/Tags';

export default class TagDeleteCommand extends Command {
    public constructor() {
        super('tag-delete', {
            category: 'tags',
            description: {
                content: 'Deletes a tag.',
                usage: '<tag>'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'tag',
                    match: 'content',
                    type: 'tag',
                    prompt: {
                        start: (message: Message): string => `${message.author}, what tag do you want to delete?`,
                        retry: (message: Message, { failure }: { failure: { value: string } }): string => `${message.author}, a tag with the name **${failure.value}** does not exist.`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { tag }: { tag: Tag }): Promise<Message | Message[] | void> {
        const moderators = await this.client.settings.get(message.guild!, 'moderators', [message.guild!.owner!.id]);
        if (tag.user !== message.author!.id && !moderators.includes(message.author!.id)) return message.util!.reply('you can only delete your own tags.');
        
        await Tags.deleteOne(tag as object, (err: Error): Promise<Message | Message[]> => {
            if (err) return message.util!.reply('something went wrong');
            return message.util!.reply(`successfully deleted **${tag.name.substring(0, 1900)}**.`);
        });
    }
}

interface Tag {
    aliases: string[],
    user: string,
    guild: string,
    name: string,
    content: string,
    uses: number
}