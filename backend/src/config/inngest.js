import { Inngest } from 'inngest';
import { connectDB } from './db.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'mehfil' });

const syncUser = inngest.createFunction(
    { id: 'sync-user' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        await connectDB();
        const { email, name, first_name, last_name, id } = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ''} ${last_name || ''}`,
            image: image_url,
        };

        await User.created(newUser);
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: 'delete-user-from-db' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data;
        await User.deleteOne({ clerkId: id });

    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB];
