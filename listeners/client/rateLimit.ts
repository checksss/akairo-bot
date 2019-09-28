import { Listener } from 'discord-akairo';
import { RateLimitData } from 'discord.js';

export default class RateLimitListener extends Listener {
    public constructor() {
        super('rateLimit', {
            emitter: 'client',
            category: 'client',
            event: 'rateLimit'
        });
    }

    public async exec(info: RateLimitData): Promise<void> {
        this.client.logger.error(`Rate limit reached: ${info}`);
        process.exit();
    }
}