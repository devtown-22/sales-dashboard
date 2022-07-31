import axios from 'axios';
import { auth } from '@/lib/firebase'

export default async () => {
    const user = await auth?.currentUser;
    let token = ''
    if (user && Object.keys(user).length > 0) {
        token = await user?.getIdToken()
    }
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};
