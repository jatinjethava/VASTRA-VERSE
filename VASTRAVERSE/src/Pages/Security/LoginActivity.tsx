import { useLoginActivity } from "../../Hooks/user";
import '../../index.css';

export const LoginActivity = ({ setOpenLoginActivity }: { setOpenLoginActivity: (open: boolean) => void }) => {

    const { data: loginActivities, isPending: loginActivitiesLoading } = useLoginActivity();

    return (
        <>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
                    onClick={() => setOpenLoginActivity(false)}
                />
                <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all max-h-[85vh] flex flex-col border border-neutral-200 overflow-hidden z-10">
                    {/* Specular hairline */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-900/20 to-transparent" />

                    <div className="flex items-start justify-between mb-6 shrink-0">
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                                Access Telemetry
                            </span>
                            <h2 className="editorial-text text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                                Authentication <span className="italic font-serif font-normal">Log</span>
                            </h2>
                            <p className="text-xs text-neutral-500 font-light mt-1">
                                Chronological records of authorized client sessions and network coordinates.
                            </p>
                        </div>
                        <button
                            onClick={() => setOpenLoginActivity(false)}
                            className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar space-y-3">
                        {loginActivitiesLoading ? (
                            <div className="flex min-h-[24vh] items-center justify-center">
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
                            <div className="space-y-3">
                                {loginActivities.map((activity: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 hover:shadow-xs transition-all"
                                    >
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-800 shrink-0 shadow-2xs">
                                                {activity.device === "mobile" ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">
                                                        {activity.os || "Unknown OS"} • {activity.browser || "Unknown Browser"}
                                                    </h4>
                                                    {index === 0 && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider border border-emerald-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            Current Session
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-500 font-mono mt-1">
                                                    IP Address: <span className="text-neutral-700">{activity.ipAddress}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 w-full sm:w-auto pl-15 sm:pl-0 border-t sm:border-t-0 border-neutral-200/50 pt-2 sm:pt-0">
                                            <span className="text-xs font-medium text-neutral-900">
                                                {new Date(activity.loginAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-[11px] font-light text-neutral-500 capitalize">
                                                {(() => {
                                                    const diffDays = Math.floor(
                                                        (Date.now() - new Date(activity.loginAt).getTime()) /
                                                        (1000 * 60 * 60 * 24)
                                                    );

                                                    if (diffDays < 1) {
                                                        return "Active today";
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
                            <div className="text-center py-16 px-4">
                                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <h3 className="text-sm font-medium text-neutral-900">No Authentication History</h3>
                                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                                    No prior login activities have been recorded on this client account.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}