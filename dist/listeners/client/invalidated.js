"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class InvalidatedListener extends discord_akairo_1.Listener {
    constructor() {
        super('invalidated', {
            emitter: 'client',
            category: 'client',
            event: 'invalidated'
        });
    }
    async exec() {
        console.log('Session Invalidated');
        process.exit();
    }
}
exports.default = InvalidatedListener;
