"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class TagCommand extends discord_akairo_1.Command {
    constructor() {
        super('tag', {
            aliases: ['tag'],
            description: {
                content: common_tags_1.stripIndents `Available methods:
					 • show \`<tag>\`
					 • add \`[--hoist/--pin] <tag> <content>\`
					 • alias \`<--add/--del> <tag> <tagalias>\`
					 • del \`<tag>\`
					 • edit \`[--hoist/--unhoist] <tag> <content>\`
					 • source \`[--file] <tag>\`
					 • info \`<tag>\`
					 • search \`<tag>\`
					 • list \`[member]\`
					 • download \`[member]\`
					Required: \`<>\` | Optional: \`[]\`
					For additional \`<...arguments>\` usage refer to the examples below.
				`,
                usage: '<method> <...arguments>',
                examples: [
                    'show Test',
                    'add Test Test',
                    'add --hoist/--pin "Test 2" Test2',
                    'alias --add Test1 Test2',
                    'alias --del "Test 2" "Test 3"',
                    'del Test',
                    'edit Test Some new content',
                    'edit "Test 1" Some more new content',
                    'edit Test --hoist',
                    'edit Test --unhoist Some more new content',
                    'source Test',
                    'source --file Test',
                    'info Test',
                    'search Test',
                    'list @Crawl',
                    'download @Crawl'
                ]
            },
            category: 'tags',
            channel: 'guild',
            ratelimit: 2
        });
    }
    *args() {
        const method = yield {
            type: [
                ['tag-show', 'show'],
                ['tag-add', 'add'],
                ['tag-alias', 'alias'],
                ['tag-delete', 'del', 'delete', 'remove', 'rm'],
                ['tag-edit', 'edit'],
                ['tag-source', 'source'],
                ['tag-info', 'info'],
                ['tag-search', 'search'],
                ['tag-list', 'list'],
                ['tag-download', 'download', 'dl']
            ],
            otherwise: async (msg) => {
                const prefix = await this.handler.prefix(msg);
                return common_tags_1.stripIndents `
                    That method doesn't exist on \`tag\`;
                    Try \`${prefix}help tag\` for help.`;
            }
        };
        return discord_akairo_1.Flag.continue(method);
    }
}
exports.default = TagCommand;
