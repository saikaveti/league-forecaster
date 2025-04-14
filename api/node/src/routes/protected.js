import jwt from 'jsonwebtoken';
import express from 'express';

export const protectedRoutes = express.Router();

protectedRoutes.use(authUser);

protectedRoutes.get('/content', (req, res) => {
    res.send(`This is the content in Content.vue for ${req.jwt}`);
});

export function authUser(req, res, next) {
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        let token = req.cookies?.token;
        if (token) {
            jwt.verify(token, process.env.jwt_secret, (err, data) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    req.jwt = data;
                    next();
                }
            });
        } else {
            res.sendStatus(403);
        }
    }
}
