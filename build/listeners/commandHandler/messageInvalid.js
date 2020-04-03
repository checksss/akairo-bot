"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class MessageInvalidListener extends discord_akairo_1.Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            category: 'commandHandler',
            event: 'messageInvalid'
        });
    }
    async exec(message) {
        if (message.guild && message.util.parsed.prefix) {
            const prefix = this.client.commandHandler.modules.get('prefix');
            if (!message.util.parsed.afterPrefix)
                return this.client.commandHandler.runCommand(message, prefix, ['get']);
            if (!message.util.parsed.alias)
                return;
            const tagShow = this.client.commandHandler.modules.get('tag-show');
            return this.client.commandHandler.runCommand(message, tagShow, await tagShow.parse(message, message.util.parsed.afterPrefix));
        }
    }
}
exports.default = MessageInvalidListener;
//# sourceMappingURL=messageInvalid.js.map