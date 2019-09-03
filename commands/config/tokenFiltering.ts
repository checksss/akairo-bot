import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ToggleTokenFilteringCommand extends Command {
    public constructor() {
        super('toggle-token-filtering', {
            description: {
                content: 'Toggles token filtering on the server'
            },
            category: 'config',
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 2
        });
    }

    public async exec(message: Message): Promise<Message | Message[]> {
        const tokenFiltering = await this.client.settings.get(message.guild!, 'tokenFiltering', undefined);
        await this.client.settings.set(message.guild!, 'tokenFiltering', !tokenFiltering);
        return message.util!.reply(`${tokenFiltering ? 'disabled' : 'activated'} token filtering.`);
    }
}