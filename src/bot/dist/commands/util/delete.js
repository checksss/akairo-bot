"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class DeleteCommand extends discord_akairo_1.Command {
    constructor() {
        super('delete', {
            aliases: ['delete'],
            description: {
                content: 'Deletes a specific number of messages.',
                usage: '<amount>'
            },
            category: 'util',
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            ratelimit: 2,
            args: [
                {
                    id: 'amount',
                    type: 'integer',
                    prompt: {
                        start: (message) => `${message.author}, how many message would you like to delete?`,
                        retry: (message) => `${message.author}, please enter a valid integer.`
                    }
                }
            ]
        });
    }
    async exec(message, { amount }) {
        if (amount < 1 || amount > 100)
            return message.util.send('You can only delete between 1 and 100 messages.');
        try {
            message.channel.bulkDelete(amount + 1, true).then((msgs) => {
                const embed = new discord_js_1.MessageEmbed()
                    .setColor([155, 200, 200])
                    .setDescription(`${msgs.size} ${msgs.size > 1 ? 'messages were' : 'message was'} deleted`);
                message.util.send(embed).then(m => {
                    m.delete({ timeout: 3000 });
                });
            });
        }
        catch (_a) {
            const fail = new discord_js_1.MessageEmbed()
                .setColor([245, 155, 55])
                .setDescription('Something went wrong.');
            return message.util.send(fail);
        }
    }
}
exports.default = DeleteCommand;
