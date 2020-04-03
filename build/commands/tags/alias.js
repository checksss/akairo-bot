"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Tags_1 = require("../../structures/models/Tags");
class TagAliasCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag-alias', {
            category: 'tags',
            description: {
                content: '<--add/--del> <tag> <alias>',
                examples: ['--add Test1 Test2', '--del "test2" "test3', '"test 4" "test 5" --add']
            },
            channel: 'guild',
            ratelimit: 2,
            flags: ['--add', '--del']
        });
    }
    *args() {
        const first = yield {
            type: 'tag',
            prompt: {
                start: (message) => `${message.author}, what tag would you like to alias?`,
                retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value}** does not exist.`
            }
        };
        const add = yield {
            match: 'flag',
            flag: '--add'
        };
        const del = yield {
            match: 'flag',
            flag: '--del'
        };
        const second = yield (add ? {
            match: 'rest',
            type: 'existingTag',
            prompt: {
                start: (message) => `${message.author}, what alias would you like to add to this tag?`,
                retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value}** already exists.`
            }
        } : {
            match: 'rest',
            type: 'string',
            prompt: {
                start: (message) => `${message.author}, what's the alias you want to remove from this tag?`,
                retry: (message, { failure }) => `${message.author}, a tag with the name **${failure.value}** already exists.`
            }
        });
        return { first, second, add, del };
    }
    async exec(message, { first, second, add, del }) {
        if (add) {
            if (second && second.length >= 1900) {
                return message.util.reply('messages have a 2000-character limit');
            }
        }
        else if (del) {
            const index = first.aliases.indexOf(second);
            first.aliases.splice(index, 1);
        }
        else {
            return message.util.reply('you have to either supply `--add` or `--del.`');
        }
        const tag = await Tags_1.Tags.findOne({ guild: message.guild.id, name: String(first.name) });
        first.last_modified = message.author.id;
        await Tags_1.Tags.updateOne(tag, first);
        return message.util.reply(`alias ${second.substring(0, 1900)} ${add ? 'added to' : 'deleted from'} tag ${first.name}.`);
    }
}
exports.default = TagAliasCommand;
//# sourceMappingURL=alias.js.map