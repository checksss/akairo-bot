"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class ReloadCommand extends discord_akairo_1.Command {
    constructor() {
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
    async exec(message) {
        await this.client.commandHandler.reloadAll();
        this.client.logger.log(`Commands reloaded: ${this.client.commandHandler.modules.size}`);
        await this.client.inhibitorHandler.reloadAll();
        this.client.logger.log(`Inhibitors reloaded: ${this.client.inhibitorHandler.modules.size}`);
        await this.client.listenerHandler.reloadAll();
        this.client.logger.log(`Listeners reloaded: ${this.client.listenerHandler.modules.size}`);
        this.client.settings.items = new discord_js_1.Collection();
        await this.client.settings.init();
        this.client.logger.log(`Settings provider reinitialized`);
        message.util.send('Sucessfully reloaded.').then((m) => {
            if (m.deletable && !m.deleted)
                m.delete({ timeout: 3000 });
            if (message.deletable && !message.deleted)
                message.delete({ timeout: 3000 });
        });
    }
}
exports.default = ReloadCommand;
