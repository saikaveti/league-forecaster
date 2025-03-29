import redis from '../redis/redis';
import * as queries from '../mysql/queries';
import * as uuid from 'uuid';
import {
    extractForgotPasswordParams,
    extractResetPasswordParams,
    forgotPassword,
    invalidEmail,
    invalidPassword,
    invalidResetSession,
    noParamsProvided,
    resetPassword,
} from '../routes/reset-password';
import e from 'express';

const email = 'email@mail.com';
const phone = '1234567890';
const password = 'P@ssw0rd';
const resetSession = '05d7f30e-bf9f-416d-8675-38a748f53a72';

describe('extractForgotPasswordParams', () => {
    it('should return empty object if no identifier is provided', () => {
        const result = extractForgotPasswordParams();
        expect(result).toEqual({});
        const result2 = extractForgotPasswordParams(undefined);
        expect(result2).toEqual({});
    });

    it('should return empty object if invalid identifier is provided', () => {
        const result = extractForgotPasswordParams('invalid');
        expect(result).toEqual({});
    });

    it('should return object with email property if valid email is provided', () => {
        const result = extractForgotPasswordParams(email);
        expect(result).toEqual({ email });
    });
    it('should return object with phone property if valid phone is provided', () => {
        const result = extractForgotPasswordParams(phone);
        expect(result).toEqual({ phone });
    });
});

describe('forgotPassword', () => {
    let checkForExistingUserSpy;
    let saveSessionSpy;
    beforeEach(() => {
        jest.spyOn(uuid, 'v4').mockImplementation(() => 'mocked-uuid');
        checkForExistingUserSpy = jest
            .spyOn(queries, 'db_check_for_existing_user')
            .mockResolvedValue([{ email }]);
        saveSessionSpy = jest
            .spyOn(redis, 'saveResetSession')
            .mockImplementation(() => Promise.resolve());
    });
    it('should call db_check_for_existing_user with email if email is provided', async () => {
        const req = { body: { identifier: email } };
        const res = { sendStatus: jest.fn() };
        await forgotPassword(req, res);
        expect(checkForExistingUserSpy).toHaveBeenCalledWith(email, undefined);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
    it('should call db_check_for_existing_user with phone if phone is provided', async () => {
        const req = { body: { identifier: phone } };
        const res = { sendStatus: jest.fn() };
        await forgotPassword(req, res);
        expect(checkForExistingUserSpy).toHaveBeenCalledWith(undefined, phone);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
    it('should call saveResetSession with email and uuid', async () => {
        const req = { body: { identifier: email } };
        const res = { sendStatus: jest.fn() };
        await forgotPassword(req, res);
        expect(saveSessionSpy).toHaveBeenCalledWith(email, 'mocked-uuid');
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
});

describe('extractResetPasswordParams', () => {
    it('should throw error if no params are provided', () => {
        expect(() => extractResetPasswordParams()).toThrow(noParamsProvided);
    });
    it('should throw error if invalid resetSession is provided', () => {
        expect(() =>
            extractResetPasswordParams({ resetSession: 'invalid', password, email })
        ).toThrow(invalidResetSession);
    });
    it('should throw error if invalid password is provided', () => {
        expect(() =>
            extractResetPasswordParams({ resetSession, password: 'invalid', email })
        ).toThrow(invalidPassword);
    });
    it('should throw error if invalid email is provided', () => {
        expect(() =>
            extractResetPasswordParams({ resetSession, email: 'invalid', password })
        ).toThrow(invalidEmail);
    });
    it('should throw error if resetSession is missing', () => {
        expect(() => extractResetPasswordParams({ password, email })).toThrow(invalidResetSession);
    });
    it('should throw error if password is missing', () => {
        expect(() => extractResetPasswordParams({ resetSession, email })).toThrow(invalidPassword);
    });
    it('should throw error if email is missing', () => {
        expect(() => extractResetPasswordParams({ resetSession, password })).toThrow(invalidEmail);
    });
    it('should return object with resetSession and password properties', () => {
        const result = extractResetPasswordParams({ resetSession, password, email });
        expect(result).toEqual({ resetSession, password, email });
    });
});

describe('resetPassword', () => {
    let dbChangePasswordSpy;
    let redisDeleteResetSessionSpy;
    beforeEach(() => {
        jest.spyOn(redis, 'getResetSession').mockResolvedValue(email);
        redisDeleteResetSessionSpy = jest.spyOn(redis, 'deleteResetSession').mockResolvedValue();
        dbChangePasswordSpy = jest.spyOn(queries, 'db_change_password').mockResolvedValue();
    });
    it('should throw a 400 Bad Request if invalid parameters are provided', async () => {
        const req = {};
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        await resetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(noParamsProvided);
        expect(() => extractResetPasswordParams()).toThrow(noParamsProvided);
    });
    it('should throw a 400 Bad Request if invalid reset session is provided', async () => {
        const req = {
            body: {
                resetSession: '123',
                email,
                password,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        await resetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(invalidResetSession);
    });
    it('should throw a 400 Bad Request if invalid email is provided for reset session', async () => {
        const req = {
            body: {
                resetSession,
                email: 'invalid@email.com',
                password,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        res.status = jest.fn(() => res);
        await resetPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(invalidResetSession);
    });
    it('should call db_change_password with email and password on success', async () => {
        const req = {
            body: {
                resetSession,
                email,
                password,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        await resetPassword(req, res);
        expect(dbChangePasswordSpy).toHaveBeenCalledWith(email, password);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
    it('should send 200 Ok when successful', async () => {
        const req = {
            body: {
                resetSession,
                email,
                password,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        await resetPassword(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
    it('should delete reset session from redis on success', async () => {
        const req = {
            body: {
                resetSession,
                email,
                password,
            },
        };
        const res = {
            send: jest.fn(),
            sendStatus: jest.fn(),
        };
        await resetPassword(req, res);
        expect(redisDeleteResetSessionSpy).toHaveBeenCalledWith(resetSession);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
});
