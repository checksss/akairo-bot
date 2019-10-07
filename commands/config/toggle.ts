import { Command, Flag, PrefixSupplier } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class ToggleCommand extends Command {
    public constructor() {
        super('toggle', {
            aliases: ['toggle'],
            description: {
                content: stripIndents`Available keys:
                    • tokenfiltering
                Required: \`<>\` | Optional: \`[]\`
                `,
                usage: '<method> <...arguments>'
            },
            category: 'config',
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 2
        });
    }

    public *args(): object {
        const method = yield {
            type: [
                ['toggle-token-filtering', 'tokenFiltering', 'token'],
                ['toggle-reaction-downloading', 'reactionDownloading', 'reaction']
            ],
            otherwise: async (msg: Message): Promise<string> => {
                const prefix = await (this.handler.prefix as PrefixSupplier)(msg);
                return stripIndents`
                    That method doesn't exist on toggle.
                    Try using \`${prefix} help toggle\` for help.`;
            }
        }

        return Flag.continue(method);
    }
}