import fetch from 'node-fetch';
import fs from 'fs';

export default class DownloadManager {
    download(url: string, path: string) {
        return new Promise((res, rej): void => {
            fetch(url).then((r): void => {
                const fileStream = fs.createWriteStream(path);
                r.body.pipe(fileStream);
                r.body.on('error', rej);
                fileStream.on('finish', res);
            });
        });
    }
}