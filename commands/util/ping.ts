import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: 'Gets the bot\'s heartbeat and latency'
            },
            category: 'util',
            ratelimit: 2,
        });
    }

    public async exec(message: Message): Promise<Message> {
        const m: Message | Message[] = await message.channel.send('Pinging...');

        return m.edit(stripIndents`
            Ping: \`$(ping)ms\`
            Heartbeat: \`$(heartbeat)ms\``
            .replace('$(ping)', ((m.editedTimestamp || m.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)).toString())
            .replace('$(heartbeat)', Math.round(this.client.ws.ping).toString())
        );
    }
}