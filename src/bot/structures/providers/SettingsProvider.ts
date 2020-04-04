import { Collection, Guild } from 'discord.js';
import { Settings, SettingsData } from '../entities/Settings';
import { UpdateResult, DeleteResult } from 'typeorm';
import mixin from 'merge-descriptors';
import { Snowflake } from 'discord.js';

export class SettingsProvider {
    public readonly entity = Settings;
    public readonly items = new Collection<string, SettingsData>();
    public readonly defaults = defaults;

    public async init(): Promise<void> {
        const settingsDocs = await Settings.find();
        for (const setting of settingsDocs) {
            this.items.set(setting.id, setting.data);
        }
    }

    get count() {
        return Settings.count();
    }

    public async create(guild: string | Guild, data: Partial<SettingsData>): Promise<boolean> {
        const id: string = this.getGuildId(guild);
        if (this.items.has(id)) return false;
        const item = mixin(data, defaults, true) as SettingsData;
        this.items.set(id, item);

        let event = new Settings();
        mixin(event, item, false);
        return event.save().then(() => true).catch((r: string) => Promise.reject(r));
    }

    public async get(guild: string | Guild, query?: string, defaultValue?: any): Promise<any> {
        const id: string = this.getGuildId(guild);
        if (!query) return this.items.get(id) ?? await Settings.findOne({ id: this.getGuildId(guild) });

        let object: { [key: string]: any } = {};
        if (this.items.has(id)) {
            for (const path of query.split('.')) object = object[path];
            return object ?? defaultValue;
        }

        return defaultValue;
    }

    public async guild(guild: string | Guild, mixins: { [key: string]: any }): Promise<any> {
        const id: string = this.getGuildId(guild);
        let data = { ...this.defaults };
        console.log(mixin(data, mixins));
    }

    public async set(guild: string | Guild, data: SettingsData): Promise<UpdateResult> {
        const id: string = this.getGuildId(guild);
        this.items.set(id, data);

        return await Settings.update({ id }, { data });
    }

    public async clear(guild: string | Guild): Promise<DeleteResult> {
        const id: string = this.getGuildId(guild);
        this.items.delete(id);

        return await Settings.delete({ id });
    }

    protected getGuildId(guild: string | Guild): string {
        if (guild instanceof Guild) return guild.id;
        if (guild === 'global' || guild === null) return '0';
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
    }
}

const defaults = {
    general: {
        prefix: process.env.prefix ?? ';',
        blacklist: [] as Snowflake[],
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