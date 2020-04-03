"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FileSchema = new mongoose_1.Schema({
    id: String,
    user: String,
    filename: String,
    data: Buffer
});
exports.Files = mongoose_1.model('Files', FileSchema);
//# sourceMappingURL=Files.js.map