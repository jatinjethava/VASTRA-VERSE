import { getAllUserNotifications, readAllNotifications, markAsReadNotification } from "../Hooks/notification"
import { FaRegBell, FaCheck, FaBoxOpen, FaRegCreditCard, FaTruck, FaRegFileAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../index.css'

export const Notification = () => {

    const { data, isLoading } = getAllUserNotifications();
    const { mutate: readAll, isPending: isReadAllPending } = readAllNotifications();
    const { mutate: markAsRead, isPending: isMarkAsReadPending } = markAsReadNotification();

    const getIconForType = (type: string) => {
        const baseClass = "text-sm sm:text-base";
        switch (type) {
            case "order": return <FaBoxOpen className={`text-neutral-300 ${baseClass}`} />;
            case "payment": return <FaRegCreditCard className={`text-neutral-300 ${baseClass}`} />;
            case "shipping": return <FaTruck className={`text-neutral-300 ${baseClass}`} />;
            case "blog": return <FaRegFileAlt className={`text-neutral-300 ${baseClass}`} />;
            case "account": return <FaUser className={`text-neutral-300 ${baseClass}`} />;
            default: return <FaRegBell className={`text-neutral-300 ${baseClass}`} />;
        }
    }

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " seconds ago";
    }

    return (
        <div className="min-h-screen bg-[#fafafa] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
                    <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.25em] block mb-1">
                            Client Communications
                        </span>
                        <h1 className="editorial-text text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-neutral-900">
                            Atelier <span className="italic font-serif font-normal">Dispatches</span>
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-light">
                            Real-time records of your garment reservations, shipping, and account privileges.
                        </p>
                    </div>
                    {data?.notifications && data.notifications.length > 0 && (
                        <button
                            onClick={() => readAll()}
                            disabled={isReadAllPending}
                            className="flex shrink-0 items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] transition-all shadow-md shadow-black/10 disabled:opacity-50 cursor-pointer"
                        >
                            <FaCheck className="text-[10px]" />
                            <span>Mark all as read</span>
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="dot-spinner">
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {(!data?.notifications || data.notifications.length === 0) ? (
                            <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-neutral-200/80 shadow-sm">
                                <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                    <FaRegBell className="text-neutral-400 text-xl" />
                                </div>
                                <h3 className="editorial-text text-xl font-light text-neutral-900 mb-1">No notifications logged</h3>
                                <p className="text-neutral-400 text-xs sm:text-sm font-light">When dispatches or updates arrive, they will appear here in chronological order.</p>
                            </div>
                        ) : (
                            data.notifications.map((notification: any) => (
                                <div
                                    key={notification._id}
                                    className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 ${notification.isRead
                                        ? 'bg-white border-neutral-200/80 hover:border-black/30 shadow-sm'
                                        : 'bg-[#0c0c0e] border-white/10 text-white shadow-xl'
                                        }`}
                                >
                                    {!notification.isRead && (
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                    )}
                                    <div className="p-3.5 sm:p-7 flex flex-row gap-3 sm:gap-6 items-start">
                                        <div className={`shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${notification.isRead ? 'bg-neutral-100 text-neutral-800' : 'bg-white/10 text-white border border-white/15'
                                            }`}>
                                            {getIconForType(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 mb-1 sm:mb-1.5">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    {!notification.isRead && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                                    )}
                                                    <h4 className={`text-[11px] sm:text-base font-normal tracking-tight truncate ${notification.isRead ? 'text-neutral-900' : 'text-white'
                                                        }`}>
                                                        {notification.title}
                                                    </h4>
                                                </div>
                                                <span className={`text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.15em] whitespace-nowrap mt-0.5 sm:mt-0 ${notification.isRead ? 'text-neutral-400' : 'text-white/40'
                                                    }`}>
                                                    {timeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-[10px] sm:text-sm leading-relaxed mb-3 sm:mb-4 font-light ${notification.isRead ? 'text-neutral-500' : 'text-white/70'
                                                }`}>
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center gap-3 sm:gap-4 pt-1">
                                                {notification.actionUrl && (
                                                    <Link
                                                        to={notification.actionUrl.startsWith('/') ? notification.actionUrl : `/${notification.actionUrl}`}
                                                        onClick={() => {
                                                            if (!notification.isRead) markAsRead(notification._id);
                                                        }}
                                                        className={`text-[9px] sm:text-xs font-medium uppercase tracking-[0.15em] hover:underline underline-offset-4 transition-all ${notification.isRead ? 'text-black' : 'text-white'
                                                            }`}
                                                    >
                                                        View Dossier &rarr;
                                                    </Link>
                                                )}

                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        disabled={isMarkAsReadPending}
                                                        className="text-[9px] sm:text-xs font-medium text-white/50 hover:text-white transition-colors uppercase tracking-[0.15em] cursor-pointer"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}