"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const Stats_1 = require("../models/Stats");
const Files_1 = require("../models/Files");
const serve_favicon_1 = tslib_1.__importDefault(require("serve-favicon"));
const file_type_1 = tslib_1.__importDefault(require("file-type"));
const path_1 = require("path");
class Server {
    constructor(client) {
        this.model = Stats_1.Stats;
        this.app = express_1.default();
        this.port = process.env.port || 80;
        this.attachmentsBase = `http://akairo.org${this.port === 80 ? '' : `:${this.port}`}/`;
        this.client = client;
    }
    init() {
        this.app.get('/', async (req, res) => {
            if (this.client.uptime === null)
                return res.status(200).send('Client not started');
            this.client.logger.log(`Stats query: ${req.method} ${req.url}`);
            const stats = (await Stats_1.Stats.find({ date: { $exists: true }, $where: 'Date.now() - this.date < 864e5' }).sort({ date: -1 }).limit(1))[0];
            const content = {
                info: { guilds: stats.info.guilds, users: stats.info.users, channels: stats.info.channels },
                client: { commands: stats.client.commands, listeners: stats.client.listeners, inhibitors: stats.client.inhibitors },
                shards: stats.shards.map((s) => { return { id: s.id, status: s.status, ping: Math.round(s.ping) }; })
            };
            res.json(content);
            res.status(this.client.ws.shards.every(s => s.status === 0) ? 200 : 500).end();
        });
        this.app.use(serve_favicon_1.default(path_1.join(__dirname, '..', '..', '..', 'client', 'data', 'avatar.ico')));
        this.app.get('/stats/:date', async (req, res) => {
            if (isNaN(req.params.date))
                return res.status(400).send('Invalid date').end();
            const time = parseInt(req.params.date);
            const stat = await Stats_1.Stats.findOne({ date: time });
            if (!stat)
                return res.status(404).send('Statistics entry not found. Use /search/:date to search for an entry.').end();
            const content = {
                info: { guilds: stat.info.guilds, users: stat.info.users, channels: stat.info.channels },
                client: { commands: stat.client.commands, listeners: stat.client.listeners, inhibitors: stat.client.inhibitors },
                shards: stat.shards.map((s) => { return { id: s.id, status: s.status, ping: Math.round(s.ping) }; })
            };
            return res.status(200).json(content).end();
        });
        this.app.get('/robots.txt', (_req, res) => {
            res.status(200).send('Dashboard for Akairo Bot').end();
        });
        this.app.all('/:id', async (req, res) => {
            const file = await Files_1.Files.findOne({ id: req.params.id });
            const type = await file_type_1.default.fromBuffer(file.data);
            res.header('Content-Type', type.mime);
            if (!type.mime)
                res.header(`Content-Disposition: attachment; filename=${file.filename}`);
            return res.status(200).send(file.data).end();
        });
        this.app.listen(this.port, () => this.client.logger.log(`Server initialized: ${this.port}`));
    }
    addPath(method, path, callback) {
        return this.app[method](path, callback);
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map