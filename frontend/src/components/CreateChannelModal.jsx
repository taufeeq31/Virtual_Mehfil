import { useChatContext } from 'stream-chat-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import { AlertCircle, Hash, Lock, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import * as Sentry from '@sentry/react';

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

    // fetch users for adding to channel
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
                setUsers(response.users || []);
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

    // reset modal state on close
    useEffect(() => {
        setChannelName('');
        setDescription('');
        setSelectedMembers([]);
        setError('');
        setChannelType('public');
    }, []);

    //auto-select members for public channels
    useEffect(() => {
        if (channelType === 'public') {
            setSelectedMembers(users.map((user) => user.id));
        } else {
            setSelectedMembers([]);
        }
    }, [channelType, users]);

    const validateChannelName = (name) => {
        if (!name.trim()) return 'Channel name is required,';
        if (name.length < 3) return 'Channel name must be at least 3 characters long.';
        if (name.length > 22) return 'Channel name must be less than 23 characters long.';

        return '';
    };

    const handleChannelNameChange = async (e) => {
        const value = e.target.value;
        setChannelName(value);
        setError(validateChannelName(value));
    };

    const handleMemberToggle = (userId) => {
        {
            if (selectedMembers.includes(userId)) {
                setSelectedMembers(selectedMembers.filter((uid) => uid !== userId));
            } else {
                setSelectedMembers([...selectedMembers, userId]);
            }
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
            const channelId = channelName
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-_]/g, '')
                .slice(0, 20);

            // prepare channel data
            const channelData = {
                name: channelName.trim(),
                created_by_id: client.user.id,
                members: [client.user.id, ...selectedMembers],
            };

            if (description) {
                channelData.description = description;
            }

            if (channelType === 'private') {
                channelData.private = true;
                channelData.visiblity = 'private';
            } else {
                channelData.visiblity = 'public';
                channelData.discoverable = true; // custom field to mark public channels
            }

            const channel = client.channel('messaging', channelId, channelData);

            await channel.watch();
            setActiveChannel(channel);
            setSearchParams({ channel: channelId });

            toast.success(`Channel "${channelName}" created successfully!`);
            onClose();
        } catch (error) {
            console.error('Error creating channel:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-xl border-white/10 bg-neutral-950/70 text-neutral-100 shadow-2xl shadow-black/40 backdrop-blur-md">
                <CardHeader className="flex items-start gap-2">
                    <CardTitle className="text-base font-semibold tracking-tight">Create a channel</CardTitle>
                    <div className="ml-auto">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-neutral-400 hover:text-neutral-100 hover:bg-white/5 rounded-lg"
                            aria-label="Close"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
                                <AlertCircle className="size-4 text-neutral-300" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Channel Name */}
                        <div className="space-y-2">
                            <Label htmlFor="channelName" className="text-neutral-300">Channel name</Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <Hash className="size-4 text-neutral-400/80" />
                                </div>
                                <Input
                                    id="channelName"
                                    value={channelName}
                                    onChange={handleChannelNameChange}
                                    placeholder="e.g. marketing"
                                    autoFocus
                                    maxLength={22}
                                    className={"pl-9"}
                                    aria-invalid={Boolean(error)}
                                />
                            </div>
                            {channelName && (
                                <p className="text-xs text-neutral-400">Channel ID will be: #{channelName
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .replace(/[^a-z0-9-_]/g, '')}
                                </p>
                            )}
                        </div>

                        {/* Channel Type */}
                        <div className="space-y-2">
                            <Label>Channel type</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Public */}
                                <label className="group relative flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/0 p-3 transition-colors duration-200 hover:bg-white/5">
                                    <input
                                        type="radio"
                                        value="public"
                                        checked={channelType === 'public'}
                                        onChange={(e) => setChannelType(e.target.value)}
                                        className="peer absolute opacity-0"
                                    />
                                    <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-200">
                                        <Hash className="size-4" />
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="text-sm font-medium text-neutral-100">Public</span>
                                        <span className="text-xs text-neutral-400">Anyone can join this channel</span>
                                    </span>
                                    <span className="absolute inset-0 rounded-xl ring-0 ring-white/20 transition peer-checked:ring-2" />
                                </label>

                                {/* Private */}
                                <label className="group relative flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/0 p-3 transition-colors duration-200 hover:bg-white/5">
                                    <input
                                        type="radio"
                                        value="private"
                                        checked={channelType === 'private'}
                                        onChange={(e) => setChannelType(e.target.value)}
                                        className="peer absolute opacity-0"
                                    />
                                    <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-200">
                                        <Lock className="size-4" />
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="text-sm font-medium text-neutral-100">Private</span>
                                        <span className="text-xs text-neutral-400">Only invited members can join</span>
                                    </span>
                                    <span className="absolute inset-0 rounded-xl ring-0 ring-white/20 transition peer-checked:ring-2" />
                                </label>
                            </div>
                        </div>

                        {/* Add members (private only) */}
                        {channelType === 'private' && (
                            <div className="space-y-3">
                                <Label>Add members</Label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedMembers(users.map((u) => u.id))}
                                        disabled={loadingUsers || users.length === 0}
                                        className="rounded-lg border-white/15 bg-transparent text-neutral-200 hover:bg-white/5"
                                    >
                                        <Users className="size-4" />
                                        Select everyone
                                    </Button>
                                    <span className="text-xs text-neutral-400">{selectedMembers.length} selected</span>
                                </div>

                                <div className="max-h-60 overflow-auto rounded-xl border border-white/10">
                                    {loadingUsers ? (
                                        <div className="p-4 text-sm text-neutral-400">Loading users...</div>
                                    ) : users.length === 0 ? (
                                        <div className="p-4 text-sm text-neutral-400">No users found</div>
                                    ) : (
                                        <ul className="divide-y divide-white/5">
                                            {users.map((user) => (
                                                <li key={user.id} className="flex items-center gap-3 p-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(user.id)}
                                                        onChange={() => handleMemberToggle(user.id)}
                                                        className="size-4 accent-white/80"
                                                    />
                                                    {user.image ? (
                                                        <img
                                                            src={user.image}
                                                            alt={user.name || user.id}
                                                            className="size-8 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="size-8 rounded-md bg-white/10 text-neutral-200 grid place-items-center text-xs font-medium">
                                                            {(user.name || user.id).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-neutral-200">{user.name || user.id}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What's this channel about?"
                                rows={3}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="rounded-lg border-white/15 bg-transparent text-neutral-200 hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!channelName.trim() || isCreating}
                            className="rounded-lg bg-white text-neutral-950 hover:bg-white/90"
                        >
                            {isCreating ? 'Creating…' : 'Create channel'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CreateChannelModal;
