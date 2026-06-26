import { useAdminNotifications, useMarkAllAsReadAdmin, useMarkAsRead } from "../Hooks/notification";
import { useUpdateBlogStatus } from "../Hooks/blog";
import { useState } from "react";
import { getButtonConfig } from "../assets/tags";

export const Notification = () => {

    const { data: notifications } = useAdminNotifications();
    const { mutate: updateBlogStatus, isPending: isUpdateBlogStatusPending } = useUpdateBlogStatus();
    const { mutate: markAsRead, isPending: markAsReadPending } = useMarkAsRead();
    const { mutate: markAllAsRead, isPending: markAllAsReadPending } = useMarkAllAsReadAdmin();

    const isPending = isUpdateBlogStatusPending || markAsReadPending || markAllAsReadPending;

    const [filter, setFilter] = useState<string>("all");

    const countUnread = notifications?.filter((notifi: any) => notifi?.isRead === false).length || 0;

    const types = notifications?.map((filterType) => filterType?.type)

    const handleAccept = (id: string) => {
        if (!id) return;
        updateBlogStatus({ id: id, status: "published" });
    };

    const handleReject = (id: string) => {
        if (!id) return;
        updateBlogStatus({ id: id, status: "rejected" });
    };

    const filteredNotifications = notifications?.filter((notification: any) => {
        return filter === "all" || notification.type === filter;
    });

    return (
        <div className="h-screen bg-gray-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h1>
                <button onClick={() => markAllAsRead()} className="cursor-pointer px-4 py-2 text-blue-600 hover:text-blue-800 underline underline-offset-4 font-medium rounded-lg transition-colors flex-1 sm:flex-none">
                    Mark all as read ({countUnread})
                </button>
            </div>

            <div className="mb-5 flex items-center gap-5">
                <label htmlFor="type" className="font-semibold text-gray-800 mr-2">Filter by Type:</label>
                <select onChange={(e) => { setFilter(e.target.value) }} value={filter} name="type" id="type" className="px-5 py-2 border border-gray-200 rounded-lg bg-white">
                    <option value="all">All</option>
                    {Array.from(new Set(types)).map((type: any) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-4 w-full">
                {notifications?.length === 0 && (
                    <div className="text-gray-500 text-center py-4 w-full bg-white rounded-xl shadow-sm border border-gray-100">
                        No new notifications
                    </div>
                )}

                {filteredNotifications?.map((notification: any) => {
                    const buttonConfig = getButtonConfig(notification.type);
                    return (
                        <div
                            key={notification._id}
                            className={`p-4 rounded-xl shadow-sm border w-full ${notification.isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-800">
                                        {notification.type === "blog" && "📝 "}
                                        {notification.type === "order" && "📦 "}
                                        {notification.type === "payment" && "💳 "}
                                        {notification.type === "account" && "👤 "}
                                        {notification.title || "Notification"}
                                    </h3>
                                    {!notification.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm">{notification.message}</p>
                                <span className="text-xs text-gray-400 mt-2 block">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                {notification.type === "blog" && !notification.isRead ? (
                                    <>
                                        <button
                                            onClick={() => { handleAccept(notification.actionUrl); markAsRead(notification._id) }}
                                            disabled={isPending || !notification.actionUrl}
                                            className="cursor-pointer px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none shadow-sm"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => { handleReject(notification.actionUrl); markAsRead(notification._id) }}
                                            disabled={isPending || !notification.actionUrl}
                                            className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none shadow-sm"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : notification.actionUrl ? (
                                    <a
                                        href={
                                            notification.type === "blog"
                                                ? "/admin/blogs"
                                                : notification.actionUrl.startsWith("/")
                                                    ? notification.actionUrl
                                                    : `/${notification.actionUrl}`
                                        }
                                        onClick={() => markAsRead(notification._id)}
                                        className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${buttonConfig.className}`}
                                    >
                                        <span>{buttonConfig.icon}</span>
                                        <span>{buttonConfig.text}</span>
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}