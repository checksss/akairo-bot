"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Settings_1 = require("../entities/Settings");
const merge_descriptors_1 = tslib_1.__importDefault(require("merge-descriptors"));
class SettingsProvider {
    constructor() {
        this.entity = Settings_1.Settings;
        this.items = new discord_js_1.Collection();
        this.defaults = defaults;
    }
    async init() {
        const settingsDocs = await Settings_1.Settings.find();
        for (const setting of settingsDocs) {
            this.items.set(setting.id, setting.data);
        }
    }
    get count() {
        return Settings_1.Settings.count();
    }
    async create(guild, data) {
        const id = this.getGuildId(guild);
        if (this.items.has(id))
            return false;
        const item = merge_descriptors_1.default(data, defaults, true);
        this.items.set(id, item);
        let event = new Settings_1.Settings();
        merge_descriptors_1.default(event, item, false);
        return event.save().then(() => true).catch((r) => Promise.reject(r));
    }
    async get(guild, query, defaultValue) {
        const id = this.getGuildId(guild);
        if (!query)
            return this.items.get(id) ?? await Settings_1.Settings.findOne({ id: this.getGuildId(guild) });
        let object = {};
        if (this.items.has(id)) {
            for (const path of query.split('.'))
                object = object[path];
            return object ?? defaultValue;
        }
        return defaultValue;
    }
    async guild(guild, mixins) {
        const id = this.getGuildId(guild);
        let data = { ...this.defaults };
        console.log(merge_descriptors_1.default(data, mixins));
    }
    async set(guild, data) {
        const id = this.getGuildId(guild);
        this.items.set(id, data);
        return await Settings_1.Settings.update({ id }, { data });
    }
    async clear(guild) {
        const id = this.getGuildId(guild);
        this.items.delete(id);
        return await Settings_1.Settings.delete({ id });
    }
    getGuildId(guild) {
        if (guild instanceof discord_js_1.Guild)
            return guild.id;
        if (guild === 'global' || guild === null)
            return '0';
        if (typeof guild === 'string' && /^\d+$/.test(guild))
            return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
    }
}
exports.SettingsProvider = SettingsProvider;
const defaults = {
    general: {
        prefix: process.env.prefix ?? ';',
        blacklist: [],
        preferEmbeds: true
    },
    channels: {
        main: '',
        memberlog: '',
        modlog: '',
        welcome: {
            default: 'Welcome to {servername}, {tag}!',
            custom: false,
            value: ''
        },
        leave: {
            default: '{tag} has left the server.',
            custom: false,
            value: ''
        },
        reactionDownloading: {
            active: false,
            useDMs: false
        }
    },
    modules: {
        music: {
            active: true,
            sources: ['yt', 'sc', 'uf']
        },
        tags: { active: true }
    },
    moderation: {
        tokenFiltering: true,
        filterProfanity: false,
        usePerms: true,
        mods: [],
        profanity: {
            active: true,
            strict: 1
        }
    }
};
//# sourceMappingURL=SettingsProvider.js.map