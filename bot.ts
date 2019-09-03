import AkairoBotClient from './client/AkairoClient';
require('dotenv').config();

const client: AkairoBotClient = new AkairoBotClient({
    owner: process.env.owner,
    token: process.env.token
});

client.start();