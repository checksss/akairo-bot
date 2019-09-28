import { join } from 'path';
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, Flag } from 'discord-akairo';
import { Message, Util, Collection, ColorResolvable, GuildMember, Guild, VoiceChannel, TextChannel, DMChannel, VoiceConnection } from 'discord.js';
import express from 'express';

import mongoose from 'mongoose';
import SettingsProvider from '../structures/providers/SettingsProvider';
import { Tags } from '../structures/models/Tags';
import { Logger } from '../structures/util/Logger';
import 'dotenv/config';

declare module 'discord-akairo' {
    interface AkairoClient {
        settings: SettingsProvider,
        commandHandler: CommandHandler,
        config: AkairoBotOptions,
        cache: Collection<string, Message>
        audioStorage: any,
        logger: Logger,
        constants: ClientConstants
    }
}

interface AkairoBotOptions {
    owner?: string,
    token?: string
}

interface ClientConstants {
    infoEmbed: ColorResolvable,
    memberAdd: ColorResolvable,
    memberRemove: ColorResolvable,
    guildAdd: ColorResolvable,
    guildRemove: ColorResolvable
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

    public logger: Logger;

    public constants: ClientConstants;

    public constructor(config: AkairoBotOptions) {
        super({ ownerID: config.owner }, {
            messageCacheMaxSize: 1000,
            disableEveryone: true,
            shardCount: 2
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

        this.logger = Logger;

        this.constants = {
            infoEmbed: [155, 200, 200],
            memberAdd: [125, 235, 75],
            memberRemove: [245, 155, 55],
            guildAdd: [125, 235, 75],
            guildRemove: [255, 80, 55]
        }
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
        this.logger.log(`Commands loaded: ${this.commandHandler.modules.size}`);
        this.inhibitorHandler.loadAll();
        this.logger.log(`Inhibitors loaded: ${this.inhibitorHandler.modules.size}`)
        this.listenerHandler.loadAll();
        this.logger.log(`Listeners loaded: ${this.listenerHandler.modules.size}`);

        this.settings = new SettingsProvider();
        await this.settings.init();
        this.logger.log('Settings provider initialized');

        const port = process.env.port || 8080;
        express().all('*', (req: express.Request, res: express.Response) => {
            const content = {
                info: { guilds: this.guilds.size, users: this.guilds.reduce((a, b) => a + b.memberCount, 0), channels: this.channels.size },
                client: { commands: this.commandHandler.modules.size, listeners: this.listenerHandler.modules.size, inhibitors: this.inhibitorHandler.modules.size },
                shards: this.ws.shards.map(s => { return { id: s.id, status: s.status, ping: Math.round(s.ping) }; })
            };

            res.json(content);
            res.status(this.ws.shards.every(s => s.status === 0) ? 200 : 500).end();
        }).listen(port, () => Logger.log(`Listening on port ${port}`));

        process.on('uncaughtException', (err) => this.logger.error(err.stack));
        process.on('unhandledRejection', async (reason) => this.logger.error(`Unhandled Rejection: ${reason ? reason : 'no reason'}`));
        
        this.on('shardReady', (id: number) => this.logger.info(`Shard ${id} ready`));
        this.on('shardDisconnect', (event, id: number) => this.logger.error(`Shard ${id} disconnected`));
        this.on('shardError', (error: Error, id: number) => this.logger.error(`Shard ${id} error: ${error.message}`));
    }

    public async start(): Promise<string> {
        try {
            await mongoose.connect(process.env.mongo as string, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
            this.logger.log('MongoDB connected');
        } catch (e) {
            this.logger.error(`Failed to connect to MongoDB`);
            this.logger.error(e);
            return process.exit();
        }

        await this._init();
        return this.login(this.config.token);
    }
}