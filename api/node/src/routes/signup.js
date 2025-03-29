import {
    emailValidator,
    passwordValidator,
    phoneValidator,
    textCodeValidator,
    uuidValidator,
} from '../utils/constants.js';
import {
    db_check_for_unique_phone,
    db_check_for_unique_user,
    db_signup,
} from '../mysql/queries.js';
import { v4 as uuidv4 } from 'uuid';
import redis from '../redis/redis.js';
import { createLoginToken, jwtOptions } from '../utils/jwt.js';

export const undefinedSignupParams =
    'Undefined signup parameters. Please contact the system administrator.';
export const invalidEmail = 'Invalid email entered. Please try again.';
export const invalidPassword = 'Invalid password entered. Please try again.';
export const invalidPhone = 'Invalid phone number entered. Please try again.';
export const duplicateEmail =
    'Email address is already in use. Please log in or try again with a different email.';
export const duplicatePhone =
    'Phone number is already in use. Please log in or try again with a different phone number.';

export const phoneCodeSessionExistsError =
    'You are doing that too frequently. Please try again later.';

export async function verifyUserIsUnique(email, phone) {
    const row = await db_check_for_unique_user(email, phone);
    if (!row.length) {
        return;
    }
    if (row[0].email === email) {
        throw new Error(duplicateEmail);
    }
    if (row[0].phone === phone) {
        throw new Error(duplicatePhone);
    }
}

export async function startSignup(req, res) {
    let phone = '';
    try {
        const params = extractStartSignupParams(req.body);
        phone = params.phone;
    } catch (e) {
        res.status(400).send(e.message);
        return;
    }

    const phoneCodeSessionExists = (await redis.getPhoneNumberCode(phone)) !== null;

    if (phoneCodeSessionExists) {
        res.status(409).send(phoneCodeSessionExistsError);
        return;
    }

    try {
        await verifyPhoneIsUnique(phone);
    } catch (e) {
        res.status(409).send(e.message);
        return;
    }
    const uuid = uuidv4();

    await redis.saveSignupSession(uuid, phone);

    await sendPhoneCode(phone);
    res.send(uuid);
}

export function extractStartSignupParams(body) {
    if (!body) {
        throw new Error(undefinedSignupParams);
    }
    if (!phoneValidator.test(body.phone)) {
        throw new Error(invalidPhone);
    }

    return {
        phone: body.phone,
    };
}

export async function verifyPhoneIsUnique(phone) {
    const row = await db_check_for_unique_phone(phone);
    if (!row.length) {
        return;
    }
    if (row[0].phone === phone) {
        throw new Error(duplicatePhone);
    }
}

export async function sendPhoneCode(phone) {
    // TODO: use twilio to send code and put in that code as the value
    await redis.setPhoneNumberCode(phone, '123456');
}

export const undefinedVerifyPhoneParams =
    'Undefined parameters for verifying phone number. Please contact the system administrator.';
export const invalidSignupSession = 'Invalid session. Please contact the system administrator.';
export const invalidTextCode = 'The code you entered is not valid. Please try again.';
export const noSignupSession = 'Missing sign up information. Please try registering again.';

export async function verifyPhone(req, res) {
    let signupSession,
        textCode = '';
    try {
        const params = extractVerifyPhoneParams(req.body);
        signupSession = params.signupSession;
        textCode = params.textCode;
    } catch (e) {
        res.status(400).send(e.message);
        return;
    }
    const savedSession = await redis.getSignupSession(signupSession);
    const codeToMatch = await redis.getPhoneNumberCode(savedSession?.phone);
    if (savedSession && codeToMatch !== textCode) {
        res.status(401).send(invalidTextCode);
    } else {
        if (!savedSession) {
            res.status(500).send(noSignupSession);
            return;
        }
        await redis.verifyPhoneForSignup(signupSession);
        res.sendStatus(200);
        redis.deletePhoneNumberCode(savedSession.phone);
    }
}

export function extractVerifyPhoneParams(body) {
    if (!body) {
        throw new Error(undefinedVerifyPhoneParams);
    }
    if (!uuidValidator.test(body.signupSession)) {
        throw new Error(invalidSignupSession);
    }
    if (!textCodeValidator.test(body.textCode)) {
        throw new Error(invalidTextCode);
    }

    return {
        signupSession: body.signupSession,
        textCode: body.textCode,
    };
}

export async function finishSignup(req, res) {
    let signupSession,
        email,
        password = '';
    try {
        const params = extractFinishSignupParams(req.body);
        email = params.email;
        password = params.password;
        signupSession = params.signupSession;
    } catch (e) {
        res.status(400).send(e.message);
        return;
    }

    const savedSession = await redis.getSignupSession(signupSession);
    if (!savedSession || !savedSession.phone || savedSession.verified !== 'true') {
        res.status(500).send(noSignupSession);
        return;
    }
    try {
        await verifyUserIsUnique(email, savedSession.phone);
    } catch (e) {
        res.status(409).send(e.message);
        return;
    }

    await db_signup(email, savedSession.phone, password);
    const token = createLoginToken(email); // TODO: should set same data as login
    res.cookie('token', token, jwtOptions);
    res.sendStatus(200);
    redis.deleteSignupSession(signupSession);
}

export function extractFinishSignupParams(body) {
    if (!body) {
        throw new Error(undefinedSignupParams);
    }
    if (!uuidValidator.test(body.signupSession)) {
        throw new Error(invalidSignupSession);
    }
    if (!emailValidator.test(body.email)) {
        throw new Error(invalidEmail);
    }
    if (!passwordValidator.test(body.password)) {
        throw new Error(invalidPassword);
    }

    return {
        signupSession: body.signupSession,
        email: body.email,
        password: body.password,
    };
}
