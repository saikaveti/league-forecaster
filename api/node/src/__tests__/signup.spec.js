import {
    invalidEmail,
    invalidPassword,
    undefinedSignupParams,
    finishSignup,
    invalidPhone,
    verifyUserIsUnique,
    duplicateEmail,
    duplicatePhone,
    extractVerifyPhoneParams,
    invalidSignupSession,
    invalidTextCode,
    verifyPhone,
    undefinedVerifyPhoneParams,
    noSignupSession,
    verifyPhoneIsUnique,
    extractStartSignupParams,
    startSignup,
    extractFinishSignupParams,
    phoneCodeSessionExistsError,
} from '../routes/signup.js';
import * as queries from '../mysql/queries.js';
import redis from '../redis/redis.js';
import * as uuid from 'uuid';
// import * as bcrypt from '../utils/bcrypt.js';

const email = 'bepen@gmail.com';
const password = 'P@ssw0rd';
const phone = '1234567890';
const signupSession = '123e4567-e89b-12d3-a456-426655440000';

describe('startSignup', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.spyOn(uuid, 'v4').mockImplementation(() => 'mocked-uuid');
        jest.spyOn(queries, 'db_check_for_unique_phone').mockResolvedValue([]);
        jest.spyOn(redis, 'saveSignupSession').mockResolvedValue();
        jest.spyOn(redis, 'setPhoneNumberCode').mockResolvedValue();
        jest.spyOn(redis, 'getPhoneNumberCode').mockResolvedValue(null);
    });
    it('should send a 400 Bad Request when signup parameters are invalid', async () => {
        const req = {
            body: {
                phone: '80085',
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await startSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(() => {
            extractStartSignupParams({
                phone: '80085',
            });
        }).toThrowError();
    });
    it('should send a 409 Conflict when the signup info that was provided is not unique', async () => {
        jest.spyOn(queries, 'db_check_for_unique_phone').mockResolvedValue([{ phone }]);
        const req = {
            body: {
                phone,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await startSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
        await expect(verifyPhoneIsUnique(phone)).rejects.toThrow();
    });
    it('should send uuid back on success', async () => {
        const req = {
            body: {
                email,
                password,
                phone,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await startSignup(req, res, next);
        expect(res.send).toHaveBeenCalledWith('mocked-uuid');
    });
    it('should save signup session to redis on success', async () => {
        const spy = jest.spyOn(redis, 'saveSignupSession').mockResolvedValue();
        const req = {
            body: {
                phone,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await startSignup(req, res, next);
        expect(spy).toHaveBeenCalledWith('mocked-uuid', phone);
    });

    it('should set phone number code to redis on success', async () => {
        const spy = jest.spyOn(redis, 'setPhoneNumberCode').mockResolvedValue();
        const req = {
            body: {
                phone,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await startSignup(req, res, next);
        expect(spy).toHaveBeenCalledWith(phone, '123456');
    });

    it('should send 409 error if verification is already in progress', async () => {
        const spy = jest.spyOn(redis, 'getPhoneNumberCode').mockResolvedValue(true);
        const req = {
            body: {
                phone,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await startSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.send).toHaveBeenCalledWith(phoneCodeSessionExistsError);
    });
});

describe('extractStartSignupParams', () => {
    it('should throw an error if there are no params', () => {
        expect(() => {
            extractStartSignupParams(undefined);
        }).toThrowError(undefinedSignupParams);
    });
    it('should throw an error if there is an invalid phone number', () => {
        expect(() => {
            extractStartSignupParams({
                phone: '80085',
            });
        }).toThrowError(invalidPhone);
    });
    it('should return body params as an object if all entries are valid', () => {
        expect(
            extractStartSignupParams({
                phone,
            })
        ).toEqual({
            phone,
        });
    });
});

describe('verifyPhoneIsUnique', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should not an error if phone doesnt exist', async () => {
        jest.spyOn(queries, 'db_check_for_unique_phone').mockResolvedValue([]);
        await expect(verifyPhoneIsUnique(phone)).resolves.not.toThrow();
    });
    it('should throw an error if phone exists', async () => {
        jest.spyOn(queries, 'db_check_for_unique_phone').mockResolvedValue([{ phone }]);
        await expect(verifyPhoneIsUnique(phone)).rejects.toThrow(duplicatePhone);
    });
});

describe('verifyUserIsUnique', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should throw an error if email exists', async () => {
        jest.spyOn(queries, 'db_check_for_unique_user').mockResolvedValue([{ email, phone }]);
        await expect(verifyUserIsUnique(email, '7187187181')).rejects.toThrow(duplicateEmail);
    });
    it('should throw an error if phone exists', async () => {
        jest.spyOn(queries, 'db_check_for_unique_user').mockResolvedValue([{ email, phone }]);
        await expect(verifyUserIsUnique('abcdef@gmail.com', phone)).rejects.toThrow(duplicatePhone);
    });
});

describe('verifyPhone', () => {
    const textCode = '999888';
    beforeEach(() => {
        jest.spyOn(redis, 'getPhoneNumberCode').mockResolvedValue('999888');
        jest.spyOn(redis, 'getSignupSession').mockResolvedValue({ phone });
        jest.spyOn(redis, 'deletePhoneNumberCode').mockImplementation(() => Promise.resolve());
        jest.spyOn(redis, 'verifyPhoneForSignup').mockImplementation(() => Promise.resolve());
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it('should send a 400 Bad Request when body is undefined', async () => {
        const req = {
            body: undefined,
        };
        const res = {
            send: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await verifyPhone(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(undefinedVerifyPhoneParams);
        expect(() => {
            extractVerifyPhoneParams(undefined);
        }).toThrowError(undefinedVerifyPhoneParams);
    });
    it('should send a 400 Bad Request when signup session is invalid', async () => {
        const req = {
            body: {
                signupSession: 'invalid',
                textCode,
            },
        };
        const res = {
            send: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await verifyPhone(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(invalidSignupSession);
        expect(() => {
            extractVerifyPhoneParams({
                signupSession: 'invalid',
                textCode,
            });
        }).toThrowError(invalidSignupSession);
    });
    it('should send a 400 Bad Request when the text code is invalid', async () => {
        const req = {
            body: {
                signupSession,
                textCode: 'abc',
            },
        };
        const res = {
            send: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await verifyPhone(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(invalidTextCode);
        expect(() => {
            extractVerifyPhoneParams({
                signupSession,
                textCode: 'abc',
            });
        }).toThrowError(invalidTextCode);
    });
    it('should return a 401 when text code is not correct', async () => {
        jest.spyOn(redis, 'getPhoneNumberCode').mockResolvedValue('999888');
        const req = {
            body: {
                signupSession,
                textCode: '111222',
            },
        };
        const res = {
            send: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await verifyPhone(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(invalidTextCode);
    });
    it('should return a 500 when text code is correct but there is no signup session', async () => {
        jest.spyOn(redis, 'getSignupSession').mockResolvedValue(undefined);
        const req = {
            body: {
                signupSession,
                textCode,
            },
        };
        const res = {
            send: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await verifyPhone(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(noSignupSession);
    });
    it('should delete entries from redis cache on success', async () => {
        const phoneNumberSpy = jest
            .spyOn(redis, 'deletePhoneNumberCode')
            .mockImplementation(() => Promise.resolve());
        const req = {
            body: {
                signupSession,
                textCode,
            },
        };
        const res = {
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        const next = jest.fn();
        await verifyPhone(req, res, next);
        expect(phoneNumberSpy).toHaveBeenCalledWith(phone);
    });

    it('should write verify to signup session on success', async () => {
        const verifyPhoneSpy = jest
            .spyOn(redis, 'verifyPhoneForSignup')
            .mockImplementation(() => Promise.resolve());
        const req = {
            body: {
                signupSession,
                textCode,
            },
        };
        const res = {
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        const next = jest.fn();
        await verifyPhone(req, res, next);
        expect(verifyPhoneSpy).toHaveBeenCalledWith(signupSession);
    });
});

describe('extractVerifyPhoneParams', () => {
    const signupSession = uuid.v4();
    const textCode = '123456';
    it('should throw an error if there are no params', () => {
        expect(() => {
            extractVerifyPhoneParams(undefined);
        }).toThrowError(undefinedVerifyPhoneParams);
    });
    it('should throw an error if there is an invalid session', () => {
        expect(() => {
            extractVerifyPhoneParams({
                signupSession: 'a',
                textCode,
            });
        }).toThrowError(invalidSignupSession);
    });
    it('should throw an error if there is an invalid text code', () => {
        expect(() => {
            extractVerifyPhoneParams({
                signupSession,
                textCode: 'faketextcode',
            });
        }).toThrowError(invalidTextCode);
    });
    it('should return body params as an object if all entries are valid', () => {
        expect(
            extractVerifyPhoneParams({
                signupSession,
                textCode,
            })
        ).toEqual({
            signupSession,
            textCode,
        });
    });
});

describe('finishSignup', () => {
    beforeEach(() => {
        jest.spyOn(redis, 'getPhoneNumberCode').mockResolvedValue('999888');
        jest.spyOn(redis, 'getSignupSession').mockResolvedValue({ phone, verified: 'true' });
        jest.spyOn(queries, 'db_signup').mockImplementation(() => Promise.resolve());
        jest.spyOn(redis, 'deleteSignupSession').mockImplementation(() => Promise.resolve());
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        jest.spyOn(uuid, 'v4').mockImplementation(() => 'mocked-uuid');
        jest.spyOn(queries, 'db_check_for_unique_user').mockResolvedValue([]);
        jest.spyOn(redis, 'saveSignupSession').mockResolvedValue();
        jest.spyOn(redis, 'setPhoneNumberCode').mockResolvedValue();
    });
    it('should send a 400 Bad Request when signup parameters are invalid', async () => {
        const req = {
            body: {
                email,
                password: 'this_password_does_not_meet_criteria',
                signupSession,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await finishSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(() => {
            extractFinishSignupParams({
                email,
                password: 'this_password_does_not_meet_criteria',
                signupSession,
            });
        }).toThrowError();
    });
    it('should send a 409 Conflict when the signup info that was provided is not unique', async () => {
        jest.spyOn(queries, 'db_check_for_unique_user').mockResolvedValue([{ email, phone }]);
        const req = {
            body: {
                email,
                password,
                signupSession,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await finishSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
        await expect(verifyUserIsUnique(email, phone)).rejects.toThrow();
    });
    it('should send a 500 Internal Server Error when there is no signup session', async () => {
        jest.spyOn(redis, 'getSignupSession').mockResolvedValue(undefined);
        const req = {
            body: {
                email,
                password,
                signupSession,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await finishSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });
    it('should send a 500 Internal Server Error when there is no signup session phone number', async () => {
        jest.spyOn(redis, 'getSignupSession').mockResolvedValue({ verified: 'true' });
        const req = {
            body: {
                email,
                password,
                signupSession,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await finishSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });
    it('should send a 500 Internal Server Error when there is no signup session phone number verified', async () => {
        jest.spyOn(redis, 'getSignupSession').mockResolvedValue({ phone });
        const req = {
            body: {
                email,
                password,
                signupSession,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await finishSignup(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });
    // it('should send a 500 Internal Server Error when there is a problem hashing the password', async () => {
    //     jest.spyOn(bcrypt, 'hashPassword').mockImplementation(async () => {
    //         throw new Error(bcrypt.errorHashingPassword);
    //     });
    //     const req = {
    //         body: {
    //             email,
    //             password,
    //             signupSession,
    //         },
    //     };
    //     const res = {
    //         send: jest.fn(),
    //         sendStatus: jest.fn(),
    //     };
    //     res.status = jest.fn(() => res);
    //     const next = jest.fn();
    //     await finishSignup(req, res, next);
    //     expect(res.status).toHaveBeenCalledWith(500);
    // });
    it('should return a 200 and a signup cookie when valid', async () => {
        const req = {
            body: {
                email,
                password,
                signupSession,
            },
        };
        const res = {
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        res.status = jest.fn(() => res);
        const next = jest.fn();
        await finishSignup(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
        expect(res.cookie).toHaveBeenCalledWith('token', expect.anything(), expect.anything());
    });
    it('should delete entries from redis cache on success', async () => {
        const signupSessionSpy = jest
            .spyOn(redis, 'deleteSignupSession')
            .mockImplementation(() => Promise.resolve());
        const req = {
            body: {
                email,
                password,
                signupSession,
            },
        };
        const res = {
            sendStatus: jest.fn(),
            cookie: jest.fn(),
        };
        const next = jest.fn();
        await finishSignup(req, res, next);
        expect(signupSessionSpy).toHaveBeenCalledWith(signupSession);
    });
});

describe('extractFinishSignupParams', () => {
    it('should throw an error if there are no params', () => {
        expect(() => {
            extractFinishSignupParams(undefined);
        }).toThrowError(undefinedSignupParams);
    });
    it('should throw an error if there is an invalid email', () => {
        expect(() => {
            extractFinishSignupParams({
                email: 'a',
                password,
                signupSession,
            });
        }).toThrowError(invalidEmail);
    });
    it('should throw an error if there is an invalid password', () => {
        expect(() => {
            extractFinishSignupParams({
                email,
                password: 'a',
                signupSession,
            });
        }).toThrowError(invalidPassword);
    });
    it('should throw an error if there is an invalid signup session', () => {
        expect(() => {
            extractFinishSignupParams({
                email,
                password,
                signupSession: '80085',
            });
        }).toThrowError(invalidSignupSession);
    });
    it('should return body params as an object if all entries are valid', () => {
        expect(
            extractFinishSignupParams({
                email,
                password,
                signupSession,
            })
        ).toEqual({
            email,
            password,
            signupSession,
        });
    });
});
