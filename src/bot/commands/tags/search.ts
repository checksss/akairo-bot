import { Command } from 'discord-akairo';
import { Message, MessageEmbed, Util } from 'discord.js';
import { Tags } from '../../structures/models/Tags';

export default class SearchTagCommand extends Command {
    public constructor() {
        super('tag-search', {
            category: 'tags',
            description: {
                content: 'Searches a tag.',
                usage: '<tag>'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'name',
                    match: 'content',
                    type: 'lowercase',
                    prompt: {
                        start: (message: Message):string => `${message.author}, what would you like to search for?`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { name }: { name: string }): Promise<Message | Message[]> {
        name = Util.cleanContent(name, message);
        const tags = await Tags.find({ name: new RegExp('^'+name+'$', 'i')}).lean();
        if (!tags.length) return message.util!.send(`No results found for query ${name}.`);
        
        const search = tags
            .map((tag: any) => `\`${tag.name}\``)
            .sort()
            .join(', ');

        if (search.length >= 1950)
            return message.util!.reply('try using a smaller query.');

        const embed = new MessageEmbed()
            .setColor(this.client.constants.infoEmbed)
            .setAuthor(`${message.author!.tag} (${message.author!.id})`, message.author!.displayAvatarURL())
            .setDescription(search);

        return message.util!.send(embed);
    }
}