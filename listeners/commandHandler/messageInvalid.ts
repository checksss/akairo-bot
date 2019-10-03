import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';

export default class MessageInvalidListener extends Listener {
    public constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            category: 'commandHandler',
            event: 'messageInvalid'
        });
    }

    public async exec(message: Message): Promise<void> {
        if (message.guild && message.util!.parsed!.prefix) {
            const prefix = this.client.commandHandler.modules.get('prefix');
            if (!message.util!.parsed!.afterPrefix) return this.client.commandHandler.runCommand(message, prefix!, ['get']);
            
            if (!message.util!.parsed!.alias) return;
            const tagShow = this.client.commandHandler.modules.get('tag-show');
            return this.client.commandHandler.runCommand(message, tagShow!, await tagShow!.parse(message, message.util!.parsed!.afterPrefix ));
        }
    }
}