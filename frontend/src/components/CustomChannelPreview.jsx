import { Hash } from 'lucide-react';

const CustomChannelPreview = ({ channel, setActiveChannel, activeChannel }) => {
    const isActive = activeChannel && activeChannel.id === channel.id;
    const isDM = channel.data.member_count === 2 && channel.data.id.includes('user_');

    if (isDM) return null;

    const unreadCount = channel.countUnread;

    return (
        <button
            onClick={() => setActiveChannel(channel)}
            aria-selected={isActive}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left min-h-10 transition-colors duration-200 border ${
                isActive
                    ? 'bg-neutral-850 border-white/10'
                    : 'border-transparent bg-neutral-950 hover:border-white/10 hover:bg-white/5'
            }`}
        >
            <Hash className="size-4 text-neutral-400 shrink-0" />
            <span className="flex-1 truncate text-sm text-neutral-200">{channel.data.id}</span>

            {unreadCount > 0 && (
                <span className="ml-2 grid h-5 min-w-5 place-items-center rounded-full bg-white/10 px-1.5 text-[10px] font-medium text-neutral-100 ring-1 ring-white/20">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};
export default CustomChannelPreview;
