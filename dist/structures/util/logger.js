"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LokiTransport = require('winston-loki');
var TOPICS;
(function (TOPICS) {
    TOPICS["UNHANDLED_REJECTION"] = "UNHANDLED_REJECTION";
    TOPICS["DISCORD"] = "DISCORD";
    TOPICS["DISCORD_AKAIRO"] = "DISCORD_AKAIRO";
    TOPICS["METRICS"] = "METRICS";
})(TOPICS = exports.TOPICS || (exports.TOPICS = {}));
