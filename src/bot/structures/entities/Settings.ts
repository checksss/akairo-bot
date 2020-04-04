import { BaseEntity, Entity, PrimaryColumn, Column } from 'typeorm';

export interface SettingsData {
    general: {
        prefix: string;
        blacklist: string[];
        preferEmbeds: boolean;
    },
    channels: {
        main: string;
        memberlog: string;
        modlog: string;
        welcome: {
            default: 'Welcome to {servername}, {tag}!',
            custom: boolean;
            value: string;
        }
        leave: {
            default: '{tag} has left the server.',
            custom: boolean;
            value: string;
        }
        reactionDownloading: {
            active: boolean;
            useDMs: boolean;
        }
    },
    modules: {
        music: {
            active: boolean;
            sources: Array<'yt' | 'sc' | 'uf'>
        },
        tags: { active: boolean; }
    },
    moderation: {
        tokenFiltering: boolean;
        filterProfanity: boolean;
        usePerms: boolean;
        mods: string[];
        profanity: {
            active: boolean;
            strict: 1 | 2 | 3;
        }
    }
}

@Entity()
export class Settings extends BaseEntity {
    @PrimaryColumn({ name: 'id', type: 'text' })
    id!: string;

    @Column({ name: 'name', type: 'text' })
    name!: string;

    @Column({ name: 'data', type: 'json' })
    data!: SettingsData;
}