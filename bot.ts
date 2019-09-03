import AkairoBotClient from './client/AkairoBotClient';
require('dotenv').config();

const client: AkairoBotClient = new AkairoBotClient({
    owner: process.env.owner,
    token: process.env.token
});

client.start();