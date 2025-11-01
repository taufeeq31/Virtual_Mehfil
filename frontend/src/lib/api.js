import { axiosInstance } from './axios';

export async function getStreamToken() {
    const response = await axiosInstance.get('/chat/token');
    return response.data;
}

export async function syncPublicChannels() {
    const response = await axiosInstance.post('/chat/sync-public-channels');
    return response.data;
}
