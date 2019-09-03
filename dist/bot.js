"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AkairoClient_1 = __importDefault(require("./client/AkairoClient"));
require('dotenv').config();
const client = new AkairoClient_1.default({
    owner: process.env.owner,
    token: process.env.token
});
client.start();
