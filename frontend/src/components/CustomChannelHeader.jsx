import { HashIcon, LockIcon, UsersIcon, PinIcon, VideoIcon } from 'lucide-react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import MembersModal from './MembersModal';
import PinnedMessagesModal from './PinnedMessagesModal';
import InviteModal from './InviteModal';
import { deleteChannel as deleteChannelApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router';

const CustomChannelHeader = () => {
    const { channel } = useChannelStateContext();
    const { client, setActiveChannel } = useChatContext();
    const { user } = useUser();
    const [searchParams, setSearchParams] = useSearchParams();

    const memberCount = Object.keys(channel.state.members).length;

    const [showInvite, setShowInvite] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [showPinnedMessages, setShowPinnedMessages] = useState(false);
    const [pinnedMessages, setPinnedMessages] = useState([]);

    const otherUser = Object.values(channel.state.members).find(
        (member) => member.user.id !== user.id
    );

    const isDM = channel.data?.member_count === 2 && channel.data.id.includes('user_');

    const handleShowPinned = async () => {
        const channelState = await channel.query();
        setPinnedMessages(channelState.pinned_messages);
        setShowPinnedMessages(true);
    };

    const handleVideoCall = async () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;
            await channel.sendMessage({
                text: `Join the video call: ${callUrl}`,
            });
        }
    };

    const isOwner =
        channel?.data?.created_by?.id === user?.id || channel?.data?.created_by_id === user?.id;

    const handleDeleteChannel = async () => {
        if (!channel) return;
        const confirmed = window.confirm(
            `Delete #${channel.id}? This will remove the channel and its messages for everyone.`
        );
        if (!confirmed) return;

        try {
            await deleteChannelApi(channel.id, false);
            toast.success(`Channel #${channel.id} deleted`);
            // Pick the next available channel for the current user (most recent)
            try {
                const filters = { type: 'messaging', members: { $in: [user.id] } };
                const sort = { last_message_at: -1, updated_at: -1 };
                const next = await client.queryChannels(filters, sort, { limit: 1 });

                if (next && next[0]) {
                    const nextChannel = next[0];
                    // ensure it's watched before activating
                    await nextChannel.watch();
                    setActiveChannel(nextChannel);
                    setSearchParams({ channel: nextChannel.id });
                } else {
                    setActiveChannel(null);
                    if (searchParams.get('channel')) setSearchParams({});
                }
            } catch (e) {
                // Fallback: clear active channel and URL param
                setActiveChannel(null);
                if (searchParams.get('channel')) setSearchParams({});
            }
        } catch (e) {
            console.error('Delete channel failed', e);
            toast.error(e?.response?.data?.message || 'Failed to delete channel');
        }
    };

    return (
        <div className="h-14 border-b border-gray-200 flex items-center px-4 justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    {channel.data?.private ? (
                        <LockIcon className="size-4 text-[#616061]" />
                    ) : (
                        <HashIcon className="size-4 text-[#616061]" />
                    )}

                    {isDM && otherUser?.user?.image && (
                        <img
                            src={otherUser.user.image}
                            alt={otherUser.user.name || otherUser.user.id}
                            className="size-7 rounded-full object-cover mr-1"
                        />
                    )}

                    <span className="font-medium text-[#1D1C1D]">
                        {isDM ? otherUser?.user?.name || otherUser?.user?.id : channel.data?.id}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    className="flex items-center gap-2 hover:bg-[#F8F8F8] py-1 px-2 rounded"
                    onClick={() => setShowMembers(true)}
                >
                    <UsersIcon className="size-5 text-[#616061]" />
                    <span className="text-sm text-[#616061]">{memberCount}</span>
                </button>

                <button
                    className="hover:bg-[#F8F8F8] p-1 rounded"
                    onClick={handleVideoCall}
                    title="Start Video Call"
                >
                    <VideoIcon className="size-5 text-[#1264A3]" />
                </button>

                {channel.data?.private && (
                    <Button className="bg-blue-500" onClick={() => setShowInvite(true)}>
                        Invite
                    </Button>
                )}

                <Button className="hover:bg-[#F8F8F8] bg-transparent p-1 rounded" onClick={handleShowPinned}>
                    <PinIcon className="size-4 text-[#616061]" />
                </Button>

                {isOwner && (
                    <Button
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleDeleteChannel}
                    >

                        Delete
                    </Button>
                )}
            </div>

            {showMembers && (
                <MembersModal
                    members={Object.values(channel.state.members)}
                    onClose={() => setShowMembers(false)}
                />
            )}

            {showPinnedMessages && (
                <PinnedMessagesModal
                    pinnedMessages={pinnedMessages}
                    onClose={() => setShowPinnedMessages(false)}
                />
            )}

            {showInvite && <InviteModal channel={channel} onClose={() => setShowInvite(false)} />}
        </div>
    );
};

export default CustomChannelHeader;
