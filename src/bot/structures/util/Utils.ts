import AkairoClient from '../../client/AkairoBotClient';
import { Message, MessageReaction, ReactionEmoji, User } from 'discord.js';

export class Utils {
    static async checkDownload(client: AkairoClient, message: Message): Promise<void> {
        const attachment = message.attachments.find(x => ['.mp3'].includes(x.name!.slice(-4)));
        if (!attachment) return;

        const reaction: MessageReaction = await message.react('⬇');
        if (!reaction) return;
        const collector = message.createReactionCollector(
            (r: ReactionEmoji, u: User) => u.id === message.author!.id,
            { time: 30000 }
        )
            .on('collect', async () => {
                collector.stop();
                const messagesToDelete: Message[] = [];
                const msg = await message.util!.send('Downloading audio');
                const filename = await client.audioStorage.download(message.attachments.first()!.url);
                if (!filename) return message.util!.send('Something went wrong');

                const duration = await client.audioStorage.duration(filename);
                if (duration < 1) return message.util!.send('Something went wrong');
                client.audioStorage.add({
                    user: message.author!.id,
                    guild: message.guild!.id,
                    type: filename
                });
            })
            .on('end', () => {
                reaction.users.remove(client.user!)
            })
    }
}