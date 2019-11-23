import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class ModCommand extends Command {
    public constructor() {
        super('mod', {
            aliases: ['mod'],
            description: {
                content: 'Adds or removes a moderator from a guild.',
                usage: '<add/remove> <member>'
            },
            category: 'mod',
            ratelimit: 2,
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'method',
                    type: 'lowercase',
                    prompt: {
                        start: (message: Message): string => `${message.author}, would you like to add or remove a moderator?`
                    }
                },
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (message: Message): string => `${message.author}, who would you like to remove/make a moderator?`,
                        retry: (message: Message): string => `${message.author}, please provide a valid member.`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { method, member }: { method: string, member: GuildMember }): Promise<Message | Message[]> {
        const moderators: Array<string> = await this.client.settings.get(message.guild!, 'moderators', []);
        if (moderators.length === 0) return message.util!.send('The guild\'s moderators couldn\'t be fetched.');

        if (method === 'add') {
            if (moderators.includes(member.user.id)) return message.util!.send(`${member} is already a moderator.`);
            try {
                moderators.push(member.user.id);
                await this.client.settings.set(message.guild!, 'moderators', moderators);
            } catch {
                return message.util!.send('Something went wrong.');
            }

            return message.util!.send(`${member} is now a moderator.`);
        } else if (method === 'remove') {
            if (!moderators.includes(member.user.id)) return message.util!.send(`${member} isn't a moderator.`);
            try {
                let newMods: Array<string> = [];
                moderators.forEach(m => {
                    if (m !== member.user.id) newMods.push(m);
                });
                await this.client.settings.set(message.guild!, 'moderators', newMods);
            } catch {
                return message.util!.send('Something went wrong.');
            }

            return message.util!.send(`${member} is no longer a moderator.`);
        } else {
            const prefix = await (this.handler.prefix as PrefixSupplier)(message);
            return message.util!.send(stripIndents`
            That method doesn't exist on \`mod\`;
            Try \`${prefix}help mod\` for help.`);
        }
    }
}