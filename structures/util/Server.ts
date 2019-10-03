import express, { Express, Request, RequestHandler, Response } from 'express';
import AkairoBotClient from '../../client/AkairoBotClient';

import { Document, Model } from 'mongoose';
import { Stats } from '../models/Stats';
import { Files } from '../models/Files';

import favicon from 'serve-favicon';
import readChunk from 'read-chunk';
import fileType from 'file-type';
import { join } from 'path';

export class StatsServer implements StatsServer {
    public app: Express;
    private model: Model<Document>;
    private client: AkairoBotClient;

    public constructor(client: AkairoBotClient) {
        this.app = express();
        this.model = Stats;
        this.client = client;
    }

    public init(): void {
        const port = process.env.port || 8080;
        this.app.get('/', async (req: Request, res: Response): Promise<any> => {
            if (this.client.uptime === null) return res.status(200).send('Client not started');
            this.client.logger.log(`Stats query: ${req.method} ${req.url}`);
            const stats: Stats = (await Stats.find({ date: { $exists: true }, $where: 'Date.now() - this.date < 864e5' }).sort({ date: -1 }).limit(1))[0];
            const content = {
                info: { guilds: stats.info.guilds, users: stats.info.users, channels: stats.info.channels },
                client: { commands: stats.client.commands, listeners: stats.client.listeners, inhibitors: stats.client.inhibitors },
                shards: stats.shards.map((s) => { return { id: s.id, status: s.status, ping: Math.round(s.ping) } } )
            };

            res.json(content);
            res.status(this.client.ws.shards.every(s => s.status === 0) ? 200 : 500).end();
        }).listen(port, () => this.client.logger.log(`Stats server initialized: ${port}`));

        this.app.use(favicon(join(__dirname, '..', '..', '..', 'client', 'data', 'avatar.ico')));

        this.app.get('/:date', async (req: Request, res: Response): Promise<any> => {
            if (isNaN(req.params.date)) return res.status(400).send('Invalid date').end();
            const time = parseInt(req.params.date);

            const stat: Stats = (await Stats.find({ date: req.params.date }).limit(1))[0];
            if (stat === null || stat === undefined) return res.status(404).send('Statistics entry not found. Use /search/:date to search for an entry.').end();

            const content = {
                info: { guilds: stat.info.guilds, users: stat.info.users, channels: stat.info.channels },
                client: { commands: stat.client.commands, listeners: stat.client.listeners, inhibitors: stat.client.inhibitors },
                shards: stat.shards.map((s) => { return { id: s.id, status: s.status, ping: Math.round(s.ping) } } )
            };
            return res.status(200).json(content).end();
        });

        this.app.get('/robots.txt', (req: Request, res: Response): any => {
            res.status(200).send('Dashboard for Akairo Bot').end();
        });

        this.app.all('/data/:id', async (req: Request, res: Response): Promise<any> => {
            const file = await Files.findOne({ id: req.params.id });
            if (file === undefined) return res.status(404).send('File not found');

            const type = fileType(file!.data);
            res.header('Content-Type', type!.mime);
            return res.status(200).send(file!.data).end();
        })
    }

    public addPath(method: ExpressMethods, path: string, callback: RequestHandler): Express {
        return this.app[method](path, callback);
    }
}

type ExpressMethods = 'get' | 'post' | 'put' | 'delete';

export interface StatsServer {
    app: Express;
}