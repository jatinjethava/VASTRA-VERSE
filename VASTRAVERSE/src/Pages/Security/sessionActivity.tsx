import { useGetAllSessions, useLogoutOtherDevices, useRevokeToken } from "../../Hooks/user";

export const SessionActivity = ({ setOpenSessionActivity }: { setOpenSessionActivity: (open: boolean) => void }) => {

    const { data: sessions, isPending: sessionsLoading } = useGetAllSessions();
    const { mutate: logoutOtherDevices, isPending: isLoggingOutOther } = useLogoutOtherDevices();
    const { mutate: revokeToken, isPending: isRevoking } = useRevokeToken();

    return (
        <>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
                    onClick={() => setOpenSessionActivity(false)}
                />
                <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all max-h-[85vh] flex flex-col border border-neutral-200 overflow-hidden z-10">
                    {/* Specular hairline */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-900/20 to-transparent" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0">
                        <div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                                Token Concurrency
                            </span>
                            <h2 className="editorial-text text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                                Active <span className="italic font-serif font-normal">Sessions</span>
                            </h2>
                            <p className="text-xs text-neutral-500 font-light mt-1">
                                Manage authenticated devices and terminate concurrent tokens.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            {sessions && sessions.length > 1 && (
                                <button
                                    onClick={() => logoutOtherDevices()}
                                    disabled={isLoggingOutOther}
                                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                                >
                                    {isLoggingOutOther ? "Revoking..." : "Revoke Other Devices"}
                                </button>
                            )}
                            <button
                                onClick={() => setOpenSessionActivity(false)}
                                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar space-y-3">
                        {sessionsLoading ? (
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
                        ) : sessions && sessions.length > 0 ? (
                            <div className="space-y-3">
                                {sessions.map((activity: any, index: number) => {
                                    const isCurrentSession = activity.token === localStorage.getItem("token");
                                    return (
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
                                                        {isCurrentSession && (
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

                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-auto pl-15 sm:pl-0 border-t sm:border-t-0 border-neutral-200/50 pt-2 sm:pt-0">
                                                <span className="text-xs font-medium text-neutral-900 whitespace-nowrap">
                                                    {new Date(activity.lastActive).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {!isCurrentSession && (
                                                    <button
                                                        onClick={() => revokeToken(activity._id)}
                                                        disabled={isRevoking}
                                                        className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/60 px-3 py-1 rounded-full transition-all disabled:opacity-50 cursor-pointer"
                                                    >
                                                        Revoke Session
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4">
                                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" /></svg>
                                </div>
                                <h3 className="text-sm font-medium text-neutral-900">No Active Sessions</h3>
                                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                                    There are currently no active session tokens registered.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
