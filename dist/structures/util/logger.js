"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const util_1 = __importDefault(require("util"));
class Logger {
    static log(content, { color = 'grey', tag = 'Log' } = {}) {
        this.write(content, { color, tag });
    }
    static info(content, { color = 'green', tag = 'Info' } = {}) {
        this.write(content, { color, tag });
    }
    static error(content, { color = 'red', tag = 'Error' } = {}) {
        this.write(content, { color, tag, error: true });
    }
    static stacktrace(content, { color = 'red', tag = 'Error' } = {}) {
        this.write(content, { color, tag, error: true });
    }
    static write(content, { color = 'grey', tag = 'Log', error = false } = {}) {
        const timestamp = chalk_1.default.cyan(`[${moment_1.default().format('YYYY-MM-DD HH:mm:ss')}]:`);
        const levelTag = chalk_1.default.bold(`[${tag}]:`);
        // @ts-ignore
        const text = chalk_1.default[color](this.clean(content));
        const stream = error ? process.stderr : process.stdout;
        stream.write(`${timestamp} ${levelTag} ${text}\n`);
    }
    static clean(item) {
        if (typeof item === 'string')
            return item;
        const cleaned = util_1.default.inspect(item, { depth: Infinity });
        return cleaned;
    }
}
exports.Logger = Logger;
