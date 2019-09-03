"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class BlacklistCommand extends discord_akairo_1.Command {
    constructor() {
        super('blacklist', {
            aliases: ['blacklist', 'unblacklist'],
            description: {
                content: 'Prohibits/Allows a user from/to using Akairo Bot',
                usage: '<user>',
                examples: ['Badkin', '@Meatloaf Dispenser', '449322584698257408']
            },
            category: 'util',
            ownerOnly: true,
            ratelimit: 2,
            args: [
                {
                    id: 'user',
                    match: 'content',
                    type: 'user',
                    prompt: {
                        start: (message) => `${message.author}, who would you like to blacklist/allow?`
                    }
                }
            ]
        });
    }
    async exec(message, { user }) {
        const blacklist = await this.client.settings.get('global', 'blacklist', []);
        if (blacklist.includes(user.id)) {
            const index = blacklist.indexOf(user.id);
            blacklist.splice(index, 1);
            if (blacklist.length === 0)
                await this.client.settings.set('global', 'blacklist', []);
            else
                this.client.settings.set('global', 'blacklist', blacklist);
            return message.util.send(`${user.tag}, welcome back.`);
        }
        blacklist.push(user.id);
        await this.client.settings.set('global', 'blacklist', blacklist);
        return message.util.send(`${user.tag}, shame on you.`);
    }
}
exports.default = BlacklistCommand;
