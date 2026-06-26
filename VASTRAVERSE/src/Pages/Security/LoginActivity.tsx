import { useLoginActivity } from "../../Hooks/user";
import '../../index.css';

export const LoginActivity = ({ setOpenLoginActivity }: { setOpenLoginActivity: (open: boolean) => void }) => {

    const { data: loginActivities, isPending: loginActivitiesLoading } = useLoginActivity();

    return (
        <>
            <div className="animate-fade-in-up-delay-1 fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="animate-fade-in-up-delay-1 fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setOpenLoginActivity(false)}
                ></div>
                <div className="animate-fade-in-up-delay-2 relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-4 sm:p-8 transform transition-all max-h-[80vh] flex flex-col">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 shrink-0">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Login Activity</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Review your recent active sessions.</p>
                        </div>
                        <button
                            onClick={() => setOpenLoginActivity(false)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {loginActivitiesLoading ? (
                            <div className="flex min-h-[18vh] items-center justify-center">
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
                        ) : loginActivities && loginActivities.length > 0 ? (
                            <div className="space-y-4">
                                {loginActivities.map((activity: any, index: number) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
                                            <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm text-gray-600 shrink-0">
                                                {activity.device === "mobile" ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                                    {activity.os || "Unknown OS"} • {activity.browser || "Unknown Browser"}
                                                </h4>
                                                <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                                                    IP: {activity.ipAddress}
                                                </p>
                                                {index === 0 && (
                                                    <span className="inline-flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2 px-1.5 sm:px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] sm:text-xs font-semibold border border-green-100">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                        Current Session
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 w-full sm:w-auto pl-11 sm:pl-0 mt-1 sm:mt-0">
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-500 whitespace-nowrap">
                                                {new Date(activity.loginAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                                {(() => {
                                                    const diffDays = Math.floor(
                                                        (Date.now() - new Date(activity.loginAt).getTime()) /
                                                        (1000 * 60 * 60 * 24)
                                                    );

                                                    if (diffDays < 1) {
                                                        return "today";
                                                    }

                                                    if (diffDays < 7) {
                                                        return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
                                                    }

                                                    if (diffDays < 30) {
                                                        const weeks = Math.floor(diffDays / 7);
                                                        return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
                                                    }

                                                    const months = Math.floor(diffDays / 30);
                                                    return `${months} month${months !== 1 ? "s" : ""} ago`;
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>No recent login activity found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}