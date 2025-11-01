import express from 'express';
import {
    getStreamToken,
    syncPublicChannelsForCurrentUser,
    deleteChannel,
} from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/token', protectRoute, getStreamToken);
router.post('/sync-public-channels', protectRoute, syncPublicChannelsForCurrentUser);
router.post('/delete-channel', protectRoute, deleteChannel);

export default router;
