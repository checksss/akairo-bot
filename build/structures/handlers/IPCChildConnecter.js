"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const events_1 = tslib_1.__importDefault(require("events"));
const veza_1 = require("veza");
class IPCChildConnector extends events_1.default {
    constructor(task, serverLabel) {
        super();
        this.task = task;
        this.client = new veza_1.Client('MasterProcess', { maximumRetries: 2 });
        this.serverLabel = serverLabel;
        this.connecting = false;
        this.connect();
    }
    get connected() {
        const server = this.client.servers.get(this.serverLabel);
        return !!server && server.status === veza_1.ClientSocketStatus.Ready;
    }
    connect() {
        return new Promise((res, rej) => {
            if (this.connected) {
                this.client.on('raw', () => res());
                return;
            }
            if (this.connecting) {
                this.once('connect', () => res());
                return;
            }
            this.connecting = true;
            let connected = false;
            if (this.child && this.child.connected)
                this.child.kill();
            this.child = child_process_1.fork(`../subtasks/${this.task}`);
            this.child.once('message', async (e) => {
                if (e.type !== 'READY_TO_CONNECT')
                    return;
                this.client.once('ready', () => {
                    this.emit('connect');
                    this.connecting = false;
                    connected = true;
                    res();
                });
                this.client.once('disconnect', () => {
                    this.emit('disconnect');
                    if (!this.connecting)
                        this.connect();
                });
                this.child.on('exit', () => this.emit('exit'));
                await this.client.connectTo(e.data);
            });
            setTimeout(() => {
                if (connected)
                    return;
                rej(new Error('Connection timed out'));
            }, 20 * 1000);
        });
    }
    async send(data) {
        if (!this.connected)
            await this.connect();
        return this.client.sendTo(this.serverLabel, data);
    }
    async ping() {
        const timeStart = Date.now();
        await this.send({ type: 'PING' });
        this._ping = Date.now() - timeStart;
        return this._ping;
    }
    kill() {
        if (this.client)
            this.client.servers.forEach((x) => x.disconnect());
        if (this.child)
            this.child.kill();
    }
}
exports.default = IPCChildConnector;
//# sourceMappingURL=IPCChildConnecter.js.map