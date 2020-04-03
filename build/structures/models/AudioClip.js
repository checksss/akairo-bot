"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AudioClipModel = new mongoose_1.Schema({
    user: String,
    guild: String,
    type: String,
    data: Buffer
});
exports.AudioClips = mongoose_1.model('AudioClips', AudioClipModel);
//# sourceMappingURL=AudioClip.js.map