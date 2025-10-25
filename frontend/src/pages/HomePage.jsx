import { UserButton } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../../../backend/src/hooks/useStreamChat.js';
import { Spinner } from '@/components/ui/spinner.jsx';
import { PlusIcon } from 'lucide-react';

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

const HomePage = () => {
    const [isCreateModalOpen, setisCreateModalOpen] = useState(false);
    const [activeChannel, setActiveChannel] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
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
    if (error) return <div>Error loading chat client</div>;
    if (isLoading || !chatClient)
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner className="size-8 text-primary" />
            </div>
        );

    return (
        <div className="chat-wrapper">
            <Chat client={chatClient}>
                <div className="chat-container">
                    {/* Left Sidebar */}
                    <div className="str-chat__channel">
                        <div className="team-channel-list">
                            {/* Header */}
                            <div className="team-channel-list__header gap-4">
                                <div className="brand-container">
                                    <img src="/Logo3.png" alt="Logo" className="brand-logo" />
                                    <span className="brand-name">Mehfil</span>
                                </div>
                                <div className="user-button-wrapper">
                                    <UserButton />
                                </div>
                            </div>
                            {/* Channel Section */}
                            <div className="team-channel-list__content">
                                <div className="create-channel-section">
                                    <button
                                        onClick={() => setisCreateModalOpen(true)}
                                        className="create-channel-btn"
                                    >
                                        <PlusIcon className="size-5" />
                                        <span>Create Channel</span>
                                    </button>
                                </div>
                                {/* ChannelList */}
                            </div>
                        </div>
                    </div>
                    {/* Right COontainer */}
                    <div className="chat-main">
                        <Channel channel={activeChannel}>
                            <Window>
                                {/* <CustomChannelHeader /> */}
                                <MessageList />
                                <MessageInput />
                            </Window>

                            <Thread />
                        </Channel>
                    </div>
                </div>
                {isCreateModalOpen && (
                    <CreateChannelModal onClose={() => setisCreateModalOpen(false)} />
                )}
            </Chat>
        </div>
    );
};

export default HomePage;
