import { join } from 'path';
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, Flag } from 'discord-akairo';
import { Message, Util, Collection, Guild, VoiceChannel, TextChannel, DMChannel, VoiceConnection } from 'discord.js';
import mongoose from 'mongoose';
import SettingsProvider from '../structures/providers/SettingsProvider';
import { Tags } from '../structures/models/Tags';
require('dotenv').config();

declare module 'discord-akairo' {
    interface AkairoClient {
        settings: SettingsProvider,
        commandHandler: CommandHandler,
        config: AkairoBotOptions,
        cache: Collection<string, Message>
    }
}

interface AkairoBotOptions {
    owner?: string,
    token?: string
}

export default class AkairoBotClient extends AkairoClient {
    public settings!: SettingsProvider;

    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, '..', 'commands'),
        prefix: async (message: Message): Promise<string> => await this.settings.get(message.guild!, 'prefix', process.env.prefix),
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 3000,
        argumentDefaults: {
            prompt: {
                modifyStart: (_, str): string => `${str}\nType \`cancel\` to cancel the command.`,
                modifyRetry: (_, str): string => `${str}\nType \`cancel\` to cancel the command.`,
                timeout: 'Error: Command timed out',
                ended: 'Error: Too many attemps',
                cancel: 'Command cancelled',
                retries: 3,
                time: 30000
            },
            otherwise: ''
        }
    });

    public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
        directory: join(__dirname, '..', 'inhibitors')
    });

    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, '..', 'listeners')
    });

    public config: AkairoBotOptions;

    public cache: Collection<string, Message>;

    public constructor(config: AkairoBotOptions) {
        super({ ownerID: config.owner }, {
            messageCacheMaxSize: 1000,
            disableEveryone: true
        });

        this.commandHandler.resolver.addType('tag', async (message, phrase): Promise<any> => {
            if (!phrase) return Flag.fail(phrase);
            phrase = Util.cleanContent(phrase.toLowerCase(), message);

            let tag; 
            try {
                tag = await Tags.findOne({ guild: message.guild!.id, name: phrase });
                if (!tag) tag = await Tags.findOne({ guild: message.guild!.id, aliases: phrase });
            } catch {}

            return tag || Flag.fail(phrase);
        });

        this.commandHandler.resolver.addType('existingTag', async (message, phrase): Promise<any> => {
            if (!phrase) return Flag.fail(phrase);
            phrase = Util.cleanContent(phrase, message);
            let tag;
            try {
                tag = await Tags.findOne({ guild: message.guild!.id, name: phrase });
                if (!tag) tag = await Tags.findOne({ guild: message.guild!.id, aliases: phrase });
            } catch {}

            return tag ? Flag.fail(phrase) : phrase;
        });

        this.commandHandler.resolver.addType('tagContent', async (message, phrase): Promise<any> => {
            if (!phrase) phrase = '';
            phrase = Util.cleanContent(phrase, message);
            if (message.attachments.first()) phrase += `\n${message.attachments.first()!.url}`;

            return phrase || Flag.fail(phrase);
        });

        this.config = config;

        this.cache = new Collection<string, Message>();
    }

    private async _init(): Promise<void> {
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });

        this.commandHandler.loadAll();
        this.inhibitorHandler.loadAll();
        this.listenerHandler.loadAll();

        this.settings = new SettingsProvider();
        await this.settings.init();
    }

    public async start(): Promise<string> {
        try {
            await mongoose.connect(process.env.mongo as string, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
        } catch (e) {
            console.log(e);
            return process.exit();
        }

        await this._init();
        return this.login(this.config.token);
    }
}