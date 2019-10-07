import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class MessageListener extends Listener {
    public constructor() {
        super('message', {
            emitter: 'client',
            category: 'client',
            event: 'message'
        });
    }

    public async exec(message: Message): Promise<void> {
        this.client.cache.set(message.id, message);

        if (message.guild!.member(this.client.user!)!.permissions.has('USE_EXTERNAL_EMOJIS')) {
            const reactionDownloading = await this.client.settings.get(message.guild!, 'reactionDownloading', false);
            if (!reactionDownloading || message.attachments.size < 1) return;
            if (message.attachments.first()!.size > 2 * 1024 * 1024) return;

            const emoji = this.client.emojis.get(this.client.constants.downloadEmoji);
            if (!emoji) return;
            message.react(emoji);
        }
    }
}