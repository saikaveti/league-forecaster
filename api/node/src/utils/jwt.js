import jwt from 'jsonwebtoken';
export const jwtOptions = {
    // maxAge: 1000 * 60 * 0.25, // 15 secs
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true, // Cookie will not be exposed to client side code
    sameSite: 'none', // If client and server origins are different
    secure: true, // use with HTTPS only
};

export function createLoginToken(data) {
    return jwt.sign(data, process.env.jwt_secret);
}
