"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class ToggleCommand extends discord_akairo_1.Command {
    constructor() {
        super('toggle', {
            aliases: ['toggle'],
            description: {
                content: common_tags_1.stripIndents `Available keys:
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
    *args() {
        const method = yield {
            type: [
                ['toggle-token-filtering', 'tokenFiltering', 'token'],
                ['toggle-reaction-downloading', 'reactionDownloading', 'reaction']
            ],
            otherwise: async (msg) => {
                const prefix = await this.handler.prefix(msg);
                return common_tags_1.stripIndents `
                    That method doesn't exist on toggle.
                    Try using \`${prefix} help toggle\` for help.`;
            }
        };
        return discord_akairo_1.Flag.continue(method);
    }
}
exports.default = ToggleCommand;
//# sourceMappingURL=toggle.js.map