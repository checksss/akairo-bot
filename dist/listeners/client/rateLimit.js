"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class RateLimitListener extends discord_akairo_1.Listener {
    constructor() {
        super('rateLimit', {
            emitter: 'client',
            category: 'client',
            event: 'rateLimit'
        });
    }
    async exec(info) {
        this.client.logger.error(`Rate limit reached: ${info}`);
        process.exit();
    }
}
exports.default = RateLimitListener;
