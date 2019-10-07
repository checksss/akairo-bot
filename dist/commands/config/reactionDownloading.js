"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ToggleTokenFilteringCommand extends discord_akairo_1.Command {
    constructor() {
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
    async exec(message) {
        const reactionDownloading = await this.client.settings.get(message.guild, 'reactionDownloading', true);
        await this.client.settings.set(message.guild, 'reactionDownloading', !reactionDownloading);
        return message.util.reply(`${reactionDownloading ? 'disabled' : 'activated'} reaction downloading.`);
    }
}
exports.default = ToggleTokenFilteringCommand;
