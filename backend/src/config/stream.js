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
    // Query all public/discoverable messaging channels and add the new user as a member
    const channels = await streamClient.queryChannels({
        type: 'messaging',
        discoverable: true,
    });
    for (const channel of channels) {
        await channel.addMembers([newUserId]);
    }
};

// Delete a channel if the requesting user is the creator/owner
export const deleteChannelIfOwner = async (userId, channelId, { hard = false } = {}) => {
    const [channel] = await streamClient.queryChannels(
        { id: { $eq: channelId }, type: 'messaging' },
        {},
        { limit: 1 }
    );

    if (!channel) {
        const err = new Error('Channel not found');
        err.status = 404;
        throw err;
    }

    const createdById = channel.data?.created_by?.id || channel.data?.created_by_id;
    if (!createdById || createdById !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }

    await channel.delete({ hard });
    return { deleted: true };
};
