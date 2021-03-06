import { Command, Flag, PrefixSupplier } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class TagCommand extends Command {
    public constructor() {
        super('tag', {
            aliases: ['tag'],
            description: {
                content: stripIndents`Available methods:
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
                    'add "Test 2" Test2',
                    'alias --add Test1 Test2',
                    'alias --del "Test 2" "Test 3"',
                    'del Test',
                    'edit Test Some new content',
                    'edit "Test 1" Some more new content',
                    'source Test',
                    'source --file Test',
                    'info Test',
                    'search Test',
                    'list @badkin',
                    'download @meatloaf dispenser'
                ]
            },
            category: 'tags',
            channel: 'guild',
            ratelimit: 2
        });
    }

    public *args(): object {
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
            otherwise: async (msg: Message) => {
                const prefix = await (this.handler.prefix as PrefixSupplier)(msg);
                return stripIndents`
                    That method doesn't exist on \`tag\`;
                    Try \`${prefix}help tag\` for help.`;
            }
        };
        return Flag.continue(method);
    }
}