import { Document, Schema, model } from 'mongoose';
import { GuildMember } from 'discord.js';

export interface Settings extends Document {
    id: string,
    name: string,
    prefix: string,
    filterProfanity: boolean,
    mainChannel: string,
    memberLog: string,
    modLog: string,
    tokenFiltering: boolean,
    blacklist: string[],
    moderators: string[],
    music: boolean
}

const SettingsSchema = new Schema({
    id: String,
    name: String,
    prefix: String,
    filterProfanity: Boolean,
    mainChannel: String,
    memberLog: String,
    modLog: String,
    tokenFiltering: Boolean,
    blacklist: [String],
    moderators: [String],
    music: Boolean
});

export const Settings = model<Settings>('Settings', SettingsSchema);