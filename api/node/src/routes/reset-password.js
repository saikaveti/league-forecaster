import { db_check_for_existing_user, db_change_password } from '../mysql/queries.js';
import redis from '../redis/redis.js';
import { hashPassword } from '../utils/bcrypt.js';
import {
    emailValidator,
    passwordValidator,
    phoneValidator,
    uuidValidator,
} from '../utils/constants.js';
import { v4 as uuidv4 } from 'uuid';

export async function forgotPassword(req, res) {
    const params = extractForgotPasswordParams(req.body.identifier);
    const email = params.email;
    const phone = params.phone;
    if (email || phone) {
        const existingUser = await db_check_for_existing_user(email, phone);
        if (existingUser.length === 1) {
            const resetSession = uuidv4();
            await redis.saveResetSession(existingUser[0].email, resetSession);
            // TODO: send reset email containing reset session in url using email service. for now, just output it to the console
            console.log(`Reset Session: ${resetSession}`);
        }
    }
    res.sendStatus(200);
}

export function extractForgotPasswordParams(identifier) {
    if (!identifier) {
        return {};
    }

    const validEmail = emailValidator.test(identifier);
    const validPhone = phoneValidator.test(identifier);

    if (!(validEmail || validPhone)) {
        return {};
    }

    return {
        email: validEmail ? identifier : undefined,
        phone: validPhone ? identifier : undefined,
    };
}

export const invalidResetSession = 'Invalid reset session';

export async function resetPassword(req, res) {
    let resetSession,
        email,
        password = '';
    try {
        const params = extractResetPasswordParams(req.body);
        resetSession = params.resetSession;
        email = params.email;
        password = params.password;
    } catch (e) {
        res.status(400).send(e.message);
        return;
    }
    const existingResetSessionEmail = await redis.getResetSession(resetSession);
    if (!existingResetSessionEmail) {
        res.status(400).send(invalidResetSession);
        return;
    }
    if (existingResetSessionEmail !== email) {
        res.status(400).send(invalidResetSession);
        return;
    }
    const hashedPassword = await hashPassword(password);
    await db_change_password(existingResetSessionEmail, hashedPassword);
    await redis.deleteResetSession(resetSession);
    res.sendStatus(200);
}

export const noParamsProvided = 'No params provided';
export const invalidPassword = 'Invalid password';
export const invalidEmail = 'Invalid email';

export function extractResetPasswordParams(body) {
    if (!body) {
        throw new Error(noParamsProvided);
    }
    const validResetSession = uuidValidator.test(body.resetSession);
    const validPassword = passwordValidator.test(body.password);
    const validEmail = emailValidator.test(body.email);
    if (!validResetSession) {
        throw new Error(invalidResetSession);
    }
    if (!validPassword) {
        throw new Error(invalidPassword);
    }
    if (!validEmail) {
        throw new Error(invalidEmail);
    }
    return {
        resetSession: body.resetSession,
        password: body.password,
        email: body.email,
    };
}
