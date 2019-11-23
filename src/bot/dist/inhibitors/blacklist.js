"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class BlacklistInhibitor extends discord_akairo_1.Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        });
    }
    async exec(message) {
        const guildBlacklist = await this.client.settings.get(message.guild, 'blacklist', []);
        const globalBlacklist = await this.client.settings.get('global', 'blacklist', []);
        if (!guildBlacklist || !globalBlacklist)
            return false;
        return guildBlacklist.includes(message.author.id) || globalBlacklist.includes(message.author.id);
    }
}
exports.default = BlacklistInhibitor;
