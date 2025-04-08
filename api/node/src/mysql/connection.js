import mysql from 'mysql2';

export const connection = mysql
    .createPool({
        host: '127.0.0.1', // localhost
        user: 'lf',
        password: process.env.mysql_secret,
        database: 'Logins',
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
    })
    .promise();
