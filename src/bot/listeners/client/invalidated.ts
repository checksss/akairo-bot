import { Listener } from 'discord-akairo';

export default class InvalidatedListener extends Listener {
    public constructor() {
        super('invalidated', {
            emitter: 'client',
            category: 'client',
            event: 'invalidated'
        });
    }

    public async exec(): Promise<void> {
        this.client.logger.error('Session invalidated');
        process.exit();
    }
}