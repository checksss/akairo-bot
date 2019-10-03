import { Command } from 'discord-akairo';
import { Message, Collection } from 'discord.js';

export default class ReloadCommand extends Command {
    public constructor() {
        super('reload', {
            aliases: ['reload'],
            description: {
                content: 'Reloads all commands, inhibitors, listeners, and settings.',
                ownerOnly: true
            },
            category: 'util',
            ownerOnly: true
        });
    }

    public async exec(message: Message): Promise<void> {
        await this.client.commandHandler.reloadAll();
        this.client.logger.log(`Commands reloaded: ${this.client.commandHandler.modules.size}`);

        await this.client.inhibitorHandler.reloadAll();
        this.client.logger.log(`Inhibitors reloaded: ${this.client.inhibitorHandler.modules.size}`);

        await this.client.listenerHandler.reloadAll();
        this.client.logger.log(`Listeners reloaded: ${this.client.listenerHandler.modules.size}`);

        this.client.settings.items = new Collection();
        await this.client.settings.init();
        this.client.logger.log(`Settings provider reinitialized`);

        message.util!.send('Sucessfully reloaded.').then((m: Message): void => {
            if (m.deletable && !m.deleted) m.delete({ timeout: 3000 });
            if (message.deletable && !message.deleted) message.delete({ timeout: 3000 });
        });
    }
}