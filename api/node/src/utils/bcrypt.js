import * as bcrypt from 'bcrypt';

export const errorHashingPassword = 'Error hashing password';
export async function hashPassword(password) {
    try {
        const saltRounds = 7;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error(errorHashingPassword);
    }
}

export const errorVerifyingPassword = 'Error verifying password';
export async function verifyPasswordHash(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error(errorVerifyingPassword);
    }
}
