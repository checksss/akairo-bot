import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

export default class SomeoneCommand extends Command {
    public constructor() {
        super('someone', {
            aliases: ['someone'],
            description: {
                content: 'Mentions a random, online guild member.'
            },
            category: 'util',
            channel: 'guild',
            ratelimit: 1,
            cooldown: 10000
        });
    }

    public async exec(message: Message): Promise<Message | Message[]> {
        const member = message.guild!.members.filter(m => {
            return !m.user.bot && m.user.presence.status === 'online' && m.id !== message.author!.id;
        }).random();
        if (!member) return message.util!.reply('nobody is online');

        return message.util!.send(`${member}`);
    }
}