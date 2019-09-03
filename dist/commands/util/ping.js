"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class PingCommand extends discord_akairo_1.Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: 'Gets the bot\'s heartbeat and latency'
            },
            category: 'util',
            ratelimit: 2,
        });
    }
    async exec(message) {
        const m = await message.channel.send('Pinging...');
        return m.edit(common_tags_1.stripIndents `
            Ping: \`$(ping)ms\`
            Heartbeat: \`$(heartbeat)ms\``
            .replace('$(ping)', ((m.editedTimestamp || m.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)).toString())
            .replace('$(heartbeat)', Math.round(this.client.ws.ping).toString()));
    }
}
exports.default = PingCommand;
