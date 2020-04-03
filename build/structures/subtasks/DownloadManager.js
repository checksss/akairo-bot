"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mp3_duration_1 = tslib_1.__importDefault(require("@rocka/mp3-duration"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const veza_1 = require("veza");
const srv = new veza_1.Server('DownloadManager');
function download(url, path) {
    return new Promise((res, rej) => {
        node_fetch_1.default(url).then((r) => {
            const fileStream = fs_1.default.createWriteStream(path);
            r.body.pipe(fileStream);
            r.body.on('error', rej);
            fileStream.on('close', res);
        });
    });
}
srv.on('message', async (m) => {
    if (m.data.type === 'DOWNLOAD') {
        m.reply(await download(m.data.data.url, m.data.data.path));
    }
    else if (m.data.type === 'DURATION') {
        m.reply(await mp3_duration_1.default(m.data.data.path));
    }
    else if (m.data.type === 'PING') {
        m.reply('PONG');
    }
});
//# sourceMappingURL=DownloadManager.js.map