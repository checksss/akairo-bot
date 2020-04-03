"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ToggleTokenFilteringCommand extends discord_akairo_1.Command {
    constructor() {
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
    async exec(message) {
        const tokenFiltering = await this.client.settings.get(message.guild, 'tokenFiltering', undefined);
        await this.client.settings.set(message.guild, 'tokenFiltering', !tokenFiltering);
        return message.util.reply(`${tokenFiltering ? 'disabled' : 'activated'} token filtering.`);
    }
}
exports.default = ToggleTokenFilteringCommand;
//# sourceMappingURL=tokenFiltering.js.map