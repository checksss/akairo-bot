import { Schema, model, Document } from 'mongoose';

export interface Stats extends Document {
    date: number,
    info: {
        guilds: number,
        users: number,
        channels: number,
    },
    client: {
        commands: Number,
        inhibitors: Number,
        listeners: Number,
    },
    shards: [
        {
            _id: string,
            id: number,
            status: number,
            ping: number,
        }
    ]
}

const StatsSchema = new Schema({
    date: Number,
    info: {
        guilds: Number,
        users: Number,
        channels: Number,
    },
    client: {
        commands: Number,
        listeners: Number,
        inhibitors: Number,
    },
    shards: [
        {
            _id: String,
            id: Number,
            status: Number,
            ping: Number,
        }
    ]
});

export const Stats = model<Stats>('Stats', StatsSchema);