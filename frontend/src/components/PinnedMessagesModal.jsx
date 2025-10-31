import { useEffect } from 'react';
import { XIcon } from 'lucide-react';

function PinnedMessagesModal({ pinnedMessages = [], onClose }) {
    // Close on Escape
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const stop = (e) => e.stopPropagation();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Pinned Messages"
        >
            <div
                className="w-full max-w-xl rounded-xl border border-blue-900/40 bg-slate-800 text-slate-100 shadow-2xl"
                onClick={stop}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-blue-900/40 px-5 py-3">
                    <h2 className="text-lg font-semibold tracking-wide text-slate-100">
                        Pinned Messages
                    </h2>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        aria-label="Close pinned messages"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto px-5 py-3">
                    {pinnedMessages.length === 0 && (
                        <div className="py-10 text-center text-slate-400">No pinned messages</div>
                    )}

                    {pinnedMessages.map((msg) => {
                        const user = msg.user || {};
                        const avatar = user.image;
                        const name = user.name || user.id || 'Unknown';
                        const text = msg.text || '';
                        return (
                            <div
                                key={msg.id}
                                className="flex items-start gap-3 py-3 border-b border-blue-900/30 last:border-b-0"
                            >
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt={name}
                                        className="mt-0.5 h-9 w-9 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-slate-200">
                                        {String(name).charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-slate-200">{name}</div>
                                    <div className="mt-1 whitespace-pre-line text-sm text-slate-100/90">
                                        {text}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PinnedMessagesModal;
