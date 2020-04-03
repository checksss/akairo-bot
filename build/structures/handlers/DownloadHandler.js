"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IPCChildConnecter_1 = tslib_1.__importDefault(require("./IPCChildConnecter"));
class DownloadHandler extends IPCChildConnecter_1.default {
    constructor() {
        super('DownloadManager', 'DownloadManager');
    }
    download(url, path) {
        return this.send({ type: 'DOWNLOAD', data: { url, path } });
    }
    scan(path) {
        return this.send({ type: 'SCAN', data: { path } });
    }
    duration(path) {
        return this.send({ type: 'DURATION', data: { path } });
    }
}
exports.default = DownloadHandler;
//# sourceMappingURL=DownloadHandler.js.map