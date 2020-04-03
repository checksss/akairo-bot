"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Files_1 = require("../models/Files");
class FileProvider {
    constructor() {
        this.model = Files_1.Files;
        this.items = new discord_js_1.Collection();
    }
    async init() {
        const files = await Files_1.Files.find();
        for (const file of files) {
            this.items.set(file.id, file.data);
        }
    }
    async get(id) {
        if (this.items.has(id)) {
            const data = this.items.get(id);
            return data;
        }
        this.items.clear();
        await this.init();
        return this.items.get(id);
    }
    async set(id, data) {
        const file = this.items.get(id) || {};
        file.data = data;
        this.items.set(file.id, file.data);
        return await Files_1.Files.updateOne({ id }, { data: data });
    }
    async delete(id) {
        this.items.delete(id);
        return await Files_1.Files.deleteOne({ id });
    }
}
exports.FileProvider = FileProvider;
//# sourceMappingURL=FileProvider.js.map