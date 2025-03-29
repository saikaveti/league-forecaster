import { extractLoginParams, incorrectLoginError, login, logout } from '../routes/login';
import * as queries from '../mysql/queries.js';

const email = 'bepen@gmail.com';
const phone = '1234567890';
const password = 'P@ssw0rd';

describe('login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should send a 400 Bad Request when login parameters are invalid', async () => {
        jest.spyOn(queries, 'db_login').mockResolvedValue([{ id: 1, email: 'bepen@gmail.com' }]);
        const identifier = email;
        const password = 'this_password_does_not_meet_criteria';
        const req = {
            body: {
                identifier,
                password,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await login(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(() => {
            extractLoginParams(identifier, password);
        }).toThrowError();
    });
    it('should send a 200 Ok when login parameters are valid', async () => {
        jest.spyOn(queries, 'db_login').mockResolvedValue([{ id: 1, email: 'bepen@gmail.com' }]);
        const identifier = email;
        const req = {
            body: {
                identifier,
                password,
            },
        };
        const res = {
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await login(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
    it('should send a jwt when login parameters are valid', async () => {
        jest.spyOn(queries, 'db_login').mockResolvedValue([{ id: 1, email: 'bepen@gmail.com' }]);
        const identifier = email;
        const req = {
            body: {
                identifier,
                password,
            },
        };
        const res = {
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await login(req, res, next);
        expect(res.cookie).toHaveBeenCalledWith('token', expect.anything(), expect.anything());
    });
    it('should send a 403 when login parameters do not match an email', async () => {
        jest.spyOn(queries, 'db_login').mockResolvedValue([]);
        const identifier = 'fakeemail@gmail.com';
        const req = {
            body: {
                identifier,
                password,
            },
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(),
            cookie: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await login(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith(incorrectLoginError);
    });
});

describe('logout', () => {
    it('should clear jwt when logged out', async () => {
        const res = {
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        await logout({}, res);
        expect(res.cookie).toHaveBeenCalledWith('token', undefined, expect.anything());
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
});

describe('extractLoginParams', () => {
    it('should throw an error if there is an invalid identifier', () => {
        expect(() => {
            extractLoginParams(undefined, password);
        }).toThrowError();
        expect(() => {
            extractLoginParams('', password);
        }).toThrowError();
        expect(() => {
            extractLoginParams('a', password);
        }).toThrowError();
    });

    it('should throw an error if there is an invalid password', () => {
        expect(() => {
            extractLoginParams(email, undefined);
        }).toThrowError();
        expect(() => {
            extractLoginParams(email, '');
        }).toThrowError();
        expect(() => {
            extractLoginParams(email, 'a');
        }).toThrowError();
    });

    it('should return email and password when identifier is an email', () => {
        expect(extractLoginParams(email, password)).toEqual({
            email,
            password,
        });
    });

    it('should return phone and password when identifier is a phone', () => {
        expect(extractLoginParams(phone, password)).toEqual({
            phone,
            password,
        });
    });
});
