"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AkairoBotClient_1 = tslib_1.__importDefault(require("./client/AkairoBotClient"));
require('dotenv').config();
const client = new AkairoBotClient_1.default({
    owner: process.env.owner,
    token: process.env.token
});
client.start();
//# sourceMappingURL=bot.js.map