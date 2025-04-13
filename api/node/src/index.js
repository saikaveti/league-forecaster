import fs from 'fs';
import https from 'https';
import { app } from './server.js';
import redis from './redis/redis.js';

async function setupRedis() {
    await redis.connect();
}
if (process.env.certName && process.env.certKey) {
    console.log('using https');
    // assumes node server is in home directory
    const key = fs.readFileSync(`../../../etc/ssl/certs/${process.env.certKey}`);
    const cert = fs.readFileSync(`../../../etc/ssl/certs/${process.env.certName}`);
    const httpsServer = https.createServer({ key, cert }, app);
    httpsServer.listen(8181, setupRedis);
} else {
    console.log('using http');
    app.listen(8182, setupRedis);
}

// TODO: restart server on crash
