import { Provider } from 'discord-akairo';
import { Guild } from 'discord.js';
import { Document, Model, Query } from 'mongoose';
import { Settings } from '../models/Settings';

export class SettingsProvider extends Provider {
    public model: Model<Document>;

    public constructor() {
        super();
        this.model = Settings;
    }

    public async init(): Promise<void> {
        const settingsDocs = await Settings.find();
        for (const setting of settingsDocs) {
            this.items.set(setting.id, setting);
        }
    }

    public async get(guild: string | Guild, key: string, defaultValue: any): Promise<any> {
        const id: string = this.getGuildId(guild);
        if (this.items.has(id)) {
            const value = this.items.get(id)[key];
            return value === undefined ? defaultValue : value;
        }

        return defaultValue;
    }

    public async set(guild: string | Guild, key: string, value: any): Promise<Query<Document>> {
        const id: string = this.getGuildId(guild);
        const data: any = this.items.get(id) || {};
        data[key] = value;
        this.items.set(id, data);

        return await Settings.updateOne({ id }, { [key]: value });
    }

    public async delete(guild: string | Guild, key: string): Promise<any> {
        const id: string = this.getGuildId(guild);
        const data: any = this.items.get(id) || {};
        delete data[key];

        return await Settings.updateOne({ id }, { [key]: null });
    }

    public async clear(guild: string | Guild): Promise<any> {
        const id: string = this.getGuildId(guild);
        this.items.delete(id);

        return await Settings.deleteOne({ id });
    }

    protected getGuildId(guild: string | Guild): string {
        if (guild instanceof Guild) return guild.id;
        if (guild === 'global' || guild === null) return '0';
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
    }
}