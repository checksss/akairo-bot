"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Settings = new mongoose_1.Schema({
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
exports.default = mongoose_1.model('Settings', Settings);
