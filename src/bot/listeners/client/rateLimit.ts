import { Listener } from 'discord-akairo';
import { RateLimitData } from 'discord.js';
import util from 'util';
import chalk from 'chalk';

export default class RateLimitListener extends Listener {
    public constructor() {
        super('rateLimit', {
            emitter: 'client',
            category: 'client',
            event: 'rateLimit'
        });
    }

    public async exec(info: RateLimitData): Promise<void> {
        this.client.logger.error('Rate limit reached:');
        process.stderr.write(`${chalk.red(util.inspect(info, { depth: Infinity }))}`);
    }
}