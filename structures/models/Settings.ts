import { Schema, model } from 'mongoose';
import { GuildMember } from 'discord.js';
const Settings: Schema = new Schema({
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
export default model('Settings', Settings);