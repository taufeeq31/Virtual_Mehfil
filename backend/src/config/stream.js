import { StreamChat } from 'stream-chat';
import { ENV } from './env.js';

const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData);
        console.log('Stream user upsert successfully: ', userData.name);
        return userData;
    } catch (error) {
        console.log('Error upserting Stream user: ', error);
    }
};

export const deleteStreamUser = async (userId) => {
    try {
        await streamClient.deleteUser(userId);
    } catch (error) {
        console.error('Error deleting Stream user: ', error);
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.error('Error generating Stream Token: ', error);
        return null;
    }
};

export const addUserToPublicChannel = async (newUserId) => {
    const publicChannels = await streamChannels({ discoverable: true });
    for (const channel of publicChannels) {
        await channel.addMembers([newUserId]);
    }
};
