"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class ModCommand extends discord_akairo_1.Command {
    constructor() {
        super('mod', {
            aliases: ['mod'],
            description: {
                content: 'Adds or removes a moderator from a guild.',
                usage: '<add/remove> <member>'
            },
            category: 'mod',
            ratelimit: 2,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'method',
                    type: 'lowercase',
                    prompt: {
                        start: (message) => `${message.author}, would you like to add or remove a moderator?`
                    }
                },
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (message) => `${message.author}, who would you like to remove/make a moderator?`,
                        retry: (message) => `${message.author}, please provide a valid member.`
                    }
                }
            ]
        });
    }
    async exec(message, { method, member }) {
        const moderators = await this.client.settings.get(message.guild, 'moderators', []);
        if (moderators.length === 0)
            return message.util.send('The guild\'s moderators couldn\'t be fetched.');
        if (method === 'add') {
            if (moderators.includes(member.user.id))
                return message.util.send(`${member} is already a moderator.`);
            try {
                moderators.push(member.user.id);
                await this.client.settings.set(message.guild, 'moderators', moderators);
            }
            catch (_a) {
                return message.util.send('Something went wrong.');
            }
            return message.util.send(`${member} is now a moderator.`);
        }
        else if (method === 'remove') {
            if (!moderators.includes(member.user.id))
                return message.util.send(`${member} isn't a moderator.`);
            try {
                let newMods = [];
                moderators.forEach(m => {
                    if (m !== member.user.id)
                        newMods.push(m);
                });
                await this.client.settings.set(message.guild, 'moderators', newMods);
            }
            catch (_b) {
                return message.util.send('Something went wrong.');
            }
            return message.util.send(`${member} is no longer a moderator.`);
        }
        else {
            const prefix = await this.handler.prefix(message);
            return message.util.send(common_tags_1.stripIndents `
            That method doesn't exist on \`mod\`;
            Try \`${prefix}help mod\` for help.`);
        }
    }
}
exports.default = ModCommand;
