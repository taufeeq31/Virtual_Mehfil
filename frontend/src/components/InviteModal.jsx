import { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InviteModal = ({ channel, onClose }) => {
    const { client } = useChatContext();

    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [error, setError] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    // we could have done this with tanstack query, but to keep it simple, we're using useEffect here...
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoadingUsers(true);
            setError('');

            try {
                const members = Object.keys(channel.state.members);
                const res = await client.queryUsers(
                    { id: { $nin: members } },
                    { name: 1 },
                    { limit: 30 }
                );
                setUsers(res.users);
            } catch (error) {
                console.log('Error fetching users', error);
                setError('Failed to load users');
            } finally {
                setIsLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [channel, client]);

    const handleInvite = async () => {
        if (selectedMembers.length === 0) return;

        setIsInviting(true);
        setError('');

        try {
            await channel.addMembers(selectedMembers);
            onClose();
        } catch (error) {
            setError('Failed to invite users');
            console.log('Error inviting users:', error);
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Invite Users"
        >
            <div
                className="w-full max-w-xl rounded-xl border border-blue-900/40 bg-slate-800 text-slate-100 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-blue-900/40 px-5 py-3">
                    <h2 className="text-lg font-semibold tracking-wide">Invite Users</h2>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        aria-label="Close"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-5 py-4">
                    {isLoadingUsers && <p className="text-sm text-slate-400">Loading users...</p>}
                    {error && (
                        <p className="mb-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                            {error}
                        </p>
                    )}
                    {users.length === 0 && !isLoadingUsers && (
                        <p className="text-sm text-slate-400">No users found</p>
                    )}

                    <div className="mt-2 space-y-2">
                        {users.length > 0 &&
                            users.map((user) => {
                                const isChecked = selectedMembers.includes(user.id);

                                return (
                                    <label
                                        key={user.id}
                                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                                            isChecked
                                                ? 'border-blue-700 bg-slate-700/40'
                                                : 'border-blue-900/30 hover:bg-slate-700/30'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="size-4 accent-blue-600"
                                            value={user.id}
                                            checked={isChecked}
                                            onChange={(e) => {
                                                if (e.target.checked)
                                                    setSelectedMembers([
                                                        ...selectedMembers,
                                                        user.id,
                                                    ]);
                                                else
                                                    setSelectedMembers(
                                                        selectedMembers.filter(
                                                            (id) => id !== user.id
                                                        )
                                                    );
                                            }}
                                        />

                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name || user.id}
                                                className="size-9 rounded-full object-cover border border-blue-900/30"
                                            />
                                        ) : (
                                            <div className="size-9 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-semibold">
                                                {(user.name || user.id).charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <span className="font-medium text-slate-100 text-sm">
                                            {user.name || user.id}
                                        </span>
                                    </label>
                                );
                            })}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isInviting}
                            className="border-blue-900/40 text-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleInvite}
                            disabled={!selectedMembers.length || isInviting}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            {isInviting ? 'Inviting...' : 'Invite'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteModal;
b
