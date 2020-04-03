"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const util_1 = tslib_1.__importDefault(require("util"));
const items = [];
const format = '{ts}|{lt}: {txt}\n';
class Logger {
    get last() {
        return items;
    }
    static log(content, { color, tag } = { color: 'grey', tag: 'Log' }) {
        Logger.write(` ${content}`, { color, tag });
    }
    static info(content, { color, tag } = { color: 'green', tag: 'Info' }) {
        Logger.write(content, { color, tag });
    }
    static error(content, { color, tag } = { color: 'red', tag: 'Error' }) {
        Logger.write(content, { color, tag, error: true });
    }
    static write(content, { color, tag, error } = { color: 'grey', tag: 'Log', error: false }) {
        const timestamp = `[${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}]`;
        const levelTag = `[${tag}]`;
        const text = Logger.clean(content);
        const stream = error ? process.stderr : process.stdout;
        const item = format
            .replace('{ts}', chalk_1.default.cyan(timestamp))
            .replace('{lt}', chalk_1.default.bold(levelTag))
            .replace('{txt}', chalk_1.default[color](text));
        items.push(item);
        stream.write(item);
    }
    static clean(item) {
        if (typeof item === 'string')
            return item;
        const cleaned = util_1.default.inspect(item, { depth: Infinity });
        return cleaned;
    }
}
exports.Logger = Logger;
Logger.shared = new Logger();
//# sourceMappingURL=Logger.js.map