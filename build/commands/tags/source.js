"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class TagSourceCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-source', {
            category: 'tags',
            description: {
                content: 'Displays a tag\'s source',
                usage: '[--file/-f] <tag>'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'file',
                    match: 'flag',
                    flag: ['--file', '-f']
                },
                {
                    id: 'tag',
                    match: 'rest',
                    type: 'tag',
                    prompt: {
                        start: (message) => `${message.author}, what tag would you like the source of?`,
                        retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value}** doesn't exist.`
                    }
                }
            ]
        });
    }
    async exec(message, { tag, file }) {
        return message.util.send(tag.content, {
            code: 'md',
            files: file ? [{
                    attachment: Buffer.from(tag.content.replace(/\n/g, '\r\n'), 'utf8'),
                    name: `${tag.name}_source.txt`
                }] : undefined
        });
    }
}
exports.default = TagSourceCommand;
//# sourceMappingURL=source.js.map