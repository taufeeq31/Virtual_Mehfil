import { UserButton } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../../../backend/src/hooks/useStreamChat.js';
import { Spinner } from '@/components/ui/spinner.jsx';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import '../styles/stream-chat-theme.css';

import { Chat, Channel, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';
import CreateChannelModal from '@/components/CreateChannelModal.jsx';

const HomePage = () => {
    const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
    const [activeChannel, setActiveChannel] = useState(null);
    const [searchParams] = useSearchParams();
    const { chatClient, error, isLoading } = useStreamChat();

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

    // TODO : Handle this with better and proper UI
    if (error)
        return (
            <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-200">
                Error loading chat client
            </div>
        );
    if (isLoading || !chatClient)
        return (
            <div className="flex h-screen w-full items-center justify-center bg-neutral-950">
                <Spinner className="size-8 text-neutral-300" />
            </div>
        );

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <Chat client={chatClient}>
                <div className="mx-auto grid h-screen max-w-[1400px] grid-cols-[320px_1fr]">
                    {/* Sidebar */}
                    <aside className="border-r border-white/10 bg-neutral-950/60 backdrop-blur-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 p-4">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/Logo3.png"
                                    alt="Logo"
                                    className="h-6 w-6 rounded-sm object-contain"
                                />
                                <span className="text-sm font-semibold tracking-tight">Mehfil</span>
                            </div>
                            <UserButton />
                        </div>
                        <div className="border-t border-white/10" />
                        {/* Actions */}
                        <div className="p-4 space-y-3">
                            {/* Faux search input for visual balance (UI only) */}
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Search className="size-4 text-neutral-400/80" />
                                </div>
                                <Input placeholder="Search" className="pl-9" readOnly />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setisCreateModalOpen(true)}
                                className="w-full rounded-lg border-white/15 bg-transparent text-neutral-200 hover:bg-white/5"
                            >
                                <Plus className="size-4" />
                                Create channel
                            </Button>
                        </div>
                        {/* Placeholder channel list (skeleton) */}
                        <div className="px-2 pb-4">
                            <ul className="space-y-1">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <li
                                        key={i}
                                        className="animate-pulse rounded-lg border border-white/5 bg-white/[0.03] p-3"
                                    >
                                        <div className="h-3 w-2/3 rounded bg-white/10" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Main Chat Area */}
                    <main className="relative flex h-screen flex-col">
                        {/* Subtle header bar over chat */}
                        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-white/10 bg-neutral-950/60 px-4 py-3 backdrop-blur-sm">
                            <div className="min-w-0">
                                <div className="truncate text-xs text-neutral-400">Channel</div>
                                <div className="truncate text-sm font-medium text-neutral-100">
                                    {activeChannel?.data?.name || activeChannel?.id || '—'}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0">
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
