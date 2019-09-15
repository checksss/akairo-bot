import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';

export default class MessageListener extends Listener {
    public constructor() {
        super('message', {
            emitter: 'client',
            category: 'client',
            event: 'message'
        });
    }

    public async exec(message: Message): Promise<void> {
        const moderators = await this.client.settings.get(message.guild!, 'moderators', [message.guild!.owner!.id]);
        const inviteReg = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/gi;
        if (inviteReg.test(message.content) && !moderators.includes(message.author!.id)) message.delete();
        
        this.client.cache.set(message.id, message);
    }
}