import { UserButton } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../../../backend/src/hooks/useStreamChat.js';
import { Spinner } from '@/components/ui/spinner.jsx';
import { Hash, Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import '../styles/stream-chat-theme.css';

import {
    Chat,
    Channel,
    ChannelList,
    MessageList,
    MessageInput,
    Thread,
    Window,
} from 'stream-chat-react';
import CreateChannelModal from '@/components/CreateChannelModal.jsx';
import CustomChannelPreview from '@/components/CustomChannelPreview.jsx';
import UsersList from '@/components/UsersList.jsx';

const HomePage = () => {
    const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
    const [activeChannel, setActiveChannel] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { chatClient, error, isLoading } = useStreamChat();
    const currentUserId = chatClient?.user?.id ?? chatClient?.userID;

    //set active channel when chat client is ready
    useEffect(() => {
        if (chatClient) {
            const channelId = searchParams.get('channel');
            if (channelId) {
                const channel = chatClient.channel('messaging', channelId);
                setActiveChannel(channel);
            }
        }
    }, [chatClient, searchParams]);

    if (error)
        return (
            <div className="min-h-screen grid place-items-center bg-slate-900 text-slate-200">
                Error loading chat client
            </div>
        );
    if (isLoading || !chatClient)
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-900">
                <Spinner className="size-8 text-slate-300" />
            </div>
        );

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <Chat client={chatClient}>
                <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1400px] grid-cols-1 md:grid-cols-[300px_1fr] md:h-[100dvh] shadow-2xl">
                    {/* Sidebar */}
                    <aside className="sticky top-0 z-20 border-b border-blue-900/40 bg-slate-800 md:static md:border-b-0 md:border-r md:border-blue-900/40">
                        {/* Header */}
                        <div className="flex items-center bg-slate-900 justify-between gap-3 p-4">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/Logo3.png"
                                    alt="Logo"
                                    className="h-10 w-10 rounded  object-cover bg-white p-0.5"
                                />
                                <span className="text-xl font-semibold tracking-wide text-blue-400">
                                    Mehfil
                                </span>
                            </div>
                            <UserButton />
                        </div>
                        <div className="border-t border-blue-900/40" />
                        {/* Actions */}
                        <div className="space-y-4 p-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setisCreateModalOpen(true)}
                                className="w-full rounded-lg border-blue-500 bg-blue-600 text-white hover:bg-blue-500 transition duration-150 p-2.5 shadow-md shadow-blue-500/20"
                            >
                                <Plus className="size-4 mr-2" />
                                Create New Channel
                            </Button>
                        </div>
                        {/* ChannelList */}
                        <div className="px-3 pb-4 md:pb-4 max-h-[40vh] overflow-y-auto md:max-h-[calc(100vh-200px)]">
                            <ChannelList
                                filters={{ members: { $in: [currentUserId] } }}
                                options={{ state: true, watch: true }}
                                Preview={({ channel }) => (
                                    <CustomChannelPreview
                                        channel={channel}
                                        activeChannel={activeChannel}
                                        setActiveChannel={(channel) =>
                                            setSearchParams({ channel: channel.id })
                                        }
                                    />
                                )}
                                List={({ children, loading, error }) => (
                                    <div className="space-y-3">
                                        {/* Channels header */}
                                        <div className="flex items-center justify-between px-1 pt-2">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-400 font-semibold">
                                                <Hash className="size-4 text-blue-500" />
                                                <span>Channels</span>
                                            </div>
                                        </div>
                                        <div className="h-px bg-blue-900/50" />

                                        {loading && (
                                            <div className="px-3 py-2 text-sm text-slate-400">
                                                Loading channels…
                                            </div>
                                        )}
                                        {error && (
                                            <div className="px-3 py-2 text-sm text-red-400">
                                                Error loading channels
                                            </div>
                                        )}

                                        <div className="space-y-1.5 px-0.5">{children}</div>

                                        {/* Direct Messages header */}
                                        <div className="mt-4 flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-400 font-semibold">
                                                <Users className="size-4 text-blue-500" />
                                                <span>Direct Messages</span>
                                            </div>
                                        </div>
                                        <div className="h-px mb-0 bg-blue-900/50" />

                                        <UsersList activeChannel={activeChannel} />
                                    </div>
                                )}
                            />
                        </div>
                    </aside>

                    {/* Main Chat Area */}
                    <main className="relative flex min-h-0 flex-col md:h-[100dvh] bg-slate-900">
                        {/* Header bar over chat - more vibrant blue accent */}
                        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-blue-900/50 bg-slate-800/70 px-4 py-3 backdrop-blur-md">
                            <div className="min-w-0">
                                <div className="truncate text-xs text-blue-300">Active Channel</div>
                                <div className="truncate text-lg font-bold text-slate-50">
                                    {activeChannel?.data?.name || activeChannel?.id || 'Welcome'}
                                </div>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1">
                            <Channel channel={activeChannel}>
                                <Window>
                                    <MessageList />
                                    <MessageInput />
                                </Window>
                                <Thread />
                            </Channel>
                        </div>
                    </main>
                </div>
                {isCreateModalOpen && (
                    <CreateChannelModal onClose={() => setisCreateModalOpen(false)} />
                )}
            </Chat>
        </div>
    );
};

export default HomePage;
