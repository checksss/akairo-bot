"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const util = tslib_1.__importStar(require("util"));
const common_tags_1 = require("common-tags");
const NL = '!!NL!!';
const NL_PATTERN = new RegExp(NL, 'g');
class EvalCommand extends discord_akairo_1.Command {
    constructor() {
        super('eval', {
            aliases: ['eval'],
            description: {
                content: 'Evaluates JavaScript.',
                usage: '<code>'
            },
            category: 'util',
            ownerOnly: true,
            ratelimit: 2,
            args: [
                {
                    id: 'code',
                    match: 'rest',
                    type: 'sring',
                    prompt: {
                        start: (message) => `${message.author}, what would you like to evaluate?`
                    }
                },
                {
                    id: 'noreturn',
                    type: 'boolean',
                    match: 'flag',
                    flag: ['--noreturn', '-nr'],
                },
            ],
        });
        this.lastResult = null;
    }
    async exec(message, { code, noreturn }) {
        let hrDiff;
        try {
            const hrStart = process.hrtime();
            this.lastResult = eval(code);
            hrDiff = process.hrtime(hrStart);
        }
        catch (error) {
            return message.util.send(`Error while evaluating: \`${error}\``);
        }
        this.hrStart = process.hrtime();
        const result = this._result(this.lastResult, hrDiff, code);
        if (noreturn)
            return message.util.send(`*Executed in **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.***`);
        if (Array.isArray(result))
            return result.map(async (res) => message.util.send(res));
        return message.util.send(result);
    }
    _result(result, hrDiff, input = null) {
        const inspected = util.inspect(result, { depth: 0 })
            .replace(NL_PATTERN, '\n')
            .replace(this.sensitivePattern, '--snip--');
        const split = inspected.split('\n');
        const last = inspected.length - 1;
        const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== '\'' ? split[0] : inspected[0];
        const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== '\'' ? split[split.length - 1] : inspected[last];
        const prepend = `\`\`\`javascript\n${prependPart}\n`;
        const append = `\n${appendPart}\n\`\`\``;
        if (input) {
            return discord_js_1.Util.splitMessage(common_tags_1.stripIndents `
				*Executed in **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.***
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
        }
        return discord_js_1.Util.splitMessage(common_tags_1.stripIndents `
            *Callback executed after **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.***
            \`\`\`javascript
            ${inspected}
            \`\`\`
        `, { maxLength: 1900, prepend, append });
    }
    get sensitivePattern() {
        if (!this._sensitivePattern) {
            const token = this.client.token.split('').join('[^]{0,2}');
            const revToken = this.client.token.split('').reverse().join('[^]{0,2}');
            Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(`${token}|${revToken}`, 'g') });
        }
        return this._sensitivePattern;
    }
}
exports.default = EvalCommand;
//# sourceMappingURL=eval.js.map