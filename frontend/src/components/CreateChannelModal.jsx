import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useChatContext } from 'stream-chat-react';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';
import { AlertCircleIcon, HashIcon, LockIcon, UsersIcon, XIcon } from 'lucide-react';

const CreateChannelModal = ({ onClose }) => {
    const [channelName, setChannelName] = useState('');
    const [channelType, setChannelType] = useState('public');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [_, setSearchParams] = useSearchParams();

    const { client, setActiveChannel } = useChatContext();

    // fetch users for member selection
    useEffect(() => {
        const fetchUsers = async () => {
            if (!client?.user) return;
            setLoadingUsers(true);

            try {
                const response = await client.queryUsers(
                    { id: { $ne: client.user.id } },
                    { name: 1 },
                    { limit: 100 }
                );

                const usersOnly = response.users.filter(
                    (user) => !user.id.startsWith('recording-')
                );

                setUsers(usersOnly || []);
            } catch (error) {
                console.error('Error fetching users:', error);
                Sentry.captureException(error, {
                    tags: { component: 'CreateChannelModal' },
                    extra: { context: 'fetch_users_for_channel' },
                });
                setUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [client]);

    // reset the form on open: this is not needed, we just deleted it later in the video
    // useEffect(() => {
    //   setChannelName("");
    //   setDescription("");
    //   setChannelType("public");
    //   setError("");
    //   setSelectedMembers([]);
    // }, []);

    // auto-select all users for public channels
    useEffect(() => {
        if (channelType === 'public') setSelectedMembers(users.map((u) => u.id));
        else setSelectedMembers([]);
    }, [channelType, users]);

    const validateChannelName = (name) => {
        if (!name.trim()) return 'Channel name is required';
        if (name.length < 3) return 'Channel name must be at least 3 characters';
        if (name.length > 22) return 'Channel name must be less than 22 characters';

        return '';
    };

    const handleChannelNameChange = (e) => {
        const value = e.target.value;
        setChannelName(value);
        setError(validateChannelName(value));
    };

    const handleMemberToggle = (id) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter((uid) => uid !== id));
        } else {
            setSelectedMembers([...selectedMembers, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateChannelName(channelName);
        if (validationError) return setError(validationError);

        if (isCreating || !client?.user) return;

        setIsCreating(true);
        setError('');

        try {
            // MY COOL CHANNEL !#1 => my-cool-channel-1
            const channelId = channelName
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-_]/g, '')
                .slice(0, 20);

            // prepare the channel data

            const channelData = {
                name: channelName.trim(),
                created_by_id: client.user.id,
                members: [client.user.id, ...selectedMembers],
            };

            if (description) channelData.description = description;

            if (channelType === 'private') {
                channelData.private = true;
                channelData.visibility = 'private';
            } else {
                channelData.visibility = 'public';
                channelData.discoverable = true;
            }

            const channel = client.channel('messaging', channelId, channelData);

            await channel.watch();

            setActiveChannel(channel);
            setSearchParams({ channel: channelId });

            toast.success(`Channel "${channelName}" created successfully!`);
            onClose();
        } catch (error) {
            console.log('Error creating the channel', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Create a Channel</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-950 hover:text-red-500 p-1 rounded-full transition duration-150"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
                >
                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-300">
                            <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Channel name */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="channelName" className="text-sm font-medium text-slate-700">
                            Channel Name
                        </label>
                        <div className="relative flex items-center">
                            <HashIcon className="absolute left-3 w-4 h-4 text-blue-700" />
                            <input
                                id="channelName"
                                type="text"
                                value={channelName}
                                onChange={handleChannelNameChange}
                                placeholder="e.g. marketing-team"
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all shadow-sm text-black placeholder:text-neutral-500 ${
                                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                }`}
                                autoFocus
                                maxLength={22}
                            />
                        </div>

                        {/* channel id  preview */}
                        {channelName.trim() && (
                            <div className="text-sm text-neutral-950 mt-1 pl-10">
                                Channel ID will be: #
                                {channelName
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .replace(/[^a-z0-9-_]/g, '')}
                            </div>
                        )}
                    </div>

                    {/* CHANNEL TYPE */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-slate-700">Channel Type</label>

                        <div className="space-y-3">
                            <label className="flex items-start p-4 border border-gray-300 rounded-xl cursor-pointer transition hover:bg-blue-50/50 has-checked:border-blue-700">
                                <input
                                    type="radio"
                                    value="public"
                                    checked={channelType === 'public'}
                                    onChange={(e) => setChannelType(e.target.value)}
                                    className="form-radio mt-1 mr-3 text-blue-700 border-gray-300 focus:ring-blue-700"
                                />
                                <div className="flex items-start space-x-3 text-gray-700">
                                    <HashIcon className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-base">Public</div>
                                        <div className="text-sm text-gray-500">
                                            Anyone can join this channel
                                        </div>
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-start p-4 border border-gray-300 rounded-xl cursor-pointer transition hover:bg-blue-50/50 has-checked:border-blue-700">
                                <input
                                    type="radio"
                                    value="private"
                                    checked={channelType === 'private'}
                                    onChange={(e) => setChannelType(e.target.value)}
                                    className="form-radio mt-1 mr-3 text-blue-700 border-gray-300 focus:ring-blue-700"
                                />
                                <div className="flex items-start space-x-3 text-gray-700">
                                    <LockIcon className="w-5 h-5 flex-shrink-0 text-gray-500 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-base">Private</div>
                                        <div className="text-sm text-gray-500">
                                            Only invited members can join
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* add members component (Private Only) */}
                    {channelType === 'private' && (
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Add Members
                            </label>
                            <div className="flex justify-between text-black items-center py-2">
                                <button
                                    type="button"
                                    className="flex items-center space-x-1.5 bg-gray-200 text-gray-700 py-1.5 px-3 rounded-full text-sm font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                                    onClick={() => setSelectedMembers(users.map((u) => u.id))}
                                    disabled={loadingUsers || users.length === 0}
                                >
                                    <UsersIcon className="w-4 h-4" />
                                    <span>Select All</span>
                                </button>
                                <span className="text-sm text-blue-700 font-medium">
                                    {selectedMembers.length} selected
                                </span>
                            </div>

                            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-1 shadow-inner custom-scrollbar">
                                {loadingUsers ? (
                                    <p className="text-gray-500 p-2 text-center">
                                        Loading users...
                                    </p>
                                ) : users.length === 0 ? (
                                    <p className="text-gray-500 p-2 text-center">No users found</p>
                                ) : (
                                    users.map((user) => (
                                        <label
                                            key={user.id}
                                            className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(user.id)}
                                                onChange={() => handleMemberToggle(user.id)}
                                                className="form-checkbox text-blue-700 rounded border-gray-300 focus:ring-blue-700"
                                            />
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name || user.id}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700 flex-shrink-0">
                                                    <span>
                                                        {(user.name || user.id)
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-black font-medium">
                                                {user.name || user.id}
                                            </span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-700">
                            Description (optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this channel about? (e.g., discussions about project alpha)"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all text-black placeholder:text-neutral-500"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 -mx-6 -mb-6 mt-6 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!channelName.trim() || isCreating || error}
                            className="bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? 'Creating...' : 'Create Channel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Simple App component to demonstrate the modal
const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <style>{`
                /* Simple CSS for custom scrollbar in the form */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgb(30 41 59 / 0.2); /* Slate-800 with low opacity */
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
            `}</style>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
                Open Create Channel Modal
            </button>

            {isModalOpen && <CreateChannelModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default CreateChannelModal;
