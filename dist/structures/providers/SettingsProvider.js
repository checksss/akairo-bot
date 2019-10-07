"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Settings_1 = require("../models/Settings");
class SettingsProvider extends discord_akairo_1.Provider {
    constructor() {
        super();
        this.model = Settings_1.Settings;
    }
    async init() {
        const settingsDocs = await Settings_1.Settings.find();
        for (const setting of settingsDocs) {
            this.items.set(setting.id, setting);
        }
    }
    async get(guild, key, defaultValue) {
        const id = this.getGuildId(guild);
        if (this.items.has(id)) {
            const value = this.items.get(id)[key];
            return value === undefined ? defaultValue : value;
        }
        return defaultValue;
    }
    async set(guild, key, value) {
        const id = this.getGuildId(guild);
        const data = this.items.get(id) || {};
        data[key] = value;
        this.items.set(id, data);
        return await Settings_1.Settings.updateOne({ id }, { [key]: value });
    }
    async delete(guild, key) {
        const id = this.getGuildId(guild);
        const data = this.items.get(id) || {};
        delete data[key];
        return await Settings_1.Settings.updateOne({ id }, { [key]: null });
    }
    async clear(guild) {
        const id = this.getGuildId(guild);
        this.items.delete(id);
        return await Settings_1.Settings.deleteOne({ id });
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
