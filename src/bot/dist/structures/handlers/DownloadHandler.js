"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IPCChildConnecter_1 = __importDefault(require("./IPCChildConnecter"));
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
