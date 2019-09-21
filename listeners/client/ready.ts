import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            category: 'client',
            event: 'ready',
            type: 'once'
        });
    }

    public async exec(): Promise<void> {
        this.client.logger.info(`Logged in as ${this.client.user!.tag}`);
        this.client.user!.setPresence({ activity: { 
            name: `${process.env.prefix}help`, type: 'PLAYING' 
        }, status: 'dnd' });

        if (this.client.voice!.connections.size > 0) this.client.voice!.connections.forEach(c => {
            c.channel.leave();
        });
    }
}