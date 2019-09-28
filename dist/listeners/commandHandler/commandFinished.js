"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class CommandFinishedListener extends discord_akairo_1.Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            category: 'commandHandler',
            event: 'commandFinished'
        });
    }
    async exec(message, command) {
        this.client.logger.info(`${message.author.tag} ran ${command.id}`);
    }
}
exports.default = CommandFinishedListener;
