"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const SettingsProvider_1 = __importDefault(require("../structures/providers/SettingsProvider"));
const Tags_1 = require("../structures/models/Tags");
const Logger_1 = require("../structures/util/Logger");
require("dotenv/config");
class AkairoBotClient extends discord_akairo_1.AkairoClient {
    constructor(config) {
        super({ ownerID: config.owner }, {
            messageCacheMaxSize: 1000,
            disableEveryone: true,
            shardCount: 2
        });
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: path_1.join(__dirname, '..', 'commands'),
            prefix: async (message) => await this.settings.get(message.guild, 'prefix', process.env.prefix),
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            defaultCooldown: 3000,
            argumentDefaults: {
                prompt: {
                    modifyStart: (_, str) => `${str}\nType \`cancel\` to cancel the command.`,
                    modifyRetry: (_, str) => `${str}\nType \`cancel\` to cancel the command.`,
                    timeout: 'Error: Command timed out',
                    ended: 'Error: Too many attemps',
                    cancel: 'Command cancelled',
                    retries: 3,
                    time: 30000
                },
                otherwise: ''
            }
        });
        this.inhibitorHandler = new discord_akairo_1.InhibitorHandler(this, {
            directory: path_1.join(__dirname, '..', 'inhibitors')
        });
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: path_1.join(__dirname, '..', 'listeners')
        });
        this.commandHandler.resolver.addType('tag', async (message, phrase) => {
            if (!phrase)
                return discord_akairo_1.Flag.fail(phrase);
            phrase = discord_js_1.Util.cleanContent(phrase.toLowerCase(), message);
            let tag;
            try {
                tag = await Tags_1.Tags.findOne({ guild: message.guild.id, name: phrase });
                if (!tag)
                    tag = await Tags_1.Tags.findOne({ guild: message.guild.id, aliases: phrase });
            }
            catch (_a) { }
            return tag || discord_akairo_1.Flag.fail(phrase);
        });
        this.commandHandler.resolver.addType('existingTag', async (message, phrase) => {
            if (!phrase)
                return discord_akairo_1.Flag.fail(phrase);
            phrase = discord_js_1.Util.cleanContent(phrase, message);
            let tag;
            try {
                tag = await Tags_1.Tags.findOne({ guild: message.guild.id, name: phrase });
                if (!tag)
                    tag = await Tags_1.Tags.findOne({ guild: message.guild.id, aliases: phrase });
            }
            catch (_a) { }
            return tag ? discord_akairo_1.Flag.fail(phrase) : phrase;
        });
        this.commandHandler.resolver.addType('tagContent', async (message, phrase) => {
            if (!phrase)
                phrase = '';
            phrase = discord_js_1.Util.cleanContent(phrase, message);
            if (message.attachments.first())
                phrase += `\n${message.attachments.first().url}`;
            return phrase || discord_akairo_1.Flag.fail(phrase);
        });
        this.config = config;
        this.cache = new discord_js_1.Collection();
        this.logger = Logger_1.Logger;
        this.constants = {
            infoEmbed: [155, 200, 200],
            memberAdd: [125, 235, 75],
            memberRemove: [245, 155, 55],
            guildAdd: [125, 235, 75],
            guildRemove: [255, 80, 55]
        };
    }
    async _init() {
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
        this.logger.log(`Inhibitors loaded: ${this.inhibitorHandler.modules.size}`);
        this.listenerHandler.loadAll();
        this.logger.log(`Listeners loaded: ${this.listenerHandler.modules.size}`);
        this.settings = new SettingsProvider_1.default();
        await this.settings.init();
        this.logger.log('Settings provider initialized');
        const port = process.env.port || 8080;
        express_1.default().all('*', (req, res) => {
            const content = {
                info: { guilds: this.guilds.size, users: this.guilds.reduce((a, b) => a + b.memberCount, 0), channels: this.channels.size },
                client: { commands: this.commandHandler.modules.size, listeners: this.listenerHandler.modules.size, inhibitors: this.inhibitorHandler.modules.size },
                shards: this.ws.shards.map(s => { return { id: s.id, status: s.status, ping: Math.round(s.ping) }; })
            };
            res.json(content);
            res.status(this.ws.shards.every(s => s.status === 0) ? 200 : 500).end();
        }).listen(port, () => Logger_1.Logger.log(`Listening on port ${port}`));
        process.on('uncaughtException', (err) => this.logger.error(err.stack));
        process.on('unhandledRejection', async (reason) => this.logger.error(`Unhandled Rejection: ${reason ? reason : 'no reason'}`));
        this.on('shardReady', (id) => this.logger.info(`Shard ${id} ready`));
        this.on('shardDisconnect', (event, id) => this.logger.error(`Shard ${id} disconnected`));
        this.on('shardError', (error, id) => this.logger.error(`Shard ${id} error: ${error.message}`));
    }
    async start() {
        try {
            await mongoose_1.default.connect(process.env.mongo, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
            this.logger.log('MongoDB connected');
        }
        catch (e) {
            this.logger.error(`Failed to connect to MongoDB`);
            this.logger.error(e);
            return process.exit();
        }
        await this._init();
        return this.login(this.config.token);
    }
}
exports.default = AkairoBotClient;
