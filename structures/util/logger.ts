import { createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const LokiTransport = require('winston-loki');

export enum TOPICS {
    UNHANDLED_REJECTION = 'UNHANDLED_REJECTION',
	DISCORD = 'DISCORD',
	DISCORD_AKAIRO = 'DISCORD_AKAIRO',
	METRICS = 'METRICS'
}