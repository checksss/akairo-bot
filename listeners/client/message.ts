import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';

export default class MessageListener extends Listener {
    public constructor() {
        super('message', {
            emitter: 'client',
            category: 'client',
            event: 'message'
        });
    }

    public async exec(message: Message): Promise<void> {
        if (message.author!.id === this.client.user!.id && (message.embeds.length > 0 || message.attachments.size > 0)) {
            if (message.deletable) message.react('🗑').then(m => {
                this.client.setTimeout(() => {
                    if (!m.message.deleted) m.users.remove(this.client.user!);
                }, 5000);
            });
        }

        this.client.cache.set(message.id, message);
    }
}