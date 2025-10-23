import { useState, useEffect, Component } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import * as Sentry from '@sentry/react';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// A custom hook to initialize and manage Stream Chat client
// So when user is available, we fetch the token and connect the user to Stream Chat
// We also handle cleanup by disconnecting the user when the component using this hook unmounts

export const useStreamChat = () => {
    const { user } = useUser();
    const [chatClient, setChatClient] = useState(null);

    // Fetch Stream token when user is available
    const {
        data: tokenData,
        isLoading: tokenLoading,
        error: tokenError,
    } = useQuery({
        queryKey: ['streamToken'],
        queryFn: getStreamToken,
        enabled: !!user?.id, // this will take an object and return true or false
    });

    // Initialize Stream Chat client when token and user are available
    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !user) return;
            try {
                const client = StreamChat.getInstance(STREAM_API_KEY);
                await client.connectUser({
                    id: user.id,
                    name: user.fullName,
                    image: user.imageUrl,
                });
                setChatClient(client);
            } catch (error) {
                console.log('Error connecting to stream: ', error);
                Sentry.captureException(error, {
                    tags: { Component: 'useStreamChat' },
                    extra: {
                        context: 'Stream Chat Connection Error',
                        userId: user?.id,
                        streamApiKey: STREAM_API_KEY ? 'Available' : 'Not Available',
                    },
                });
            }
        };

        initChat();

        // Cleanup function to disconnect user on unmount
        return () => {
            if (chatClient) {
                chatClient.disconnectUser();
            }
        };
    }, [tokenData, user, chatClient]);

    return { chatClient, isLoading: tokenLoading, error: tokenError };
};
