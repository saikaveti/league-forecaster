import router from '@/router';
import { serverHost } from '@/views/constants';

export async function request(endpoint: string, options: any) {
    options.credentials = 'include';
    const res = await fetch(`${serverHost}${endpoint}`, options);
    if (res.status === 403) {
        router.replace('/login');
    }
    return res;
}
