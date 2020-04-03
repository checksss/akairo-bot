"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const util_1 = tslib_1.__importDefault(require("util"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class RateLimitListener extends discord_akairo_1.Listener {
    constructor() {
        super('rateLimit', {
            emitter: 'client',
            category: 'client',
            event: 'rateLimit'
        });
    }
    async exec(info) {
        this.client.logger.error('Rate limit reached:');
        process.stderr.write(`${chalk_1.default.red(util_1.default.inspect(info, { depth: Infinity }))}`);
    }
}
exports.default = RateLimitListener;
//# sourceMappingURL=rateLimit.js.map