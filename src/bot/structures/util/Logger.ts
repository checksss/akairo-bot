import chalk from 'chalk';
import moment from 'moment';
import util from 'util';

export class Logger implements Logger {
    public static log(content: any, { color = 'grey', tag = 'Log' }: LoggerParam = {}) {
        this.write(content, { color, tag });
    }

    public static info(content: any, { color = 'green', tag = 'Info' }: LoggerParam = {}): void {
        this.write(content, { color, tag });
    }

    public static error(content: any, { color = 'red', tag = 'Error' }: LoggerParam = {}) {
        this.write(content, { color, tag, error: true });
    }

    public static stacktrace(content: any, { color = 'red', tag = 'Error'}: LoggerParam = {}) {
        this.write(content, { color, tag, error: true });
    }

    public static write(content: any, { color = 'grey', tag = 'Log', error = false }: LoggerParam = {}) {
        const timestamp = chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`);
        const levelTag = chalk.bold(`[${tag}]:`);
        // @ts-ignore
        const text = chalk[color](this.clean(content));
        const stream = error ? process.stderr : process.stdout;
        stream.write(`${timestamp} ${levelTag} ${text}\n`);
    }

    public static clean(item: any) {
        if (typeof item === 'string') return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    }
}

export interface Logger {
    log(content: any, { color, tag }?: LoggerParam): void;
    info(content: any, { color, tag }?: LoggerParam): void;
    error(content: any, { color, tag }?: LoggerParam): void;
    stacktrace(content: any, { color, tag }?: LoggerParam): void;
}

interface LoggerParam {
    color?: string | undefined;
    tag?: string | undefined;
    error?: boolean | undefined;
}