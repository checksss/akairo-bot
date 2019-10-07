import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import { exec, ChildProcess } from 'child_process';

export default class ECommand extends Command {
    public constructor() {
        super('e', {
            aliases: ['e'],
            description: {
                content: 'Runs shell commands',
                usage: '<command> [...args]',
                examples: ['pwd', 'curl http://akairo.org/']
            },
            category: 'util',
            ownerOnly: true,
            args: [
                {
                    id: 'content',
                    match: 'rest',
                    prompt: {
                        start: (message: Message) => `${message.author}, what would you like to execute?`,
                    }
                },
            ],
        });
    }

    public async exec(message: Message, { content }: { content: string }): Promise<ChildProcess> {
        return exec(content, async (error, stdout): Promise<void> => {
            let output = (error || stdout) as string | string[];
            output = Util.splitMessage(`\`\`\`javascript\n${output}\`\`\``);
            console.log(output);
            for (const o of output) message.util!.send(o);
        });
    }
}