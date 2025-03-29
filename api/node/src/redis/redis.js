import { createClient } from 'redis';

// TODO: need error handling on all of these. and make sure frontend is working as expected when these error

const tenMinutes = 600;
const thirtyMinutes = 1800;

class Redis {
    constructor() {
        this.client = createClient();
        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    async connect() {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    async getSignupSession(uuid) {
        return await this.client.hGetAll(this.signupSessionKey(uuid));
    }

    async saveSignupSession(uuid, phone) {
        const key = this.signupSessionKey(uuid);
        await this.client.hSet(key, { phone });
        await this.client.expire(key, tenMinutes);
    }

    async verifyPhoneForSignup(uuid) {
        const key = this.signupSessionKey(uuid);
        await this.client.hSet(key, { verified: 'true' });
        await this.client.expire(key, tenMinutes);
    }

    async deleteSignupSession(uuid) {
        const key = this.signupSessionKey(uuid);
        await this.client.del(key);
    }

    signupSessionKey(uuid) {
        return `signup-session:${uuid}`;
    }

    async getPhoneNumberCode(phoneNumber) {
        return await this.client.get(this.phoneNumberVerificationKey(phoneNumber));
    }

    async setPhoneNumberCode(phone, code) {
        const key = this.phoneNumberVerificationKey(phone);
        await this.client.set(key, code);
        await this.client.expire(key, tenMinutes);
    }

    async deletePhoneNumberCode(phone) {
        const key = this.phoneNumberVerificationKey(phone);
        await this.client.del(key);
    }

    phoneNumberVerificationKey(phoneNumber) {
        return `phone-code:${phoneNumber}`;
    }

    async saveResetSession(email, uuid) {
        const key = this.resetSessionKey(uuid);
        await this.client.set(key, email);
        await this.client.expire(key, thirtyMinutes);
    }

    async getResetSession(uuid) {
        const key = this.resetSessionKey(uuid);
        return await this.client.get(key);
    }

    async deleteResetSession(uuid) {
        const key = this.resetSessionKey(uuid);
        await this.client.del(key);
    }

    resetSessionKey(uuid) {
        return `reset-session:${uuid}`;
    }
}
const redis = new Redis();
export default redis;
