import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class BlacklistInhibitor extends Inhibitor {
    public constructor() {
        super('blacklist', {
            reason: 'blacklist'
        });
    }

    public async exec(message: Message): Promise<boolean> {
        const guildBlacklist: Array<string> = await this.client.settings.get(message.guild!, 'blacklist', []);
        const globalBlacklist: Array<string> = await this.client.settings.get('global', 'blacklist', []);
        if (!guildBlacklist || !globalBlacklist) return false;
        return guildBlacklist.includes(message.author!.id) || globalBlacklist.includes(message.author!.id);
    }
}