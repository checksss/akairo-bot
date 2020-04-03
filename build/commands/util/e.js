"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const child_process_1 = require("child_process");
class ECommand extends discord_akairo_1.Command {
    constructor() {
        super('e', {
            aliases: ['e'],
            description: {
                content: 'Runs shell commands',
                usage: '<command> [...args]',
                examples: ['pwd', 'curl http://akairo.org/']
            },
            category: 'util',
            ownerOnly: true,
            args: [
                {
                    id: 'content',
                    match: 'rest',
                    prompt: {
                        start: (message) => `${message.author}, what would you like to execute?`,
                    }
                },
            ],
        });
    }
    async exec(message, { content }) {
        return child_process_1.exec(content, async (error, stdout) => {
            let output = (error || stdout);
            output = discord_js_1.Util.splitMessage(`\`\`\`javascript\n${output}\`\`\``);
            console.log(output);
            for (const o of output)
                message.util.send(o);
        });
    }
}
exports.default = ECommand;
//# sourceMappingURL=e.js.map