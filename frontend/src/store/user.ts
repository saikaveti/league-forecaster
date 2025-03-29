import { serverHost } from '@/views/constants';
import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', () => {
    async function authenticateUser(
        identifier: string,
        password: string
    ): Promise<AuthenticateUserResponse> {
        const res = await fetch(`${serverHost}/login`, {
            method: 'POST',
            body: JSON.stringify({
                identifier,
                password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        return { status: res.ok, text: await res.text() };
    }

    return { authenticateUser };
});

interface AuthenticateUserResponse {
    status: boolean;
    text: string;
}
