import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

export default class BlacklistCommand extends Command {
    public constructor() {
        super('blacklist', {
            aliases: ['blacklist', 'unblacklist'],
            description: {
                content: 'Prohibits/Allows a user from/to using Akairo Bot',
                usage: '<user>',
                examples: ['Badkin', '@Meatloaf Dispenser', '449322584698257408']
            },
            category: 'util',
            ownerOnly: true,
            ratelimit: 2,
            args: [
                {
                    id: 'user',
                    match: 'content',
                    type: 'user',
                    prompt: {
                        start: (message: Message): string => `${message.author}, who would you like to blacklist/allow?`,
                        retry: (message: Message): string => `${message.author}, please provide a valid user.`
                    }
                },
                {
                    id: 'globalFlag',
                    type: 'flag',
                    flag: ['-g', '--global']
                }
            ]
        });
    }

    public async exec(message: Message, { user, globalFlag }: { user: User, globalFlag: boolean }): Promise<Message | Message[]> {
        const global: boolean = this.client.isOwner(message.author!) && globalFlag;
        const blacklist: Array<string | null> = await this.client.settings.get('global', 'blacklist', []);
        if (global) {
            if (blacklist.includes(user.id)) {
                const index = blacklist.indexOf(user.id);
                blacklist.splice(index, 1);
                if (blacklist.length === 0) await this.client.settings.set('global', 'blacklist', []);
                else this.client.settings.set('global', 'blacklist', blacklist);
                const guildBlacklist: Array<string> = await this.client.settings.get(message.guild!, 'blacklist', []);
                if (guildBlacklist.includes(user.id)) return message.util!.send(`${user}, you're still blacklisted locally.`);
                return message.util!.send(`${user.tag}, welcome back.`);
            }
            blacklist.push(user.id);
            await this.client.settings.set('global', 'blacklist', blacklist);
            return message.util!.send(`${user}, shame on you.`);
        } else {
            if (blacklist.includes(user.id)) {
                const index = blacklist.indexOf(user.id);
                blacklist.splice(index, 1);
                if (blacklist.length === 0) await this.client.settings.set(message.guild!, 'blacklist', []);
                else this.client.settings.set(message.guild!, 'blacklist', blacklist);
                const globalBlacklist: Array<string> = await this.client.settings.get('global', 'blacklist', []);
                if (globalBlacklist.includes(user.id)) return message.util!.send(`${user}, you're still blacklisted globally.`);
                return message.util!.send(`${user.tag}, welcome back.`);
            }
            blacklist.push(user.id);
            await this.client.settings.set(message.guild!, 'blacklist', blacklist);
            return message.util!.send(`${user}, you've been blacklist.`);

        }
    }
}