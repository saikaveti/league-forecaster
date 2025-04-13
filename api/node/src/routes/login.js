import { emailValidator, passwordValidator, phoneValidator } from '../utils/constants.js';
import { db_login } from '../mysql/queries.js';
import { createLoginToken, jwtOptions } from '../utils/jwt.js';
import { verifyPasswordHash } from '../utils/bcrypt.js';

export const incorrectLoginError = 'Incorrect login details. Please try again.';

export async function login(req, res) {
    let email,
        phone,
        password = '';
    try {
        const params = extractLoginParams(req.body.identifier, req.body.password);
        email = params.email;
        phone = params.phone;
        password = params.password;
    } catch (e) {
        res.status(400).send(e.message);
    }
    const login_res = await db_login(email, phone);
    const userInfo = login_res ? login_res[0] : undefined;
    const passwordIsCorrect = userInfo?.password
        ? await verifyPasswordHash(password, userInfo?.password)
        : false;
    if (userInfo && passwordIsCorrect) {
        const token = createLoginToken(`user #${userInfo.id}, name:${userInfo.email}`);
        res.cookie('token', token, jwtOptions);
        res.sendStatus(200);
    } else {
        res.status(403).send(incorrectLoginError);
    }
}

export function extractLoginParams(identifier, password) {
    const error = new Error(incorrectLoginError);

    if (!(identifier && password)) {
        throw error;
    }

    const validEmail = emailValidator.test(identifier);
    const validPhone = phoneValidator.test(identifier);
    const validPassword = passwordValidator.test(password);

    if (!((validEmail || validPhone) && validPassword)) {
        throw error;
    }

    return {
        email: validEmail ? identifier : undefined,
        phone: validPhone ? identifier : undefined,
        password,
    };
}

export function logout(_, res) {
    res.cookie('token', undefined, jwtOptions);
    res.sendStatus(200);
}
