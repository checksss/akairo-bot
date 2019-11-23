"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ReadyListener extends discord_akairo_1.Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            category: 'client',
            event: 'ready',
        });
    }
    async exec() {
        this.client.logger.info(`Logged in as ${this.client.user.tag}`);
        this.client.user.setPresence({ activity: {
                name: `${process.env.prefix}help`, type: 'PLAYING'
            }, status: 'dnd' });
        if (this.client.voice.connections.size > 0)
            this.client.voice.connections.forEach(c => {
                c.channel.leave();
            });
    }
}
exports.default = ReadyListener;
