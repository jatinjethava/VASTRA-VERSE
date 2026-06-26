import { getAllUserNotifications, readAllNotifications, markAsReadNotification } from "../Hooks/notification"
import { FaRegBell, FaCheck, FaBoxOpen, FaRegCreditCard, FaTruck, FaRegFileAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../index.css'

export const Notification = () => {

    const { data, isLoading } = getAllUserNotifications();
    const { mutate: readAll, isPending: isReadAllPending } = readAllNotifications();
    const { mutate: markAsRead, isPending: isMarkAsReadPending } = markAsReadNotification();

    const getIconForType = (type: string) => {
        const baseClass = "text-sm sm:text-lg";
        switch (type) {
            case "order": return <FaBoxOpen className={`text-blue-500 ${baseClass}`} />;
            case "payment": return <FaRegCreditCard className={`text-green-500 ${baseClass}`} />;
            case "shipping": return <FaTruck className={`text-purple-500 ${baseClass}`} />;
            case "blog": return <FaRegFileAlt className={`text-orange-500 ${baseClass}`} />;
            case "account": return <FaUser className={`text-teal-500 ${baseClass}`} />;
            default: return <FaRegBell className={`text-gray-500 ${baseClass}`} />;
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
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-row justify-between items-center mb-6 sm:mb-8 gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 truncate">Notifications</h1>
                        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium line-clamp-1 sm:line-clamp-none">Stay updated with your orders and account activity.</p>
                    </div>
                    {data?.notifications && data.notifications.length > 0 && (
                        <button
                            onClick={() => readAll()}
                            disabled={isReadAllPending}
                            className="flex shrink-0 items-center gap-1 sm:gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all shadow-sm disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                        >
                            <FaCheck className="text-[10px] sm:text-xs" />
                            <span className="hidden sm:inline">Mark all as read</span>
                            <span className="sm:hidden">Read All</span>
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
                    <div className="space-y-3 sm:space-y-4">
                        {(!data?.notifications || data.notifications.length === 0) ? (
                            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                                    <FaRegBell className="text-gray-400 text-lg sm:text-2xl" />
                                </div>
                                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1">No notifications yet</h3>
                                <p className="text-gray-500 text-[10px] sm:text-sm font-medium">When you get notifications, they'll show up here.</p>
                            </div>
                        ) : (
                            data.notifications.map((notification: any) => (
                                <div
                                    key={notification._id}
                                    className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${notification.isRead ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}
                                >
                                    {!notification.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                    )}
                                    <div className="p-4 sm:p-6 flex flex-row gap-3 sm:gap-5 items-start">
                                        <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 mt-1 sm:mt-0 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                                            {getIconForType(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 sm:gap-4 mb-1.5 sm:mb-2">
                                                <h4 className={`text-xs sm:text-sm md:text-base font-bold truncate pr-2 ${notification.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                    {timeAgo(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-[10px] sm:text-xs leading-relaxed mb-3 sm:mb-4 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center gap-3 sm:gap-4">
                                                {notification.actionUrl && (
                                                    <Link
                                                        to={notification.actionUrl.startsWith('/') ? notification.actionUrl : `/${notification.actionUrl}`}
                                                        onClick={() => {
                                                            if (!notification.isRead) markAsRead(notification._id);
                                                        }}
                                                        className="text-[10px] sm:text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
                                                    >
                                                        View Details &rarr;
                                                    </Link>
                                                )}

                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        disabled={isMarkAsReadPending}
                                                        className="text-[10px] sm:text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors uppercase tracking-wider cursor-pointer"
                                                    >
                                                        Mark as read
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