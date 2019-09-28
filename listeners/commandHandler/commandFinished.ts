import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class CommandFinishedListener extends Listener {
    public constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            category: 'commandHandler',
            event: 'commandFinished'
        });
    }

    public async exec(message: Message, command: Command): Promise<void> {
        this.client.logger.info(`${message.author!.tag} ran ${command.id}`);
    }
}