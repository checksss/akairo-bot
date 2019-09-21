import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

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
        const embed1 = new MessageEmbed().setColor([155, 200, 200]).setDescription('Pinging...');
        const m = await message.util!.send(embed1);
        const embed = new MessageEmbed()
            .setColor([155, 200, 200])
            // @ts-ignore
            .setDescription(`🏓 **${Math.round(this.client.ws.ping).toString()}**ms`);

        // @ts-ignore
        return m.edit(embed);
    }
}