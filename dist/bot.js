"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AkairoBotClient_1 = __importDefault(require("./client/AkairoBotClient"));
require('dotenv').config();
const client = new AkairoBotClient_1.default({
    owner: process.env.owner,
    token: process.env.token
});
client.start();
