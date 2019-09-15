"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TagsModel = new mongoose_1.Schema({
    id: Number,
    user: String,
    guild: String,
    name: String,
    aliases: [String],
    content: String,
    uses: Number,
    last_modified: String,
    createdAt: Date,
    updatedAt: Date
});
exports.Tags = mongoose_1.model('Tags', TagsModel);
