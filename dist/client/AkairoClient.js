"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const discord_akairo_1 = require("discord-akairo");
const mongoose_1 = __importDefault(require("mongoose"));
const SettingsProvider_1 = __importDefault(require("../structures/providers/SettingsProvider"));
require('dotenv').config();
class AkairoBotClient extends discord_akairo_1.AkairoClient {
    constructor(config) {
        super({ ownerID: config.owner }, {
            messageCacheMaxSize: 1000,
            disableEveryone: true
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
                    modifyStart: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
                    modifyRetry: (_, str) => `${str}\n\nType \`cancel\` to cancel the command.`,
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
        this.config = config;
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
        this.inhibitorHandler.loadAll();
        this.listenerHandler.loadAll();
        this.settings = new SettingsProvider_1.default();
        await this.settings.init();
    }
    async start() {
        try {
            await mongoose_1.default.connect(process.env.mongo, {
                useNewUrlParser: true,
                useFindAndModify: false
            });
        }
        catch (e) {
            console.log(e);
            return process.exit();
        }
        await this._init();
        return this.login(this.config.token);
    }
}
exports.default = AkairoBotClient;
