import { addUserToPublicChannel, deleteChannelIfOwner, generateStreamToken } from '../config/stream.js';

export const getStreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(req.auth().userId);
        res.status(200).json({ token });
    } catch (error) {
        console.log('Error generating stream token:', error);

        res.status(500).json({ message: 'Fail to generate stream token', error });
    }
};

// Adds the current authenticated user to all public/discoverable channels (idempotent)
export const syncPublicChannelsForCurrentUser = async (req, res) => {
    try {
        const userId = req.auth().userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        await addUserToPublicChannel(userId.toString());
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error syncing public channels:', error);
        res.status(500).json({ message: 'Failed to sync public channels' });
    }
};

// Deletes a channel if the current user is the creator. Optional body: { channelId: string, hard?: boolean }
export const deleteChannel = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { channelId, hard = false } = req.body || {};
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (!channelId) return res.status(400).json({ message: 'channelId is required' });

        await deleteChannelIfOwner(userId.toString(), channelId, { hard: !!hard });
        res.status(200).json({ success: true });
    } catch (error) {
        const status = error?.status || 500;
        console.error('Error deleting channel:', error);
        res.status(status).json({ message: error?.message || 'Failed to delete channel' });
    }
};
