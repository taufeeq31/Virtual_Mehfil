import '../instrument.mjs';
import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { functions, inngest } from './config/inngest.js';
import { serve } from 'inngest/express';
import chatRoutes from './routes/chat.routes.js';

import * as Sentry from '@sentry/node';

const app = express();

app.use(clerkMiddleware()); //verify karega token ko and will attach req.auth
app.use(express.json()); //help in parsing json bodies

app.get('/debug-sentry', (req, res) => {
    throw new Error('My first sentry error');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/chat', chatRoutes);

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
    try {
        await connectDB();
        if (ENV.NODE_ENV !== 'production') {
            app.listen(ENV.PORT, () => {
                console.log(`Server is running on port ${ENV.PORT}`);
            });
        }
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
