import express, { Express, Request, RequestHandler, Response } from 'express';
import AkairoBotClient from '../../client/AkairoBotClient';

import { Document, Model } from 'mongoose';
import { Stats } from '../models/Stats';
import { Files } from '../models/Files';

import favicon from 'serve-favicon';
import fileType from 'file-type';
import { join } from 'path';

export class Server implements StatsServer {
    public app: Express;
    public port: String | Number;
    public attachmentsBase: String;
    private model: Model<Document>;
    private client: AkairoBotClient;

    public constructor(client: AkairoBotClient) {
        this.app = express();
        this.port = process.env.port || 80;
        this.attachmentsBase = `http://akairo.org${this.port===80?'':`:${this.port}`}/`
        this.model = Stats;
        this.client = client;
    }

    public init(): void {
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
        });

        this.app.use(favicon(join(__dirname, '..', '..', '..', 'client', 'data', 'avatar.ico')));

        this.app.get('/stats/:date', async (req: Request, res: Response): Promise<any> => {
            // @ts-ignore
            if (isNaN(req.params.date)) return res.status(400).send('Invalid date').end();
            const time = parseInt(req.params.date);

            const stat = await Stats.findOne({ date: time });
            if (!stat) return res.status(404).send('Statistics entry not found. Use /search/:date to search for an entry.').end();

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

        this.app.all('/:id', async (req: Request, res: Response): Promise<any> => {
            const file = await Files.findOne({ id: req.params.id });
            if (!file) return res.status(404).send('File not found');

            const type = fileType(file!.data);
            res.header('Content-Type', type!.mime);
            if (!type!.mime) res.header(`Content-Disposition: attachment; filename=${file!.filename}`);
            return res.status(200).send(file!.data).end();
        });

        this.app.listen(this.port, () => this.client.logger.log(`Server initialized: ${this.port}`));
    }

    public addPath(method: ExpressMethods, path: string, callback: RequestHandler): Express {
        return this.app[method](path, callback);
    }
}

type ExpressMethods = 'get' | 'post' | 'put' | 'delete' | 'all' | 'use';

export interface StatsServer {
    app: Express;
}