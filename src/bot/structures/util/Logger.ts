import chalk from 'chalk';
import moment from 'moment';
import util from 'util';

const items: string[] = [];
const format = '{ts}|{lt}: {txt}\n';

export class Logger {
    public static shared = new Logger();
    public get last() {
        return items;
    }

    public static log(content: any, { color, tag }: LoggerParam = { color: 'grey', tag: 'Log' }) {
        Logger.write(` ${content}`, { color, tag });
    }

    public static info(content: any, { color, tag }: LoggerParam = { color: 'green', tag: 'Info' }): void {
        Logger.write(content, { color, tag });
    }

    public static error(content: any, { color, tag }: LoggerParam = { color: 'red', tag: 'Error' }) {
        Logger.write(content, { color, tag, error: true });
    }

    public static write(content: any, { color, tag, error }: LoggerParam = { color: 'grey', tag: 'Log', error: false }) {
        const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`;
        const levelTag = `[${tag}]`;
        const text = Logger.clean(content);
        const stream = error ? process.stderr : process.stdout;
        const item = format
            .replace('{ts}', chalk.cyan(timestamp))
            .replace('{lt}', chalk.bold(levelTag))
            // @ts-ignore
            .replace('{txt}', chalk[color](text));
        items.push(item);
        stream.write(item);
    }

    public static clean(item: any) {
        if (typeof item === 'string') return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    }
}

export interface LoggerParam {
    color?: string | undefined;
    tag?: string | undefined;
    error?: boolean | undefined;
}