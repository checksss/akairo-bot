import dur from '@rocka/mp3-duration';
import { exec } from 'child_process';
import fs from 'fs';
import fetch from 'node-fetch';
import { NodeMessage, Server } from 'veza';

const srv = new Server('DownloadManager');

function download(url: string, path: string): Promise<void> {
    return new Promise((res, rej) => {
        fetch(url).then((r): void => {
            const fileStream = fs.createWriteStream(path);
            r.body.pipe(fileStream);
            r.body.on('error', rej);
            fileStream.on('close', res);
        });
    });
}

srv.on('message', async (m: NodeMessage): Promise<void> => {
    if (m.data.type === 'DOWNLOAD') {
        m.reply(await download(m.data.data.url, m.data.data.path));
    } else if (m.data.type === 'DURATION') {
        m.reply(await dur(m.data.data.path));
    } else if (m.data.type === 'PING') {
        m.reply('PONG');
    }
})