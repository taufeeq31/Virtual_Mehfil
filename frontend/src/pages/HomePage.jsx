import { UserButton } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '@/hooks/useStreamChat.js';
import { Spinner } from '@/components/ui/spinner.jsx';
import { Hash, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';

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
import CustomChannelHeader from '@/components/CustomChannelHeader.jsx';

const HomePage = () => {
    const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
    const [activeChannel, setActiveChannel] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { chatClient, error, isLoading } = useStreamChat();
    const currentUserId = chatClient?.user?.id ?? chatClient?.userID;

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
                <SidebarProvider
                    style={{
                        '--sidebar': '#1f2937',
                        '--sidebar-foreground': '#e2e8f0',
                        '--sidebar-border': 'rgba(30, 58, 138, 0.4)',
                        '--sidebar-accent': 'rgba(30, 58, 138, 0.15)',
                        '--sidebar-accent-foreground': '#cbd5e1',
                        '--sidebar-ring': '#2563eb',
                    }}
                >
                    <Sidebar
                        collapsible="offcanvas"
                        className="border-r border-blue-900/40 bg-slate-800"
                    >
                        <SidebarHeader className="bg-slate-900">
                            <div className="flex items-center justify-between gap-3 p-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/Logo3.png"
                                        alt="Logo"
                                        className="h-10 w-10 rounded object-cover bg-white p-0.5"
                                    />
                                    <span className="text-xl font-semibold tracking-wide text-blue-400">
                                        Mehfil
                                    </span>
                                </div>
                                <UserButton />
                            </div>
                        </SidebarHeader>
                        <SidebarSeparator />
                        <SidebarContent>
                            {/* Create channel action */}
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

                            {/* Channels group */}
                            <SidebarGroup>
                                <SidebarGroupLabel>
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Hash className="size-4 text-blue-500" />
                                        <span>Channels</span>
                                    </div>
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <div className="px-3 md:pb-3">
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
                                                    <div className="space-y-1.5 px-0.5">
                                                        {children}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarSeparator />

                            {/* Direct Messages group */}
                            <SidebarGroup>
                                <SidebarGroupLabel>
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Users className="size-4 text-blue-500" />
                                        <span>Direct Messages</span>
                                    </div>
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <div className="px-3 pb-2 md:pb-3">
                                        <UsersList activeChannel={activeChannel} />
                                    </div>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>

                    <SidebarInset>
                        {/* Mobile sidebar trigger */}
                        <div className="p-2 md:hidden">
                            <SidebarTrigger className="md:hidden bg-blue-300  " />
                        </div>
                        <div className="min-h-0 flex-1">
                            <Channel channel={activeChannel}>
                                <Window>
                                    <CustomChannelHeader />
                                    <MessageList />
                                    <MessageInput />
                                </Window>
                                <Thread />
                            </Channel>
                        </div>
                    </SidebarInset>
                </SidebarProvider>

                {isCreateModalOpen && (
                    <CreateChannelModal onClose={() => setisCreateModalOpen(false)} />
                )}
            </Chat>
        </div>
    );
};

export default HomePage;
