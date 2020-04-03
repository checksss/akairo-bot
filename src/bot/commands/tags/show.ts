import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import { Tags } from '../../structures/models/Tags';

export default class TagShowCommand extends Command {
    public constructor() {
        super('tag-show', {
            category: 'tags',
            description: {
                content: 'Displays a tag.',
                usage: '<tag>'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'name',
                    match: 'content',
                    type: 'lowercase',
                    prompt: {
                        start: (message: Message): string => `${message.author}, what tag would you like to see?`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { name }: { name: string }): Promise<Message | Message[] | void> {
        if (!name) return;
        name = Util.cleanContent(name, message);

        var tags = await Tags.find({ guild: message.guild!.id });
        var tag = tags.filter(t => t.name === name || t.aliases.includes(name))[0];

        // @ts-ignore
        if (!tag) return;
        tag.uses += 1;
        tag.save();

        return message.util!.send(tag.content);
    }
}