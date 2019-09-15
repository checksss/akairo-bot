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
        this.client.cache.set(message.id, message);
    }
}