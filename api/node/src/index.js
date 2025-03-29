import fs from 'fs';
import https from 'https';
import { app } from './server.js';
import redis from './redis/redis.js';

const key = fs.readFileSync('cert.key');
const cert = fs.readFileSync('cert.crt');

async function setupRedis() {
    await redis.connect();
}

const httpsServer = https.createServer({ key, cert }, app);
httpsServer.listen(8181, setupRedis);
app.listen(8182, setupRedis);

// TODO: restart server on crash
