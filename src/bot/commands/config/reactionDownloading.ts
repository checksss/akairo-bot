import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ToggleTokenFilteringCommand extends Command {
    public constructor() {
        super('toggle-reaction-downloading', {
            description: {
                content: 'Toggles reaction downloading on the server'
            },
            category: 'config',
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 2
        });
    }

    public async exec(message: Message): Promise<Message | Message[]> {
        const reactionDownloading = await this.client.settings.get(message.guild!, 'reactionDownloading', true);
        await this.client.settings.set(message.guild!, 'reactionDownloading', !reactionDownloading);
        return message.util!.reply(`${reactionDownloading ? 'disabled' : 'activated'} reaction downloading.`);
    }
}