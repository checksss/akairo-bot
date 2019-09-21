"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static async checkDownload(client, message) {
        const attachment = message.attachments.find(x => ['.mp3'].includes(x.name.slice(-4)));
        if (!attachment)
            return;
        const reaction = await message.react('⬇');
        if (!reaction)
            return;
        const collector = message.createReactionCollector((r, u) => u.id === message.author.id, { time: 30000 })
            .on('collect', async () => {
            collector.stop();
            const messagesToDelete = [];
            const msg = await message.util.send('Downloading audio');
            const filename = await client.audioStorage.download(message.attachments.first().url);
            if (!filename)
                return message.util.send('Something went wrong');
            const duration = await client.audioStorage.duration(filename);
            if (duration < 1)
                return message.util.send('Something went wrong');
            client.audioStorage.add({
                user: message.author.id,
                guild: message.guild.id,
                type: filename
            });
        })
            .on('end', () => {
            reaction.users.remove(client.user);
        });
    }
}
exports.default = Utils;
