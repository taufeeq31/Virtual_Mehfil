import { addUserToPublicChannel, generateStreamToken } from '../config/stream.js';

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
