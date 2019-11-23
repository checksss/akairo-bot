"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StatsSchema = new mongoose_1.Schema({
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
exports.Stats = mongoose_1.model('Stats', StatsSchema);
